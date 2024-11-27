const Razorpay = require('razorpay')
const order = require('../model/OrderModel')
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongoose');
const wallet = require('../model/WalletModel')

const product = require("../model/productModel")

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env
var razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY
})
console.log("iddddddddddddddddd:",RAZORPAY_SECRET_KEY)
module.exports = {

  generateRazorpay: async (orderId, totalAmount) => {
    const amount = Math.round(totalAmount * 100)
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
  totalOrders: async (req, res, management) => {
    if (management === "order") {
      const totalOrders = await order.aggregate([{
        $match: { userId: new mongoose.Types.ObjectId(req.session.UserID) }
      },
      {
        $unwind: {
          path: "$orderItems"
        }

      }])
      return totalOrders.length
    }
  },
  totalOrders1: async (req, res, management, category) => {
    if (management === "Product") {
      const totalOrders = await product.find({ category: category })
      return totalOrders.length
    }
  },
  walletExisting: async (userID) => {
    const result = await wallet.findOne({ userId: userID })
    return result
  },
  newWallet: async (userID) => {
    try {
      const transactionArray = []
      const newTranscation = new wallet({
        userId: userID,
        balance: 0,// replace with actual paymentMethod if available in Cart model
        transactions: transactionArray

      });
      await newTranscation.save()
      return newTranscation;

    } catch (error) {
      console.log(error);

    }
  },
  findLapotops: async (model) => {
    try {
      const result = await product.find({ category: model })
      return result

    } catch (error) {
      console.log(error);

    }
  }






}