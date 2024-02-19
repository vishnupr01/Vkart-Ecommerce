const mongoose = require('mongoose');

// Define the product schema

const schema = new mongoose.Schema({
 userId:{
    type:mongoose.SchemaTypes.ObjectId,
    required:true
 },
 orderItems:[{
    productId:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true,
    },
    uniqeId:{
        type:String,
        required:true

    },
    quantity:{
        type:Number,
        required:true        
    },
    pName:{
        type:String,
        required:true
    },
 
 

 
  
    price:{
        type:Number,
        required:true,

    },
    mrp:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
  
    image:[
        {
          type:String,
          required:true
 
        }
    ],
    orderStatus:{
        type:String,
        default:"ordered",
        required:true
    },
    returnReason:{
        type:String,
    },
    cancelReason:{
        type:String,
    }
 }],
 paymentMethod:{
    type:String,
    required:true
 },
 orderDate:{
    type:Date,
    default:Date.now()
 },
 address:{
type:String,
required:true
  
 },
 totalAmount:{
    type:Number
 },
 couponId:{
    type:String
 }
//  coupenAmount:{
//     type:Number
//  }


});

// Create a mongoose model using the product schema

const order = mongoose.model('order',schema);

// Export the Product model
module.exports = order;