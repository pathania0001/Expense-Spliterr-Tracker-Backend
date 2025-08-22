const mongoose = require("mongoose");
const {ENUMS} = require('../utils/comman')
const {EXACT,PERCENTAGE,EQUAL} = ENUMS.SPLIT_TYPE
const expenseSchema = new mongoose.Schema({
 
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    amount:{
        type:Number,
        required:true,
    },
    paidByUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        default:null
    },
    createdBy:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true, 
    },
    splitType:{
        type:String,
        enum:[EXACT,PERCENTAGE,EQUAL],
        default:EXACT
    },
    splits:[{
         userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true
                 },
         amount:{
                    type:Number,
                    required:true
                 },
                 paid:{
                    type:Boolean,
                    default:false
                 }}],
    createdAt:{
        type:Date,
        default:Date.now
    }
},)

const Expense = mongoose.model('Expense',expenseSchema);

module.exports = Expense;