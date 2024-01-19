const mongoose = require("mongoose")
const Schema =mongoose.Schema

const UserOTPverificationSchema=new Schema({
  email:String,
  otp:String,
  createdAt:Date,
  expiresAt:Date,
})
const UserOTPverification = mongoose.model(
  "UserOTPverification",UserOTPverificationSchema
)
module.exports =UserOTPverification