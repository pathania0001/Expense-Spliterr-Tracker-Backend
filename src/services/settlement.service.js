const { SettlementRepository } = require("../repositories");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error")
  const settlementRepo = new SettlementRepository();
const create = async(data)=>{
    try {
        const response = await settlementRepo.create(data);
        return response;
    } catch (error) {
        if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during create a new settlement",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}
module.exports = {
    create,
}