const { ExpenseRepository } = require("../repositories");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const { getGroupById } = require("./group.services");
const { netBalanceWithExpenses, netBalanceWithSettlements, legderOfUserInGroupExpenses, ledgerOfUserInGroupSettlements, filteringTheBalanceSheet } = require("./helperFunction");
const { getSettlementsInUsers, getUserSettlementsInGroup } = require("./settlement.service");
const { getUserById } = require("./user.services");

const expenseRepo = new ExpenseRepository();
const createExpense = async(data)=>{
    try {
       const expense = await expenseRepo.create(data);
       return expense;
    } catch (error) {
        // console.log("error :in expense serivce",error)
        throw new ApiError([

            {
                type:error.name,
                message:[
                    "Something went wrong during creating expense",
                    error.message]
                }],
                StatusCodes.INTERNAL_SERVER_ERROR)
            }
        } 

const getUserExpenses = async({userId})=>{
        try {
            const customFilter = {}
             if(userId){
                customFilter['splites.userId']= userId;
             }
            const userAllExpenses = await expenseRepo.getAll(customFilter);
            // console.log(" userAll expenses :",userAllExpenses)
          
            const personalExpenses = userAllExpenses.filter( expense => ( expense.groupId === null ));
            const groupExpenses = userAllExpenses.filter( expense => (expense.groupId));  
            return {users:personalExpenses,groups:groupExpenses};
        } catch (error) {
            //console.log("error in services in userExpenses",error)
            throw new ApiError([
                    {
                        type:error.name,
                        message:[
                            "Something went wrong during fetching expense",
                            error.message]
                        }],
                        StatusCodes.INTERNAL_SERVER_ERROR)
                    }
                }

const personalExpensesWithUsers = async(userId)=>{
    try { 
        const customFilter = {};
        if(userId){
            customFilter.$and = [
                { groupId: { $eq: null }},
                {"splits.userId":userId}
            ]
        }
        const personalExpenses = await expenseRepo.getAll(customFilter);
         // console.log("check daata",JSON.stringify(personalExpenses,null,2));
      
        // return [];
         let usersExpenseWith = personalExpenses.map( exp => {
             let otherUser = {};
             exp.splits.forEach( contact => {
                const {_id,name,email} = contact.userId;
                otherUser = {_id,name,email};
             })
             return otherUser;
         })
         const present = new Set();
         const uniqueUsers = [];
          usersExpenseWith.forEach( user =>{
             if(!present.has(user._id))
             {
                uniqueUsers.push(user);
                present.add(user._id)
             }
         })
        //  console.log("actual ans :",usersExpenseWith);
         return uniqueUsers;
    } catch (error) {
        console.log("error ",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
    }
}

const expenseWithPerson = async({ userId , partnerId})=>{
    console.log("inside expense user expenses")
   try {
      const customFilterForExpenses = {
        groupId: { $eq: null }
      };
      if(userId && partnerId){
        customFilterForExpenses["splits.userId"] = { $all : [userId,partnerId]}  
      };

      const expenses = await expenseRepo.getAll(customFilterForExpenses); 

      //console.log(" expenses with user",JSON.stringify(expenses,null,2))
      
      const settlements = await getSettlementsInUsers({userId,partnerId});
      //console.log("settlement :",settlements)
      let otherPartner = null;
      const { netUserExpenseAmount = 0 } =  netBalanceWithExpenses( expenses ,{userId,partnerId,otherPartner});
      //console.log("netUserExpenseAmount :",netUserExpenseAmount)
      const { netSettledAmount = 0 } =  netBalanceWithSettlements( settlements , {userId,partnerId,otherPartner});  
      //console.log("netSettledAmount :",netSettledAmount)
      // console.log( " netSettledAmount ",netSettledAmount," netUserExpenseAmount",netUserExpenseAmount)
       const netBalanceOfUser = netSettledAmount + netUserExpenseAmount;
       if(!otherPartner){
       const { _id,name,email} = await getUserById(partnerId);
       otherPartner = {_id,name,email};
       }
//   console.log("checking",otherPartner._id,userId,partnerId)
    return { 
        netBalanceOfUser,
        expenses,
        settlements,
        otherUser:otherPartner
    }

   } catch (error) {
       console.log("error in expenses services",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
   }
}

const expensesInGroup = async({ userId , groupId}) =>{
    console.log("userId :",userId,groupId)
   try {
        const customFilterForExpenses = {groupId}

      const group = await getGroupById(groupId);

      
      const expenses = await expenseRepo.getAll(customFilterForExpenses); 
       const balances = {
                id:userId,
                name:"",
                imageUrl:"",
                totalBalance:0,
                owedBy:[],
                owes:[]
            };
            const membersKeyValue = Object.fromEntries(group.members.map(member =>{
                const {name,email,_id} = member;
               return [_id,{name,email,_id}]}));  
            //console.log(" expenses with user",JSON.stringify(expenses,null,2))
            const settlements = await getUserSettlementsInGroup({userId,groupId});
            console.log(" settlemnts in group",JSON.stringify(settlements,null,2))

            const { netBalanceInExpenses } = legderOfUserInGroupExpenses( expenses,balances,membersKeyValue,{userId});
      
      const { netCashFlowInUserSettlements } = ledgerOfUserInGroupSettlements(settlements, membersKeyValue, {userId})
      const netBalance = netBalanceInExpenses + netCashFlowInUserSettlements;
    //   console.log("netCashFlowInUserSettlements",netCashFlowInUserSettlements,"netBalanceInExpenses",netBalanceInExpenses,"netBalance",netBalance)
      balances.totalBalance = netBalance;
     filteringTheBalanceSheet(balances,membersKeyValue)
    //   let balances = balanceKeys.map( key =>{
    //     return ledger[key];
    //   });
    
    //   balanceKeys.length && balanceKeys?.forEach( userId =>{
    //     const balanceWithUser = {}
    //     balanceWithUser["userId"] = userId;
    //     balanceWithUser["netBalance"] = ledger[userId];

    //   })
    return { 
        balances,
        expenses,
        settlements,
        group,
    }
   } catch (error) {
     console.log("error ",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
   }
}

const deleteExpense = async({expenseId})=>{
    try {
        const response = await expenseRepo.delete(expenseId);
        return response;
    } catch (error) {
      if(error instanceof ApiError){
            throw new ApiError("Expense Not Found",StatusCodes.NOT_FOUND)
         }
         throw new ApiError([
                    {
                        type:error.name,message:[
                            "Something went wrong during deleting expense", error.message]}],
                            StatusCodes.INTERNAL_SERVER_ERROR)
     }
    
}

const getperiodicExpenses = async({userId})=>{
  try {
     const customFilter = {};
     const currYear = new Date().getFullYear();
     const refTime = new Date( currYear , 0 ,1);
     customFilter["createdAt"] = {$gte:refTime};
     if(userId){
        customFilter["splits.userId"] = userId;
     }
     const expenses = await expenseRepo.getAll(customFilter);
     let monthlyExpense = [];
     let totalExpenses = 0;
     const mappingMonthlyExpenses = {};
     for(let monthIdx = 0;monthIdx<12;monthIdx++){
        const year = new Date(Date.now()).getFullYear();
        const monthStamp = new Date(year,monthIdx).getTime();
        mappingMonthlyExpenses[monthStamp] = 0;
     }
        expenses.forEach(expense => {
           expense.splits.forEach(splitUser => {
                if(splitUser.userId._id.toString() === userId.toString()){
                    const timeStampofCreatedAt = new Date(expense.createdAt);
                    const year = timeStampofCreatedAt.getFullYear();
                    const month = timeStampofCreatedAt.getMonth();
                    const refTimeStamp = new Date(currYear,month).getTime();
                    const amount = Number(splitUser.amount);
                     mappingMonthlyExpenses[refTimeStamp] = (mappingMonthlyExpenses[refTimeStamp] || 0 ) + amount;
                    totalExpenses += amount;
                }
            });
        });
        // console.log("monthlyExpense:", mappingMonthlyExpenses);

        const expensesMonths = Object.keys(mappingMonthlyExpenses);
        
        if(expensesMonths.length){
          monthlyExpense =  expensesMonths.map( month =>({month,total:mappingMonthlyExpenses[month]}))
        }

    // console.log("monthlyExpense:", monthlyExpense);
    return {
        totalExpenses,
        monthlyExpense
    };

  } catch (error) {
     console.log("error in expenses over period services",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
  }
}

module.exports = {
   createExpense,
   getUserExpenses,
   deleteExpense,
   personalExpensesWithUsers,
   expenseWithPerson,
   expensesInGroup,
   getperiodicExpenses
}