const { SuccessResponse, ErrorResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const Service  = require("../services"); 
const { ApiError } = require("../utils/error");
const getBalances = async(req,res)=>{
 try {
        const response = await Service.Dashboard.getBalances({
            userId:req.user._id
        })
        SuccessResponse.data = response;
        return res.status(StatusCodes.SUCCESS).json(SuccessResponse);
    } catch (error) {
        console.log("error in dashboard controller ",JSON.stringify(error,null,2))
         if(!(error instanceof ApiError ))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
    }
}
const getBalancesInGroup = async(req,res)=>{
 try { 
    // console.log("curr-User",req.user)
        const response = await Service.Dashboard.getBalancesInGroup({
            userId:req.user._id
        })
        SuccessResponse.data = response;
        return res.status(StatusCodes.SUCCESS).json(SuccessResponse);
    } catch (error) {
        console.log("error :",error)
        console.log("error in dashboard group data controller ",JSON.stringify(error,null,2))
         if(!(error instanceof ApiError ))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    getBalances,
    getBalancesInGroup
}