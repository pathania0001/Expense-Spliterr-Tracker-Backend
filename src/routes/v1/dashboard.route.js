const express = require('express')
const Middleware = require('../../middlewares');
const dashboardRoutes = express.Router();
const Controller = require('../../controllers');
dashboardRoutes.route('/balances').get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Dashboard.getBalances
)
dashboardRoutes.route('/balance-in-groups').get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Dashboard.getBalancesInGroup
)

module.exports =  dashboardRoutes;