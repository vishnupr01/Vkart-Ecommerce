// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  regularPrice: Number,
  promotionalPrice: Number,
  quantity: Number,
  discount: String,
  verified:{
    type:Boolean

  },
  
  Images: [
    {
      type:String
    }
  ],
  category:String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
