const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");
const { personalExpensesWithUsers } = require("./expense.service");
const { getAllGroups } = require("./group.services");

const userContactedWith = async({userId})=>{
    try { 
        console.log("userId :",userId)
        const usersWithPersonalExpenses = await personalExpensesWithUsers(userId);
        const groupsInvolvedWith = await getAllGroups(userId);

        return {
            users : usersWithPersonalExpenses,
            groups: groupsInvolvedWith    
        };
    } catch (error) {
        console.log("error in contact service",error)
         if(!(error instanceof ApiError ))
            throw new ApiError([{type:error.name,message:error.message}],StatusCodes.INTERNAL_SERVER_ERROR);

        throw error;
    }
}



module.exports = {
    userContactedWith,
}