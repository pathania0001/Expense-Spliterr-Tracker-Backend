const User = require('./user.services');
const Auth = require('./auth.service');
const Expense  = require('./expense.service');
const Group = require('./group.services');
const Settlement = require('./settlement.service');
const Contact  = require('./contact.service');
const Dashboard = require("./dashboard.service");
module.exports = {
    User,
    Auth,
    Expense,
    Group,
    Settlement,
    Contact,
    Dashboard
};