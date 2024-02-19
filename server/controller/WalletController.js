const wallet = require('../model/WalletModel')
const coupon = require('../model/CouponModel')
const userHelper=require('../helperFunction/userHelper')
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env
const crypto = require('crypto')


exports.AddWallet = async (req, res) => {
  try {
    const Amount = req.query.amount
    const UserId = req.session.UserID
    const UserWallet = await wallet.findOne({ userId: UserId })
   

    const orders = await userHelper.generateRazorpay(UserWallet._id, parseInt(Amount));
    console.log("vishnu",orders);
     return res.status(200).json({orders});

   


  } catch (error) {
    console.log(error);

  }

}
exports.paymentVerificationWallet=async(req,res)=>{
  try {
    const UserId = req.session.UserID
    const amount=req.query.amount
    const Amount=Math.round(amount/100)
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const body_data = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET_KEY)
      .update(body_data)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    console.log("success");
    if(isValid){

      const UserWallet = await wallet.findOne({ userId: UserId })
      UserWallet.transactions.push({amount:Amount,date:Date.now(),status:"credit"})
    
      UserWallet.save()
     
     const currentBalance = UserWallet.balance + parseInt(Amount) 
     const update=await wallet.findOneAndUpdate({userId:UserId},{$set:{balance:currentBalance}})
     console.log(update);
     res.redirect('/wallet')

    }
    
  } catch (error) {
    console.log(error);
    
  }
}