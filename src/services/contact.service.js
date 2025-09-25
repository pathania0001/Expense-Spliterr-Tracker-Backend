const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const { personalExpensesWithUsers } = require("./expense.service");
const { getAllGroups } = require("./group.services");

const userContactedInGroup = async({userId})=>{
    try { 
        const groupsInvolvedWith = await getAllGroups(userId);
       // console.log("okk :",groupsInvolvedWith)
        return groupsInvolvedWith;

    } catch (error) {
        console.log("error in contact group service",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
    }
}
const userContactedWith = async({userId})=>{
    try { 
        const usersWithPersonalExpenses = await personalExpensesWithUsers(userId);
        return usersWithPersonalExpenses;
    } catch (error) {
        console.log("error in contact service",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
    }
}



module.exports = {
    userContactedWith,
    userContactedInGroup
}