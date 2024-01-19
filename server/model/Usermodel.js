const bcrypt = require('bcrypt');

const mongoose = require('mongoose')
var schema = new mongoose.Schema({
  name:{
    type:String,
    required:true 
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  block:{
    type:Boolean
  },
  verified:{
    type:Boolean
  },
  status:{
    type:Boolean
  },
  block:{
    type:Boolean
  }
})
const Userdb=mongoose.model("userdb",schema)
module.exports=Userdb