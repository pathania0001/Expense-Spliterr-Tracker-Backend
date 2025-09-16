const { ErrorResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");

const validateNewGroupRequest = async(req,res,next)=>{

   if(req.body?.members.length<=1)
   {
    ErrorResponse.error = new ApiError(["At least two or more then two members should be there in total"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
   }

   next();
}

module.exports = { 
    validateNewGroupRequest,
}