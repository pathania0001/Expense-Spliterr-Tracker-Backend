const { ErrorResponse } = require("../utils/comman");
const { StatusCodes } = require("../utils/constants");
const { Expense_Required_Fields } = require("../utils/constants/expense.data.fields");
const { ValidationError } = require("../utils/error");

const validateExpenseData = async(req,res,next)=>{
   const errors = [];
    Expense_Required_Fields.forEach( field =>{
        if(!req.body[field] || req.body[field] ==="")
            errors.push(`${field} is required and not in oncoming request`);
    })
    if(errors.length){
       const error = new ValidationError(errors,StatusCodes.BAD_REQUEST)
       ErrorResponse.error = error;
       console.log("error :",error)
       return res.status(error.statusCode).json(ErrorResponse);
    }

    next();
}

module.exports = {
    validateExpenseData
}