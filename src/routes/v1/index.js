const {Router} = require('express');
const userRoutes = require('./user.route');
const exprenseRoutes = require('./expense.route');
const groupRoutes = require('./group.route');
const settlementRoutes = require('./settlement.route');

const v1Routes = Router();

v1Routes.use('/users',userRoutes);

v1Routes.use('/expense',exprenseRoutes);

v1Routes.use('/group',groupRoutes)

v1Routes.use('/settlement',settlementRoutes);

module.exports = v1Routes;
