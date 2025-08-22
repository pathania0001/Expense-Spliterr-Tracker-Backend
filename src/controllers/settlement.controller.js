const { ErrorResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const Service = require('../services')

const createSettlement = async(req,res)=>{
    console.log("inside settlement controller-create");

    try {
         const response = await Service.Settlement.create({
            description:req.body.description,
            paidByUser:req.body.paidByUser,
            paidToUser:req.body.paidToUser,
            amount:req.body.amount,
            groupId:req.body.groupId,
            createdBy:req.user.id,
            createdAt:req.body.date,
            relatedToExpense:req.body.relatedToExpense
         })
    } catch (error) {
        if(!(error instanceof ApiError)){
            error  = new ApiError({type:error.name,message:["Something went wrong during creating new settlement",error.message]},StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse)
        }
    }
}


module.exports = {
    createSettlement,
}