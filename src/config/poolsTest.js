import { USDT, USDC } from '@/assets/svg/token'
import { ethers } from 'ethers'
import { Token, Pool } from './makePool'

var tokenList = {},
  pools = []

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
  factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  pricePool: '0x5BBBE4Da8b5AF36482F75747Ee38ddFDf3F6e4D9',
  collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
  stablecoin: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
  browser: 'https://ropsten.etherscan.io',
  gasAdjustment: 150,
}

// new ethers.Contract(poolConfig.factory, abi, signerNoAccount)
//   .getPool(poolConfig.collar, poolConfig.stablecoin, 3000)
//   .then((pricePool) => new ethers.Contract(pricePool, abi, signerNoAccount).slot0())

tokenList = {
  ...Token('SWAP', poolConfig.pricePool),
  ...Token('COLLAR', poolConfig.collar),
  ...Token('COVER', '0xB7003F62625835C680ebe3BCDE5C7ff7c2910BB8', USDT),
}

pools = [
  Pool(
    {
      bond: '0xB7003F62625835C680ebe3BCDE5C7ff7c2910BB8',
      want: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
      r1: {
        addr: '0x6253d46aa1cf3559Dccd9ac059921782FacdE955',
        coll: '0x7f6FBEA048BdD95735D715Ff4c5582dcAb509952',
        call: '0xDFcA1Ae7F6758F34981aA6c515718f4BA284490e',
        expiry_time: 1696089600,
      },
    },
    tokenList,
  ),
]

export { tokenList, pools, poolConfig }
