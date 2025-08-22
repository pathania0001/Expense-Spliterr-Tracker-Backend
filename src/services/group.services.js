const { GroupRepository } = require("../repositories")
const { StatusCodes } = require("../utils/constants")
const { ApiError } = require("../utils/error")
 const groupRepo = new GroupRepository();

const create = async(data)=>{
  try {
      const response = await groupRepo.create(data);
      return response;
  } catch (error) {
    if(!(error instanceof ApiError))
        throw ApiError({type:error.name,message:["Something went during creating new group",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
  }
  throw error;
}
module.exports ={
  create,
}