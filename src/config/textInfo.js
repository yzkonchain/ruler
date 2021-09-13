const textInfo = {
  bond: 'BOND token is the collateral asset deposited by borrower.',
  want: 'WANT token is the debt asset provided by lender.',
  coll: 'COLL token is the lending certificate.',
  Borrow: `Deposit your COVER token as collateral to borrow COLLAR with fixed-rate interest.
        Loan-to-value ratio is 100%. The term of this loan is 2 years.
        Before its expiry, borrower can withdraw their COVER as long as they repay with either COLLAR or COLL.
        0.01% fee is charged for each borrow order and no fee is charged for repay order.`,
  Swap: `Lend your COLLAR to borrowers and get the lending certificate, COLL token.
        The term of this loan is 2 years. Before its expiry,
        lenders can withdraw their COLLAR with COLL. 
        0.01% fee is changed for each borrow order and no fee is charged for repay order.`,
  tip: {
    Borrow: `Use COVER to borrow COLLAR: Fixed rate, free repay, and 100% LTV`,
    Swap: `Lend COLLAR with fixed return`,
  },
}

export default textInfo
