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
  },
  expiryDate:{
    type:Date,
   required:true
 },
 createdDate:{
  type:Date,
  required:true,
  default:Date.now()
 },
 status:{
  type:Boolean,
  default:true
 }

 
})
const Coupons=mongoose.model("Coupons",Couponchema)
module.exports=Coupons