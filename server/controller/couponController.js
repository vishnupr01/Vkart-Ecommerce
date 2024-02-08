const coupons = require('../model/CouponModel')
const { ObjectId } = require('mongoose')
const { default: mongoose } = require('mongoose');
const { UpdateAddress } = require('./userController');
const Cart = require('../model/Cartmodel')

exports.createCoupon = async (req, res) => {


  const { code, Discount, maxprice, maxuse, expiryDate } = req.body
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
    req.session.expiryDate = "the Fileld is required"
  }
  if (req.sessionexpiryDate || req.session.maxuse || req.session.maxprice || req.session.Discount || req.session.code) {
    return res.status(401).redirect('/addCoupon')
  }


  const newCoupon = new coupons({
    Code: code,
    Discount: Discount,
    MaxPrice: maxprice,
    Maxuse: maxuse,
    expiryDate: expiryDate
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
      req.session.eexpiryDate = "the Fileld is required"
    }
    if (req.session.eexpiryDate || req.session.emaxuse || req.session.emaxprice || req.session.eDiscount || req.session.ecode) {
      return res.status(401).redirect(`/CouponEdit?eid=${couponId}`)
    }

    let currentDate = Date.now()
    const newData = await coupons.updateMany({ expiryDate: { $lte: currentDate } }, { $set: { status: false } })
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
exports.couponApply = async (req, res) => {
  try {
    const couponCode = req.query.couponCode
    const total = req.query.total
    console.log("hey", couponCode);
    console.log("he", total);
    const checkID = req.session.UserID


    const cart = await Cart.aggregate([
      { $match: { userID: checkID } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" },
      {
        $project: {
          product_info: 1,
          userID: 1,
          UserQuantity: 1,

        }
      }
    ]);
    const amounts = cart.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.product_info.promotionalPrice * currentValue.UserQuantity
    }, 0);
    const result = await coupons.aggregate([{ $match: { Code: couponCode } }]);
    console.log(result);
    if (result.length === 0) {
      res.status(200).json({error:"coupon doesn't exist" });
    } else {
      if (result[0].status === false) {
       
       
        res.status(200).json({error:"coupon Expired"});
      } else {
        if (result && result.length > 0 && amounts >= result[0].MaxPrice) {
          const discountAmount = amounts * (result[0].Discount / 100);
          const AfterApply = amounts - discountAmount;
          console.log(discountAmount);
          req.session.couponApplied = AfterApply
          req.session.couponValue = "value"
          res.status(200).json({ AfterApply });
        } else {
          
          res.status(200).json({ error:"coupon is not applicable for this amount"});
        }

      }


    }




  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });

  }


}



