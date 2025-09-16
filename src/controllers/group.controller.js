const { ErrorResponse, SuccessResponse } = require("../utils/comman")
const { StatusCodes } = require("../utils/constants")
const { ApiError } = require("../utils/error")
const Service = require('../services');

const createGroup = async(req,res)=>{
    try { 
        console.log("in create group controller")
        const response = await Service.Group.createGroup({
            name:req.body.name,
            description:req.body.description,
            members:req.body.members,
            createdBy:req.user.id
        })

        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log("error in creating group",error)
        if(!(error instanceof ApiError))
             error = new ApiError({type:error.name,message:["Something went wrong during creating new group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
        ErrorResponse.error = error;
        return res.status(error.StatusCodes).json(ErrorResponse);
    }

}
const getAllGroups = async(req,res)=>{
    try { 
        console.log("in getting All groups controller")
        const response = await Service.Group.getAllGroups()

        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log("error in getting All groups",error)
        if(!(error instanceof ApiError))
             error = new ApiError({type:error.name,message:["Something went wrong during fetching all group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
        ErrorResponse.error = error;
        return res.status(error.StatusCodes).json(ErrorResponse);
    }
}
const getGroupById = async(req,res)=>{
    try { 
        console.log("in fetching group controller")
        const {id} = req.params
        if(!id){
            throw new ApiError(["GroupId should be valid or present"],StatusCodes.BAD_REQUEST)
        }
        const response = await Service.Group.getGroupById(id)

        SuccessResponse.data = response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        console.log("error in getting All groups",error)
        if(!(error instanceof ApiError))
             error = new ApiError({type:error.name,message:["Something went wrong during fetching all group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
        ErrorResponse.error = error;
        return res.status(error.StatusCodes).json(ErrorResponse);
    }

}

module.exports = {
    createGroup,
    getAllGroups,
    getGroupById
}