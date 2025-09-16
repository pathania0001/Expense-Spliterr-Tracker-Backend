const { ExpenseRepository } = require("../repositories");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const { netBalanceWithExpenses, netBalanceWithSettlements } = require("./helperFunction");
const { getSettlementsInUsers } = require("./settlement.service");
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
                {groupId:null},
                {"splits.userId":userId}
            ]
        }
        const personalExpenses = await expenseRepo.getAll(customFilter);
        //  console.log("check daata",JSON.stringify(personalExpenses,null,2));
      
        // return [];
         let usersExpenseWith = personalExpenses.map( exp => {
             let otherUser = {};
             exp.splits.forEach( contact => {
                const {_id,name,email} = contact.userId;
                otherUser = {_id,name,email};
             })
             return otherUser;
         })
        //  console.log("actual ans :",usersExpenseWith);
         return usersExpenseWith;
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
        groupId:null
      };
      if(userId && partnerId){
        customFilterForExpenses["splits.userId"] = { $all : [userId,partnerId]}  
      };
      const expenses = await expenseRepo.getAll(customFilterForExpenses); 

      //console.log(" expenses with user",JSON.stringify(expenses,null,2))
      
      const settlements = await getSettlementsInUsers({userId,partnerId});
       let otherPartner = null;
       const { netUserExpenseAmount = 0 } =  netBalanceWithExpenses( expenses ,{userId,partnerId,otherPartner});
       const { netSettledAmount = 0 } =  netBalanceWithSettlements( settlements , {userId,partnerId,otherPartner});  
       console.log( " netSettledAmount ",netSettledAmount," netUserExpenseAmount",netUserExpenseAmount)
       const netBalanceOfUser = netSettledAmount + netUserExpenseAmount;
       if(!otherPartner){
       const { _id,name,email} = await getUserById(partnerId);
       otherPartner = {_id,name,email};
       }

    return { 
        netBalanceOfUser,
        expenses,
        settlements,
        otherUser:otherPartner
    }

   } catch (error) {
       console.log("error in expenses services",JSON.stringify(error,null,2))
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
   }
}

const expensesInGroup = ({ userId , groupId}) =>{
   try {
    
   } catch (error) {
     console.log("error ",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
   }
}

const deleteExpense = async(id)=>{
    try {
        const response = await expenseRepo.delete(id);
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

module.exports = {
   createExpense,
   getUserExpenses,
   deleteExpense,
   personalExpensesWithUsers,
   expenseWithPerson,
   expensesInGroup
}