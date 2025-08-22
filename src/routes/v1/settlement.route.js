
const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers'); 
const settlementRoutes = express.Router();

settlementRoutes.route('/create')
.post(
     Middleware.Settlement.validateNewSettlementRequest ,
     Controller.Settlement.createSettlement
    );

module.exports = settlementRoutes;