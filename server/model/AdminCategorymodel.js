const bcrypt = require('bcrypt');

const mongoose = require('mongoose')
var Categoryschema = new mongoose.Schema({
  name:{
    type:String,
    required:true 
  },
  verified:{
    type:Boolean
  },
 
})
const Categories=mongoose.model("Categories",Categoryschema)
module.exports=Categories