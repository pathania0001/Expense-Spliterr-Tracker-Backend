const { SettlementRepository } = require("../repositories");
const { StatusCodes } = require("../utils/constants");
const { ApiError } = require("../utils/error");

  const settlementRepo = new SettlementRepository();
const create = async(data)=>{
    try {
        console.log("data in coming req :",data)
        const response = await settlementRepo.create(data);
        return response;
    } catch (error) {
        if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during create a new settlement",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}

const getAllSettlements = async( customFilter )=>{
    try {
        const response = await settlementRepo.getAll(customFilter);
        return response;
    } catch (error) {
        if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during fetching settlements",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}
const getSettlementsInUsers = async({userId,partnerId})=>{
    try {
        const customFilter = {
            groupId: { $eq: null }
        };
        if(userId && partnerId)
        {
            customFilter.$or = [
                {paidByUser:userId,paidToUser:partnerId},
                {paidByUser:partnerId,paidToUser:userId}
            ]
        }
        const response = await getAllSettlements(customFilter);
        return response;
    } catch (error) {
        if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during fetching settlements userSettlemnts",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}
const getUserSettlementsInGroup = async({userId,groupId})=>{
    try {
        const customFilter = {
            groupId
        };
        if(userId)
        {
            customFilter.$or = [
                {paidByUser:userId},
                {paidToUser:userId}
            ]
        }
        const response = await getAllSettlements(customFilter);
        return response;
    } catch (error) {
        if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during fetching settlements userSettlemnts",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}


const getSettlementDataWith = async ({userId,partnerId})=>{
    try {console.log("inside settlement data service")
        const { expenseWithPerson } = require("./expense.service");
        const response = await expenseWithPerson({userId,partnerId});
        //console.log("response of settlements",response)
        return {
            netBalance:response.netBalanceOfUser,
            counterpart:response.otherUser,
        }
    } catch (error) {
          if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during fetching settlements userSettlemnts",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}
const getUserSettlementDataInGroup = async ({userId,groupId})=>{
    try {console.log("inside group settlement data service")
        const { expensesInGroup } = require("./expense.service");
        const response = await expensesInGroup({userId,groupId});
        const balances = [];
        
        const owes = response.balances.owes;
        const owedBy = response.balances.owedBy;
        console.log("response of settlements",response)
        const userMap = Object.fromEntries( response?.group.members.map( mem =>([mem._id,mem])))  
        // console.log("response of settlements",userMap)

        if(owes.length){
           owes.map( owe =>{
            balances.push({
            name:userMap[owe.to].name,
            userId:owe.to,
            netBalance:owe.amount
           })
           })
    }
        if(owedBy.length){
           owedBy.map( oweBy =>{
            balances.push({
            name:userMap[oweBy.from].name,
            userId:oweBy.from,
            netBalance:oweBy.amount
           })
           })
    }
        console.log("response of settlements",balances)
        return {
            group:response.group,
            balances,
        }
    } catch (error) {
        console.log("error ,",error)
          if(!(error instanceof ApiError))
            throw new ApiError({type:error.name,message:["something went wrong during fetching settlements userSettlemnts",error.message]},StatusCodes.INTERNAL_SERVER_ERROR)
         throw error;
    }
}
module.exports = {
    create,
    getAllSettlements,
    getSettlementsInUsers,
    getUserSettlementsInGroup,
    getSettlementDataWith,
    getUserSettlementDataInGroup
}