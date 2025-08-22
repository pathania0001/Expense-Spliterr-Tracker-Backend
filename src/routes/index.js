const {Router} = require('express');

const v1Routes = require('./v1');

const routes = Router();

routes.use("/v1",v1Routes);

module.exports = routes;