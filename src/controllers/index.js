const User = require('./user.controller.js')
const Auth = require('./auth.controller.js')
const Expense = require('./exprense.controller.js')
const Group = require('./group.controller.js');
const Settlement = require('./settlement.controller.js') 
const Contact = require("./contacts.controller.js")
module.exports =  {
     User,
     Auth,
     Expense,
     Group,
     Settlement,
     Contact
}