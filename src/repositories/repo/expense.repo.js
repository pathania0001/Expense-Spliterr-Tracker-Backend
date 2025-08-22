const { Expense } = require("../../models");
const CrudRepositories = require("../crud.repo");

class ExpenseRepository extends CrudRepositories{
    constructor(){
       super(Expense);
    }
}

module.exports = ExpenseRepository;