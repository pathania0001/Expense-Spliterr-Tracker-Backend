const mongoose = require("mongoose");


const settlementSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    paidByUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    paidToUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    amonut:{
        type:Number,
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
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true,
    },
    relatedToExpense:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Expense"
    }
})

const Settlement = mongoose.model('Settlement',settlementSchema);
module.exports = Settlement;