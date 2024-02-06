const Razorpay = require('razorpay')
const order = require('../model/OrderModel')
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongoose')

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env
var razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY
})

module.exports = {
  generateRazorpay: async (orderId,totalAmount) => {
    const amount=Math.round(totalAmount*100)
    return await razorpayInstance.orders.create({
      amount: amount,
        currency: "INR",
        receipt: ("" + orderId),
        notes: {
            key1: "value3",
            key2: "value2"
        }
    });
   
  },
  totalOrders:async(req,res,management)=>{
    if(management==="order"){
    const totalOrders=  await order.aggregate([{
       $match: { userId: new mongoose.Types.ObjectId(req.session.UserID) } },
      {$unwind:{
          path:"$orderItems"
        }

      }])
      return totalOrders.length
    }
  }
    



  
  
}