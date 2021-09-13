import { ethers } from 'ethers'
import { useContext, useReducer, useEffect, useMemo, useState, useCallback, Suspense, lazy } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, liteContext, pools, poolSelect, STYLE, textInfo } from '@/config'
import { MyTabs, Loading } from '@/components/Modules'
import PoolSelector from './PoolSelector'

const useStyles = makeStyles({
  root: {
    height: 'calc(100vh - 56px)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&>div': {
      position: 'relative',
      backgroundColor: 'white',
      '&:first-child': {
        zIndex: '4',
        margin: '20px 20px 0 20px',
      },
      '&:nth-child(2)': {
        zIndex: '2',
        transform: 'translateY(-13px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 60px)',
      },
      '&:nth-child(3)': {
        zIndex: '1',
        transform: 'translateY(-26px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 80px)',
      },
      [STYLE.MOBILE]: {
        width: 'calc(100% - 40px)',
      },
      [STYLE.PC]: {
        width: '900px',
        '&:nth-child(2)': {
          width: '880px',
        },
        '&:nth-child(3)': {
          width: '860px',
        },
      },
    },
  },
  content: {
    zIndex: '3',
    position: 'relative',
    backgroundColor: 'white',
    border: '#4C4C4C 2px solid',
    borderTop: 'none',
    padding: '15px',
  },
  tip: {},
})
const useStylesChild = makeStyles({
  root: {},
  amount: {
    display: 'flex',
    justifyContent: 'space-between',
    '&>div': {
      width: '50%',
    },
  },
  icon: {
    fontFamily: 'Material Icons',
    marginTop: '35px',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    margin: '0 10px',
  },
  buttonOne: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>button': {
        width: 'calc(50% - 25px)',
      },
    },
  },
})

const ZERO = ethers.constants.Zero
const data_zero = {
  balance: {
    bond: ZERO,
    want: ZERO,
    call: ZERO,
    coll: ZERO,
    clpt: ZERO,
    collar: ZERO,
  },
  allowance: {
    bond: ZERO,
    want: ZERO,
  },
  earned: {
    collar: ZERO,
  },
  swap: {
    sx: ZERO,
    sy: ZERO,
    sk: ZERO,
  },
  apy: 0,
}

export default function Lite() {
  const classes = useStyles()
  const classesChild = useStylesChild()
  const {
    state: { signer, controller },
  } = useContext(context)
  const [loading, setLoading] = useState(false)
  const [liteState, setLiteState] = useReducer((o, n) => (typeof n === 'function' ? n(o) : { ...o, ...n }), {
    tabs: 0,
    tabsChild: 0,
    round: [0, !pools[0].r2],
    pool: pools[0].r1,
    coll: pools[0].r1.coll,
    bond: pools[0].r1.bond,
    want: pools[0].r1.want,
    data: data_zero,
  })
  const { tabs, tabsChild, pool, data, round } = liteState
  const tabsList = ['Borrow', 'Swap']

  const Content = useCallback(
    lazy(() => import(`./${tabsList[tabs]}`)),
    [tabs],
  )

  const handleClick = useCallback(
    (type) =>
      async function () {
        return await controller[type]
          .call(null, ...arguments, pool)
          .then((res) => {
            if (res) return controller.fetch_state(pool)
            else throw new Error()
          })
          .then((data) => setLiteState({ data }))
          .catch(() => false)
      },
    [pool.addr],
  )

  useEffect(() => {
    const poolName = `${pool.bond.addr}-${pool.want.addr}`
    setLiteState({ pool: poolSelect[`${poolName}-${round[0]}`] })
  }, [round[0]])

  useEffect(() => {
    const poolName = `${pool.bond.addr}-${pool.want.addr}`
    const poolRound = !poolSelect[`${poolName}-1`]
    const newRound = [poolRound ? 0 : round[0], poolRound]
    ;(async () => {
      setLoading(true)
      const newData = await controller.fetch_state(pool)
      setLiteState((o) =>
        !signer && data === data_zero && o.data !== data_zero ? o : { ...o, data: newData, round: newRound },
      )
      setLoading(false)
    })()
  }, [signer, pool.addr])

  return useMemo(
    () => (
      <liteContext.Provider value={{ liteState, setLiteState, handleClick, classesChild }}>
        <div className={classes.root}>
          <div>
            <span
              style={{ position: 'absolute', top: '-60px', fontSize: '25px', color: 'white', fontFamily: 'Frutiger' }}
            >
              {textInfo.tip[tabsList[tabs]]}
            </span>
            <MyTabs value={tabs} onChange={(_, v) => setLiteState({ tabs: v, tabsChild: 0 })} labels={tabsList} />
            <div className={classes.content}>
              <div
                className={classes.tip}
                style={{
                  backgroundColor: '#EDF2FF',
                  color: '#4975FF',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  padding: '15px',
                  fontFamily: 'Helvetica',
                }}
              >
                {textInfo[tabsList[tabs]]}
              </div>
              <PoolSelector />
              <Suspense fallback={<div style={{ height: '222px' }} />}>
                <Content />
              </Suspense>
            </div>
          </div>
          <div></div>
          <div></div>
          <Loading open={loading} />
        </div>
      </liteContext.Provider>
    ),
    [liteState, loading],
  )
}
