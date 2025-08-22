const {Router} = require('express');
const userRoutes = require('./user.route');
const exprenseRoutes = require('./expense.route');

const v1Routes = Router();

v1Routes.use('/users',userRoutes);

v1Routes.use('/expense',exprenseRoutes);

module.exports = v1Routes;
