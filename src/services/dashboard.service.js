const { userContactedWith,userContactedInGroup } = require("./contact.service");
const {  expenseWithPerson, expensesInGroup } = require("./expense.service");

const getBalancesInGroup = async({userId})=>{
    try {
        const groups = await userContactedInGroup({userId});
        
        const allGroupsData = await Promise.all( groups.map( inGroup => ( expensesInGroup({userId , groupId:inGroup._id}))));
     //return allGroupsData

       const balanceInGroup = []; 
       allGroupsData.map( groupData => {
         const { _id,name,members} = groupData.group;
          balanceInGroup.push({balance:groupData.balances.totalBalance,id:_id,name,members});
         })
     
     return balanceInGroup;
    } catch (error) {
        throw error
    }
}
const getBalances = async({userId})=>{
    try {
        const users = await userContactedWith({userId});
        
       const allUsersData = await Promise.all(users.map( withUser => ( expenseWithPerson({ userId , partnerId:withUser._id}))))

       let payByOthers = 0.00,payToOthers=0.00;

       const youAreOwedBy = [];
       const youOwe = [];
       
       allUsersData.map( balance => {
          if(balance.netBalanceOfUser > 0){
            const amount = Number(balance.netBalanceOfUser)
            youAreOwedBy.push({
                ...balance.otherUser,
                amount
            })
            payByOthers += amount;
          }
         else if(balance.netBalanceOfUser < 0){
            const amount = Number(balance.netBalanceOfUser)
            youOwe.push({
                ...balance.otherUser,
                amount
            })
            payToOthers += amount;
          }
       })
     
      const oweDetails = {
        youAreOwedBy,
        youOwe
      }
  // return groups
       return {
        totalBalance:payByOthers + payToOthers,
        youAreOwed:payByOthers,
        youOwe:payToOthers,
        oweDetails
       }; 
    } catch (error) {
        throw error
    }
}
module.exports = {
  getBalances,
 getBalancesInGroup
}