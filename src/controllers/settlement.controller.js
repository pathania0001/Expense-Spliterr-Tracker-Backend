const { ErrorResponse, SuccessResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const Service = require('../services')

const createSettlement = async(req,res)=>{
    console.log("inside settlement controller-create");

    try {
         const response = await Service.Settlement.create({
            description:req.body.note,
            paidByUser:req.body.paidByUserId,
            paidToUser:req.body.receivedByUserId,
            amount:req.body.amount,
            groupId:req.body.groupId,
            createdBy:req.user._id
         })

         SuccessResponse.data = response;
         return res.status(StatusCodes.CREATED).json(SuccessResponse)
    } catch (error) {
        if(!(error instanceof ApiError)){
            error  = new ApiError({type:error.name,message:["Something went wrong during creating new settlement",error.message]},StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse)
        }
    }
}
const getSettlementDataWithUser = async(req,res)=>{
    console.log("inside settlement controller-getSettlementData");

    try {
         const response = await Service.Settlement.getSettlementDataWith({
            partnerId:req.params.id,
            userId:req.user._id
         })
           SuccessResponse.data = response;
         return res.status(StatusCodes.SUCCESS).json(SuccessResponse)
    } catch (error) {
        if(!(error instanceof ApiError)){
            error  = new ApiError({type:error.name,message:["Something went wrong during fetching settlement data with user",error.message]},StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse)
        }
    }
}



module.exports = {
    createSettlement,
    getSettlementDataWithUser
}