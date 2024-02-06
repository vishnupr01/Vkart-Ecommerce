const coupons= require('../model/CouponModel')
const { ObjectId } = require('mongoose')
const { default: mongoose } = require('mongoose');
const { UpdateAddress } = require('./userController');

exports.createCoupon=async(req,res)=>{
  
   
  const {code,Discount,maxprice,maxuse,expiryDate} =req.body
  if (!code) {
    req.session.code = "the Fileld is required"
  }
  if (!req.body.Discount) {
    req.session.Discount = "the Fileld is required"
  }
  if (!req.body.maxprice) {
    req.session.maxprice = "the Fileld is required"
  }
  if (!req.body.maxuse) {
    req.session.maxuse = "the Fileld is required"
  }
  if (!req.body.expiryDate) {
    req.session.expiryDate= "the Fileld is required"
  }
  if (req.sessionexpiryDate || req.session.maxuse||req.session.maxprice|| req.session.Discount||req.session.code  ) {
    return res.status(401).redirect('/addCoupon')
  }
 

  const newCoupon= new coupons({
    Code:code, 
    Discount:Discount,
    MaxPrice:maxprice,
    Maxuse:maxuse,
    expiryDate:expiryDate 
  })
  await newCoupon.save()
  
  res.redirect('/addCoupon')

}
exports.deleteCoupon = async (req, res) => {
  console.log("heyss");
  try {
    console.log("hey");
    const couponID = req.query.CouponId;
    console.log(couponID);
    const result = await coupons.deleteOne({ _id: new mongoose.Types.ObjectId(couponID) });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.editCoupon = async (req, res) => {
  try {
    const couponId = req.query.eid.trim()
    console.log(couponId);
    const { code, Discount, maxprice, maxuse, expiryDate } = req.body;
    if (!code) {
      req.session.ecode = "the Fileld is required"
    }
    if (!Discount) {
      req.session.eDiscount = "the Fileld is required"
    }
    if (!maxprice) {
      req.session.emaxprice = "the Fileld is required"
    }
    if (!maxuse) {
      req.session.emaxuse = "the Fileld is required"
    }
    if (!expiryDate) {
      req.session.eexpiryDate= "the Fileld is required"
    }
    if (req.session.eexpiryDate || req.session.emaxuse||req.session.emaxprice|| req.session.eDiscount||req.session.ecode  ) {
      return res.status(401).redirect(`/CouponEdit?eid=${couponId}`)
    }
   
    let currentDate=Date.now()
     const newData=await coupons.updateMany({ expiryDate: { $lte:currentDate} },{$set:{status:false}})
    console.log(newData);
    // Assuming 'Coupon' is the model name and you have defined the schema appropriately
    const updatedResults = await coupons.updateOne(
      { _id: new mongoose.Types.ObjectId(couponId) },
      {
        $set: {
          Code: code,
          Discount: Discount,
          MaxPrice: maxprice,
          Maxuse: maxuse,
          expiryDate: expiryDate,
        },
      }
    );

   
  

   

    // Redirect to the appropriate route after successful update
    res.redirect('/addCoupon');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



