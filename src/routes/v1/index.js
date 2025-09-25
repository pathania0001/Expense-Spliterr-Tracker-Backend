const {Router} = require('express');
const userRoutes = require('./user.route');
const exprenseRoutes = require('./expense.route');
const groupRoutes = require('./group.route');
const settlementRoutes = require('./settlement.route');
const contactRoutes = require('./contacts.routes');
const dashboardRoutes = require('./dashboard.route');

const v1Routes = Router();

v1Routes.use('/users',userRoutes);

v1Routes.use('/dashboard',dashboardRoutes);

v1Routes.use('/expense',exprenseRoutes);

v1Routes.use('/group',groupRoutes)

v1Routes.use('/settlement',settlementRoutes);

v1Routes.use('/contacts',contactRoutes);

module.exports = v1Routes;
