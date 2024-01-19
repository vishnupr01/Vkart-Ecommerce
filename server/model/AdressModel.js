const bcrypt = require('bcrypt');

const mongoose = require('mongoose')
var Adressschema = new mongoose.Schema({
  userID:{
    type:String,
    required:true 
  },
 name:{
    type:String,
    required:true
  },

 Adress:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
    

  },
  pincode:{
    type:String,
    required:true
  },
  locality:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  }
  

 
})
const Adress=mongoose.model("Adress",Adressschema)
module.exports=Adress