const { ErrorResponse, SuccessResponse } = require("../utils/comman")
const { StatusCodes } = require("../utils/constants")
const { ApiError } = require("../utils/error")
const Service = require('../services');

const createGroup = async(req,res)=>{
    try {
        const response = await Service.Group.create({
            name:req.body.name,
            description:req.body.description,
            members:req.body.members,
            createdBy:req.body.user.id
        })

        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        if(!(error instanceof ApiError))
             error = new ApiError({type:error.name,message:["Something went wrong during creating new group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
        ErrorResponse.error = error;
        return res.status(error.StatusCodes).json(ErrorResponse);
    }

}

module.exports = {
    createGroup,
}