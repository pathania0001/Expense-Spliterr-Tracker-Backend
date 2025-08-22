const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers');
const groupRoutes = express.Router();

groupRoutes.route('/create')
.post(
    Middleware.Group.validateNewGroupRequest,
    Controller.Group.createGroup
)

module.exports = groupRoutes;