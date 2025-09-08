const jwt = require('jsonwebtoken');
const { ErrorResponse, ENUMS } = require("../utils/comman");
const { ValidationError, ApiError } = require("../utils/error");
const { TOKEN_SECURITY_KEY } = require("../config");
const Service = require("../services");
const { User_Required_Fields, StatusCodes } = require('../utils/constants');

const validateUserInput = (req,res,next)=>{
  const data = req.body;
   const errors = [];
    User_Required_Fields.forEach( field =>{
               if (data[field] === undefined || data[field] === null || data[field] === '') {
                errors.push(`${field} field is required and not present in oncoming request`);
              }
          }) 

  if (errors.length > 0) {
    const error =  new ValidationError(errors);
    ErrorResponse.error = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
  }
  next();
}
const validateLoginUserInput = (req,res,next)=>{
   const  {email,password} = req.body;
   const errors = [];

  if (!email) errors.push("email is required");

  if (!password) errors.push("password is required");

  if (errors.length > 0) {
    const error =  new ValidationError(errors);
    ErrorResponse.error = error;
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
  }
  next();
}
const isUserAuthenticated = async(req,res,next)=>{
  try {
    console.log("inside the authmiddleware")

    console.log("signed Cookie :",req.signedCookies)

   const {refreshToken,accessToken} = req.signedCookies;

     if(!accessToken)
   {
    throw new ApiError(["Access-Token not found"],StatusCodes.UNAUTHORIZED)
   }
   
   if(!refreshToken){
      throw new ApiError(["Refresh Token not Found"],StatusCodes.UNAUTHORIZED)
   }

let decoded;
    try {
      decoded = jwt.verify(accessToken,TOKEN_SECURITY_KEY);
    } catch (error) {
      console.log(error)
      if (error.name === "TokenExpiredError") {
        throw new ApiError(["Access token is expired"], StatusCodes.UNAUTHORIZED);
      }
      throw new ApiError(["Invalid token"], StatusCodes.UNAUTHORIZED);
    }

    if (!decoded?.id) {
      throw new ApiError(["Invalid token payload"], StatusCodes.UNAUTHORIZED);
    }
    //console.log(decoded)

    const user = await Service.User.getUserById(decoded.id);
    // console.log(user)
    if (!user) {
      throw new ApiError(["User not found"], StatusCodes.NOT_FOUND);
    }
    
   const isValidRefreshToken = user.refreshToken.includes(refreshToken);
   console.log("inside Auth middleware")
   if(!isValidRefreshToken){
    res.clearCookie("refreshToken",{
    signed:true,
    httpOnly:true,
    secure:true
  })
    throw new ApiError(["Invalide Refresh Token"],StatusCodes.UNAUTHORIZED)
   }
  
   req.headers['x-user.id'] = user.id;
   req.user = user;
   
  } catch (error) {
    if(error.name === "TokenExpiredError"){
         error = new ApiError(["Access  Token is expired"],StatusCodes.UNAUTHORIZED) 
      }
    if(!(error instanceof ApiError))
      error = new ApiError({type:error.name,message:error.message},StatusCodes.INTERNAL_SERVER_ERROR);
   
    ErrorResponse.error = error;
    return res
             .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
             .json(error);
  }

   //console.log("accessToken :",accessToken);
  console.log("leaving Auth middleware")
   next();
} 


module.exports = {
    validateUserInput,
    validateLoginUserInput,
    isUserAuthenticated,
}