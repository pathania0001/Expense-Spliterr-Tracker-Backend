const mongoose  = require("mongoose");

const { GROUP_SCHEMA_ERROR } = require("./db.error.messages");

const groupSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true,
        trim:true
     },
     description:{
      type:String,
     },
     members:{
      type:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      }],
      validate:{
         validator:function(arr){
            return arr.length>1;
         },
        message:GROUP_SCHEMA_ERROR.MEMBER_SIZE_NULL,
      }
   },
     createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
     },

})

const Group = mongoose.model('Group',groupSchema);

module.exports = Group;