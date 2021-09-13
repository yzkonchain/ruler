import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext } from '@/config'
import { MyButton, Amount } from '@/components/Modules'

const ZERO = ethers.constants.Zero
const INIT = {
  bond: ZERO,
  want: ZERO,
  I: { bond: '', want: '' },
  old: { bond: '', want: '' },
}
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

export default function Borrow() {
  const {
    state: { controller },
  } = useContext(context)
  const {
    liteState: { pool, bond, want, coll, data },
    classesChild: classes,
    handleClick,
  } = useContext(liteContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    const bond = parse(state.I.bond)
    const want = parse(state.I.want)
    if (!bond.eq(state.bond)) {
      pool.ct
        .get_dy(bond)
        .then((want) => setState({ bond, want, I: { ...state.I, want: format(want) } }))
        .catch(() => {
          if (state.I.bond.length > state.old.bond.length && state.I.bond.length < format(state.bond).length) {
            controller.notify('balance', 'insufficient')
          }
        })
    } else if (!want.eq(state.want)) {
      setState({ bond: want, want, I: { ...state.I, bond: format(want) } })
    }
  }, [state.I])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <Amount
              title="bond"
              State={{
                state,
                setState,
                token: bond,
                max: data.balance.bond,
                if_max: data.allowance.bond.gt('100000000000000000000000000000000'),
              }}
              style={{ height: '90px' }}
            />
          </div>
          <span className={classes.icon}>swap_horiz</span>
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

        <div className={classes.buttonOne}>
          <div>
            <MyButton
              name="Borrow"
              onClick={() =>
                handleClick('borrow')(state.bond, state.want).then(() => setState({ I: { bond: '', want: '' } }))
              }
              disabled={
                ZERO.eq(state.want) || parse(state.I.bond).gt(data.balance.bond) || !parse(state.I.bond).eq(state.bond)
              }
            />
            <MyButton
              name="Repay"
              onClick={() => handleClick('repay')(state.want).then(() => setState({ I: { bond: '', want: '' } }))}
              disabled={
                ZERO.eq(state.bond) || parse(state.I.want).gt(data.balance.want) || !parse(state.I.want).eq(state.want)
              }
            />
            {/* <MyButton name="Mint" onClick={() => handleClick('mint')(state.bond)} /> */}
            {/* <MyButton name="Deposit" onClick={() => handleClick('deposit')(state.want, data.balance.coll)} /> */}
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}
