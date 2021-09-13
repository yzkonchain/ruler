import { ethers } from 'ethers'
import { pools, tokenList, poolConfig, signerNoAccount, abiCoder, STYLE } from '@/config'
import { useSnackbar } from 'notistack'
import { Price } from '@/hooks'
import callbackInfo from './callbackInfo'

const ZERO = ethers.constants.Zero
const with_loss = (x) => x.mul(995).div(1000)
const toNonExponential = (num) => {
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}
const format = (num, n, fixed) => {
  const res = parseFloat(ethers.utils.formatUnits(num, n || 18))
  return fixed ? res.toFixed(fixed) : res
}
const unformat = (num, n) => ethers.utils.parseUnits(String(num) || '', n || 18)
const formatMap = (data, n) => (n ? data.map((v, k) => format(v, n[k] || 18)) : data.map((v) => format(v)))
const decode = (method, data) => ethers.utils.defaultAbiCoder.decode(abiCoder[method], data)
const toHex = (num) => `0x${num.toString(16)}`

const calc_apy_basic = ([sx, sy, sk], [bond, want], swap_sqp) => {
  const one = ethers.utils.parseEther('1')
  const mul = ethers.BigNumber.from(1e9)
  return sk.eq('0')
    ? sk
    : sx
        .add(bond || ZERO)
        .add(sk)
        .mul(one)
        .div(sy.add(want || ZERO).add(sk.mul(swap_sqp).div(mul)))
        .sub(one)
}
const calc_apy = ({ swap: { sx, sy, sk } }, [bond, want], { swap_sqp, expiry_time }) =>
  (format(calc_apy_basic([sx, sy, sk], [bond, want], swap_sqp)) * 3155692600000) / (expiry_time * 1000 - new Date())
const calc_apy_format = ([sx, sy, sk], { swap_sqp, expiry_time }, time) => {
  const basic = sk == 0 ? 0 : (sx + sk) / (sy + (sk * swap_sqp) / 1000000000) - 1
  return (basic * 3155692600000) / (expiry_time * 1000 - (time || new Date()))
}

const calc_slip = ({ swap: { sx, sy, sk } }, [bond, want], { swap_sqp, expiry_time }) =>
  (format(
    calc_apy_basic([sx, sy, sk], [bond, want], swap_sqp).sub(calc_apy_basic([sx, sy, sk], [null, null], swap_sqp)),
  ) *
    3155692600000) /
  (expiry_time * 1000 - new Date())

export default function contract() {
  const { enqueueSnackbar } = useSnackbar()
  const notify = (method, status) => enqueueSnackbar(callbackInfo(method, status))
  const callback = (type) => {
    switch (type) {
      case true:
        return (method) => (resp) =>
          resp.wait().then(({ status }) => {
            notify(method, status)
            return status == 1
          })
      case false:
        return (err) => {
          switch (err.code) {
            case 4001:
              notify('cancel')
              break
            default:
              break
          }
          return false
        }
      default:
        return console.log
    }
  }
  const exchange = async (pool, method, args, cb) => {
    const ct = pool.ct
    if (!ct.signer) return false
    const gasLimit = await ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
    return await ct.populateTransaction[method](...args)
      .then((tx) => ct.signer.sendTransaction({ ...tx, gasLimit }))
      .then(callback(true)(cb))
      .catch(callback(false))
  }
  return {
    calc_apy,
    calc_slip,
    notify,
    async fetch_state(pool) {
      const init = { balance: {}, allowance: {}, max: { swap: {}, borrow: {} } }
      const me = pool.ct.signer ? pool.ct.signer.getAddress() : null
      ;[
        init.balance.bond,
        init.balance.want,
        init.balance.call,
        init.balance.coll,
        init.allowance.bond,
        init.allowance.want,
      ] = await Promise.all([
        me ? pool.bond.ct.balanceOf(me) : ZERO,
        me ? pool.want.ct.balanceOf(me) : ZERO,
        me ? pool.call.ct.balanceOf(me) : ZERO,
        me ? pool.coll.ct.balanceOf(me) : ZERO,
        me ? pool.bond.ct.allowance(me, pool.addr) : ZERO,
        me ? pool.want.ct.allowance(me, pool.addr) : ZERO,
      ])
      // ;[init.max.swap.want, init.max.swap.coll, init.max.borrow.bond] = await Promise.all([
      //   me ? pool.ct.get_dy(init.balance.coll) : ZERO,
      //   me ? pool.ct.get_dx(init.balance.want) : ZERO,
      //   ZERO,
      // ])
      // const { bond, want, call, coll } = init.balance
      // console.log(formatMap([bond, want, call, coll]))
      return init
    },
    async approve(token, pool) {
      const method = 'approve'
      const args = [pool.addr, ethers.constants.MaxUint256]
      const gasLimit = await token.ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
      return await token.ct.populateTransaction[method](...args)
        .then((tx) => ({ ...tx, gasLimit }))
        .then((tx) => pool.ct.signer.sendTransaction(tx))
        .then(callback(true)('approve'))
        .catch(callback(false))
    },
    async borrow(bond, want, pool) {
      const method = 'borrow_want'
      const args = [bond, with_loss(want)]
      const cb = 'borrow'
      return await exchange(pool, method, args, cb)
    },
    async repay(want, pool) {
      const method = 'burn_call'
      const args = [want]
      return await exchange(pool, method, args, 'repay')
    },
    async lend(want, pool) {
      const method = 'swap_want_to_min_coll'
      const args = [with_loss(await pool.ct.get_dx(want)), want]
      const cb = 'lend'
      return await exchange(pool, method, args, cb)
    },
    async redeem(coll, pool) {
      const method = 'swap_coll_to_min_want'
      const args = [coll, with_loss(await pool.ct.get_dy(coll))]
      const cb = 'redeem'
      return await exchange(pool, method, args, cb)
    },
    async mint(n, pool) {
      const method = 'mint_dual'
      const args = [n]
      const cb = 'mint'
      return await exchange(pool, method, args, cb)
    },
    async deposit(want, coll, pool) {
      const clpt = await pool.ct.get_dk(coll, want)
      return await exchange(pool, 'mint', [coll, want, with_loss(clpt)], 'deposit')
    },
  }
}
