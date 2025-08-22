const { ErrorResponse, SuccessResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants")
const { ApiError } = require("../utils/error")
const Service = require('../services')
const create = async(req,res)=>{
     try {
        console.log("entring in expense controller")
        console.log("dta :",req.body)
         const response = await Service.Expense.createExpense({
            description:req.body.description,
            category:req.body.category,
            amount:req.body.amount,
            paidByUserId:"68a5c4244f4f4d6487e29b80",
            createdAt:req.body.date,
            groupId:req.body.groupId,
            splitType:req.body.splitType,
            splits:req.body.splits,
            createdBy:"68a5c4244f4f4d6487e29b80"
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
const getAll = async(req,res)=>{
     try {
         const response = await Service
     } catch (error) {
        if(!(error instanceof ApiError))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
     }
}

module.exports = {
    create,
}