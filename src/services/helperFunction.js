const netBalanceWithExpenses = (expenses , {userId , partnerId , otherPartner })=>{
   
    const forUser = {
        paid:0,
        unpaid:0
    }
    const forPartner = {
        paid:0,
        unpaid:0
    }

  expenses.length && expenses.forEach( exp => {
    
        exp.splits.forEach( split =>{
            const amount = Number(split.amount);
            if(split.userId._id.toString() === userId.toString()){
                if(split.paid)
                    forUser.paid += amount;
                else
                    forUser.unpaid +=amount;
            } 
            else{
                if(split.paid)
                forPartner.paid += amount;

                else
                forPartner.unpaid += amount;

                if(!otherPartner)
                    otherPartner = split.userId;
            }
        })
    })
    const totalPaidByUser = forUser.paid + forPartner.unpaid;
    const totalPaidByPartner = forPartner.paid +forUser.unpaid;

    const totalExpanditureOnExpenses = totalPaidByUser + totalPaidByPartner;

    const amountNeedsToPayByUser = forUser.paid + forUser.unpaid;
    const amountNeedsToPayByPartner = forPartner.paid + forPartner.unpaid;
    const netUserExpenseAmount = totalPaidByUser - amountNeedsToPayByUser;
    
   
//   console.log("For User:", forUser);
//   console.log("For Partner:", forPartner);
//   console.log("totalPaidByUser:", totalPaidByUser);
//   console.log("totalPaidByPartner:", totalPaidByPartner);
//   console.log("totalExpenditure:", totalExpanditureOnExpenses);
//   console.log("amountNeedsToPayByUser:", amountNeedsToPayByUser);
//   console.log("amountNeedsToPayByPartner:", amountNeedsToPayByPartner);
//   console.log("netUserExpenseAmount:", netUserExpenseAmount);
 




    return {
        userId:forUser,
        partnerId:forPartner,
        totalPaidByUser,
        totalPaidByPartner,
        totalExpanditureOnExpenses,
        netUserExpenseAmount,
    }
}
const netBalanceWithSettlements = (settlements , {userId , partnerId })=>{
    console.log("settlements :",JSON.stringify(settlements,null,2))
    let paidByUser = 0;
    let paidByPartner = 0;
    settlements.length && settlements.forEach( settlement => {
        const amount = Number(settlement.amount);
      // console.log("checking :",settlement.paidByUser.toString() === userId.toString(),settlement.paidByUser === userId)
        if(settlement.paidByUser._id.toString() === userId.toString())
            paidByUser += amount;
        else
            paidByPartner += amount;
        
    })
    
    const netSettlementByUser = paidByUser - paidByPartner;
    
     console.log("net Amount:",netSettlementByUser , "paidByPartner :",paidByPartner,"paid by user :",paidByUser )
    return {
        userId:paidByUser,
        partnerId:paidByPartner,
        netSettledAmount:netSettlementByUser,
    }
}

module.exports = {

    netBalanceWithExpenses,
    netBalanceWithSettlements

}