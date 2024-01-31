const Razorpay = require('razorpay')

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
    return new Promise((resolve, reject) => {
      razorpayInstance.orders.create({
        amount: amount,
        currency: "INR",
        receipt: ("" + orderId),
        notes: {
            key1: "value3",
            key2: "value2"
        }
        },function(err,order){
          console.log("hey",order);
          resolve(order)
        })

    })
  },
  
}