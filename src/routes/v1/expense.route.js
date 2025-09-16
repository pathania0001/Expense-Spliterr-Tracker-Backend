const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers')
const exprenseRoutes = express.Router();

exprenseRoutes.route('/create').post(
    Middleware.Auth.isUserAuthenticated,
    Middleware.Expense.validateExpenseData,
    Controller.Expense.createExpenses
)
exprenseRoutes.route('/user-expenses').get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Expense.getUserExpenses
)
exprenseRoutes.route('/person/:id').get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Expense.getUserExpenseWith
)
exprenseRoutes.route('/group/:id').get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Expense.getUserExpenseInGroup
)

module.exports = exprenseRoutes;