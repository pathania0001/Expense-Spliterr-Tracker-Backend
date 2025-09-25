
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
const netBalanceWithSettlements = (settlements, {userId , partnerId })=>{
   // console.log("settlements in helper function:",JSON.stringify(settlements,null,2))
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
    
     //console.log("net Amount:",netSettlementByUser , "paidByPartner :",paidByPartner,"paid by user :",paidByUser )
    return {
        userId:paidByUser,
        partnerId:paidByPartner,
        netSettledAmount:netSettlementByUser,
    }
}
const legderOfUserInGroupExpenses = (expenses,balances,membersKeyValue, {userId})=>{
   const mainUser = userId.toString()
   balances.name = membersKeyValue[mainUser].name;
   balances.email = membersKeyValue[mainUser].email;
   let totalPaidByUser = 0;
   let totalAmountNeedsTopayByUser = 0;
   
   const members_ids = Object.keys(membersKeyValue);
   
   expenses.length && expenses.map( expense => {
       const expenseAmount = Number(expense.amount);
       const currWhoPay = expense.paidByUserId._id.toString();
       const splitingKeyValue = Object.fromEntries(expense.splits.map( split =>{
        
        return [split.userId._id,{amount:split.amount}]
       }))
    //    console.log(splitingKeyValue)
       if(currWhoPay !== mainUser){ 
           const amount = Number(splitingKeyValue[mainUser].amount)
           membersKeyValue[currWhoPay]["netBalance"] = (membersKeyValue[currWhoPay]["netBalance"] || 0) - amount;
           totalAmountNeedsTopayByUser += amount;
        //    console.log("here :",amount);
        }
        else{
            members_ids.map( idx =>{
                const amount = Number(splitingKeyValue[idx].amount)
                if(idx.toString() !== mainUser){
                    membersKeyValue[idx]["netBalance"] = (membersKeyValue[idx]["netBalance"] || 0) + amount;
                }
                else{
                    totalAmountNeedsTopayByUser += amount;
                    totalPaidByUser += expenseAmount;
                }
            })
            
        }
        

  })

//   expenses.length && expenses.map( exp => {
//     const amount = Number(exp.amount);
//     const keyValueOfSplits = exp.splits.map( split =>{split._id:})
//     for( let idx = 0;idx<exp.splits.length;idx++){
//         const currId = exp.splits[idx].userId._id.toString();
//         const amountNeedsToPay = exp.splits[idx].amount;
//       if(currId === userId.toString()){
//            if(exp.paidByUserId._id.toString() === userId.toString()){
//             totalPaidByUser+=amount;
//              if (!ledger[currId]) {
//                 const {name,email,_id} = exp.paidByUserId
//             ledger[currId] = { name,email,userId:_id, netBalance: 0 };
//           }
//            }
//         else{
//               if (!ledger[currId]) {
//                 const {name,email,_id} = exp.paidByUserId
//             ledger[currId] = { name,email,userId:_id, netBalance: 0 };
//           }
//           ledger[currId].netBalance -= amountNeedsToPay;

//         }
//         totalAmountNeedsTopayByUser += amountNeedsToPay;
//         break;
//         }
//     }

//   })

  const netBalanceInExpenses = totalPaidByUser - totalAmountNeedsTopayByUser;
   //console.log("balance in expense",membersKeyValue)
  //console.log("netBalanceInExpenses ok",netBalanceInExpenses,"totalPaidByUser",totalPaidByUser,"totalAmountNeedsTopayByUser",totalAmountNeedsTopayByUser)
  return {
    netBalanceInExpenses
  }
}

const ledgerOfUserInGroupSettlements = ( settlements,membersKeyValue,{userId}) =>{
    let totalPaidByUser = 0;
    let totalPaidToUser = 0;
    const mainUser = userId.toString();
   settlements.length && settlements.map( settlement => {
        const amount = Number(settlement.amount);
        const paidByUserId = settlement.paidByUser._id.toString();
        const paidToUserId = settlement.paidToUser._id.toString();
          // console.log(paidByUserId,mainUser,paidByUserId === mainUser)
        if(paidByUserId === mainUser)
            {
            membersKeyValue[paidToUserId].netBalance+=amount;
            totalPaidByUser+=amount;
        }
        else{
            membersKeyValue[paidByUserId].netBalance-=amount;
            totalPaidToUser+=amount;
        }
    });
    //console.log("balance in settlement",membersKeyValue)
    const netCashFlowInUserSettlements = totalPaidByUser-totalPaidToUser;
    //console.log("netCashFlowInUserSettlements",netCashFlowInUserSettlements,"totalPaidByUser",totalPaidByUser,"totalPaidByUser",totalPaidByUser)
    return{
        netCashFlowInUserSettlements
    }
}

const filteringTheBalanceSheet = (balances,membersKeyValue)=>{
    const members = Object.keys(membersKeyValue);
    const owes = [];
    const owedBy=[];
    // console.log("mememme :",membersKeyValue)
    members.forEach( memId =>{
        if(membersKeyValue[memId].netBalance<0){
            owes.push({to:memId,amount:membersKeyValue[memId].netBalance});
        }
        else if(membersKeyValue[memId].netBalance>0){
            owedBy.push({from:memId,amount:membersKeyValue[memId].netBalance});
        }
    })
    // console.log("owes :",owes)
    // console.log("owedBy :",owedBy)
    balances.owedBy = owedBy;
    balances.owes = owes;
}

module.exports = {

    netBalanceWithExpenses,
    netBalanceWithSettlements,
    legderOfUserInGroupExpenses,
    ledgerOfUserInGroupSettlements,
    filteringTheBalanceSheet
}