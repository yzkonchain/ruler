import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext } from '@/config'
import { MyButton, Amount } from '@/components/Modules'

const ZERO = ethers.constants.Zero
const INIT = {
  coll: ZERO,
  want: ZERO,
  I: { coll: '', want: '' },
  old: { coll: '', want: '' },
}
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)
const with_loss = (x) => x.mul(995).div(1000)

export default function Lend() {
  const {
    state: { signer, controller },
  } = useContext(context)
  const {
    liteState: { bond, want, coll, pool, data },
    classesChild: classes,
    handleClick,
  } = useContext(liteContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    const coll = parse(state.I.coll)
    const want = parse(state.I.want)
    if (!want.eq(state.want)) {
      pool.ct
        .get_dx(want)
        .then((coll) => {
          // console.log(format(want), format(coll))
          setState({ coll, want, I: { ...state.I, coll: format(coll) } })
        })
        .catch(() => {
          if (state.I.want.length > state.old.want.length && state.I.want.length < format(state.want).length) {
            controller.notify('balance', 'insufficient')
          }
        })
    } else if (!coll.eq(state.coll)) {
      pool.ct
        .get_dy(coll)
        .then((want) => {
          setState({ coll, want, I: { ...state.I, want: format(want) } })
        })
        .catch(() => {
          if (state.I.coll.length > state.old.coll.length && state.I.coll.length < format(state.coll).length) {
            controller.notify('balance', 'insufficient')
          }
        })
    }
  }, [state.I])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <Amount
              title="want"
              State={{
                state,
                setState,
                token: want,
                max: data.balance.want,
                if_max: data.allowance.want.gt('100000000000000000000000000000000'),
              }}
              style={{ height: '90px' }}
            />
          </div>
          <span className={classes.icon}>swap_horiz</span>
          <Amount
            title="coll"
            State={{
              state,
              setState,
              token: coll,
              max: data.balance.coll,
              if_max: data.balance.coll.gt('0'),
            }}
            style={{ height: '90px' }}
          />
        </div>

        <div className={classes.buttonOne}>
          <div>
            <MyButton
              name="Lend"
              onClick={() => handleClick('lend')(state.want).then(() => setState({ I: { coll: '', want: '' } }))}
              disabled={
                ZERO.eq(state.coll) || parse(state.I.want).gt(data.balance.want) || !parse(state.I.want).eq(state.want)
              }
            />
            <MyButton
              name="Exit"
              onClick={() => handleClick('redeem')(state.coll).then(() => setState({ I: { coll: '', want: '' } }))}
              disabled={
                ZERO.eq(state.want) || parse(state.I.coll).gt(data.balance.coll) || !parse(state.I.coll).eq(state.coll)
              }
            />
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}
