const bcrypt = require('bcrypt');

const mongoose = require('mongoose')
var Cartschema = new mongoose.Schema({
  userID:{
    type:String,
    required:true 
  },
  productName:{
    type:String,
    required:true
  },
  productImages: [
    {
      type:String
    }
  ],
  promotionalPrice:{
    type:String,
    required:true
  },
  mrp:{
    type:String,
    required:true
  },
  stock:{
    type:String,
    required:true
    

  },
  discount:{
    type:String,
    required:true
  },
  status:{
    type:Boolean,
    required:true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  UserQuantity:{
    type:Number,
    required:true
  }

 
})
const Cart=mongoose.model("Cart",Cartschema)
module.exports=Cart