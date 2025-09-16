const { Expense } = require("../../models");
const CrudRepositories = require("../crud.repo");

class ExpenseRepository extends CrudRepositories{
    constructor(){
       super(Expense);
    }
    async getAll(query){
        console.log("query ",query)
       return await Expense.find(query)
      .populate("paidByUserId", "name email")  
      .populate("createdBy", "name email")     
      .populate("groupId")         
      .populate("splits.userId", "name email");
    }
}

module.exports = ExpenseRepository;