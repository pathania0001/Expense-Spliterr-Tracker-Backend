const express = require('express');
const Middleware = require('../../middlewares');
const Controller = require('../../controllers');
const groupRoutes = express.Router();

groupRoutes.route('/create')
.post(
    Middleware.Auth.isUserAuthenticated,
    Middleware.Group.validateNewGroupRequest,
    Controller.Group.createGroup
)

groupRoutes.route('/')
.get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Group.getAllGroups
)
groupRoutes.route('/:id')
.get(
    Middleware.Auth.isUserAuthenticated,
    Controller.Group.getGroupById
)
module.exports = groupRoutes;