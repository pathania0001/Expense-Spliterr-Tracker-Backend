const { ErrorResponse, SuccessResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants")
const { ApiError } = require("../utils/error")
const Service = require('../services')
const createExpenses = async(req,res)=>{
     try {
        console.log("entring in expense controller")
        // console.log("dta :",req.body)
         const response = await Service.Expense.createExpense({
            description:req.body.description,
            category:req.body.category,
            amount:req.body.amount,
            paidByUserId:req.body.paidByUserId,
            createdAt:req.body.date,
            groupId:req.body.groupId,
            splitType:req.body.splitType,
            splits:req.body.splits,
            createdBy:req.user._id
         })

         SuccessResponse.data = response;
         console.log("response :",response)
         return res.status(StatusCodes.CREATED).json(SuccessResponse);
     } catch (error) {
        console.log("error :",error)
        if(!(error instanceof ApiError))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;
 
        return res.status(error.statusCode).json(ErrorResponse);
     }
}

// const getAllExpenses = async(req,res)=>{
//      try {
//          const response = await Service.Expense.getAllExpense();
//          SuccessResponse.data = response;
//          console.log("response :",response)
//          return res.status(StatusCodes.CREATED).json(SuccessResponse);
//      } catch (error) {
//         if(!(error instanceof ApiError))
//             error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

//         ErrorResponse.error = error;

//         return res.status(error.statusCode).json(ErrorResponse);
//      }
// }

const getUserExpenses = async(req,res)=>{
    try {
        console.log( "inside user-expenses controller" )
        const response = await Service.Expense.getUserExpenses({
        userId:req.user._id
       });
         SuccessResponse.data = response;
         console.log("response :",response)
         return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log("error ",error)
         if(!(error instanceof ApiError ))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
     }
    }


const getUserExpenseWith = async( req,res )=>{
  try {
    console.log("inside  user-partner expenses")
       const response = await Service.Expense.expenseWithPerson({
          userId:req.user._id,
          partnerId:req.params.id
       });
       SuccessResponse.data = response;
         console.log("response :",response)
         return res.status(StatusCodes.CREATED).json(SuccessResponse); 
  } catch (error) {
    console.log("error ",error)
         if(!(error instanceof ApiError ))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
  }
}
const getUserExpenseInGroup = async( req,res )=>{
  try {
       const response = await Service.Expense.expensesInGroup({
          userId:req.user._id,
          groupId:req.params.id
       });
       SuccessResponse.data = response;
         console.log("response :",response)
         return res.status(StatusCodes.CREATED).json(SuccessResponse); 
  } catch (error) {
    console.log("error ",error)
         if(!(error instanceof ApiError ))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
    createExpenses,
    getUserExpenses,
    getUserExpenseWith,
    getUserExpenseInGroup
}