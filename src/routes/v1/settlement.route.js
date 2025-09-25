
const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers'); 
const settlementRoutes = express.Router();

settlementRoutes.route('/create')
.post(
     Middleware.Auth.isUserAuthenticated,
     Middleware.Settlement.validateNewSettlementRequest ,
     Controller.Settlement.createSettlement
    );
settlementRoutes.route('/person/:id')
.get(
     Middleware.Auth.isUserAuthenticated,
     Controller.Settlement.getSettlementDataWithUser
    );
settlementRoutes.route('/group/:id')
.get(
     Middleware.Auth.isUserAuthenticated,
     Controller.Settlement.getSettlementDataInGroup
    );


module.exports = settlementRoutes;