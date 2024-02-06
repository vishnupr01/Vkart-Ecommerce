const bcrypt = require('bcrypt');

const mongoose = require('mongoose')
var Couponchema = new mongoose.Schema({
  Code:{
    type:String,
    required:true 
  },
 
  Discount:{
    type:Number,
    required:true
  },
  Maxuse: {
    type:Number,
    required: true
  },
  MaxPrice:{
    type:Number,
    required:true
  }

 
})
const Coupons=mongoose.model("Coupons",Couponchema)
module.exports=Coupons