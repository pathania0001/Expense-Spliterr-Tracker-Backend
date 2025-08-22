const { ExpenseRepository } = require("../repositories");
const { SuccessResponse } = require("../utils/comman");

const expenseRepo = new ExpenseRepository();
const createExpense = async(data)=>{
    try {
       const expense = await expenseRepo.create(data);
       return expense;
    } catch (error) {
        console.log("error :in serivce",error)
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

const getAllExpense = async(query)=>{
        try {
            const expenses = await expenseRepo.getAll();
            return expenses;
        } catch (error) {
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
   getAllExpense,
   deleteExpense,
}