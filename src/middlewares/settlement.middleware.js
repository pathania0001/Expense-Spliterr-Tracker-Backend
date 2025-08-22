const { ErrorResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const { SETTLEMENTS_REQUIRED_FEILDS } = require("../utils/constants/settlement.datafields");
const { ApiError } = require("../utils/error");

const validateNewSettlementRequest = async(req,res)=>{

    const errors  = [];
    SETTLEMENTS_REQUIRED_FEILDS.map( field =>{
        if(!req.body[field])
            errors.push(`${field} field is required adn not in oncomming request`);
    })
    if(errors.length){
    ErrorResponse.error = new ApiError(["At least two or more then two members should be there in total"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }

   next();
}

module.exports = { 
    validateNewSettlementRequest,
}