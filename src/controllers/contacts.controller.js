const { ErrorResponse, SuccessResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const Service = require("../services")
const getUserContactedWith = async(req,res)=>{
    try {
        const users = await Service.Contact.userContactedWith({
            userId:req.user._id
        })
        const groups = await Service.Contact.userContactedInGroup({
            userId:req.user._id
        })

        SuccessResponse.data = {
            users,
            groups
        };
        return res.status(StatusCodes.SUCCESS).json(SuccessResponse);
    } catch (error) {
        console.log("error in contact controller ",error)
         if(!(error instanceof ApiError ))
            error = new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        ErrorResponse.error = error;

        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    getUserContactedWith,
}