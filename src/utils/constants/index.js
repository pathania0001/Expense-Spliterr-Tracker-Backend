

const User_Constant_Fields = require('./user.datafields');
const StatusCodes = require('./statuscodes');
const { Expense_Required_Fields } = require('./expense.datafields');
const { SETTLEMENTS_REQUIRED_FEILDS } = require('./settlement.datafields');
module.exports = {
    ...User_Constant_Fields,
    ...Expense_Required_Fields,
    ...SETTLEMENTS_REQUIRED_FEILDS,
    StatusCodes
}