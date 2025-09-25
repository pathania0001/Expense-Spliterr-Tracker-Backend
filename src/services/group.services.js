
const { GroupRepository } = require("../repositories")
const { StatusCodes } = require("../utils/constants")
const { ApiError } = require("../utils/error")
 const groupRepo = new GroupRepository();

const createGroup = async(data)=>{
  try {
     console.log("in create group services")
      const response = await groupRepo.create(data);
      return response;
  } catch (error) {
    // console.log("error in group service",error)
    if(!(error instanceof ApiError))
        throw ApiError({type:error.name,message:["Something went during creating new group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
  }
  throw error;
}

const getAllGroups = async(userId)=>{
  try {
    const customFilter = {}
    if(userId){
      customFilter["members"] = userId;
    }
    const response = await groupRepo.getAll(customFilter);
    //  console.log("all groups",JSON.stringify(response,2))
      return response;
  } catch (error) {
     if(!(error instanceof ApiError))
        throw ApiError({type:error.name,message:["Something went during fetching  groups",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
  }
  throw error;
  
}
const getGroupById = async(id)=>{
  try {
    const response = await groupRepo.get(id);
      return response;
  } catch (error) {
     if(!(error instanceof ApiError))
        throw ApiError({type:error.name,message:["Something went during fetching  group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
  }
  throw error;
  
}

module.exports ={
  createGroup,
  getAllGroups,
  getGroupById,
}