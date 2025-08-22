const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers')
const exprenseRoutes = express.Router();

exprenseRoutes.route('/create').post(
    Middleware.Expense.validateExpenseData,
    Controller.Expense.create
)

module.exports = exprenseRoutes;