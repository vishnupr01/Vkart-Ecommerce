
const { response } = require("express");
const Userdb = require("../model/Usermodel");
const axios = require("axios")
const uuid = require('uuid')
const couponFunction=require("../helperFunction/AdminHelper")

exports.Adminlogin = (req, res) => {
  const Adminerror = req.session.error

  res.render("AdminLogin", { Adminerror: Adminerror }, (error, html) => {
    if (error) {
      console.error("Error destroying session:", error);
      return res.send('errr')
    }

    delete req.session.error;

    res.send(html);
  })
}
exports.Dashboard = async (req, res) => {
  try {
    const response1 = await axios.get(`http://localhost:${process.env.PORT}/api/UserManagement`);
    const users = response1.data;

    const response2 = await axios.get(`http://localhost:${process.env.PORT}/api/totalOrders`);
    const orders = response2.data;
    console.log(orders);
    const response3 = await axios.get(`http://localhost:${process.env.PORT}/api/toProducts`);
    const products=response3.data

    res.render("AdminIndex", { users: users, orders: orders,count:products });
  } catch (error) {
    console.error("Error in axios request", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.userManage = async (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/UserManagement`)
    .then(response => {
      const users = response.data

      res.render("UserManage", { users: users })

    })
}
exports.adminCategory = (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/categoryFind`)
    .then(response => {
      const category = response.data
      res.render("AdminCategories", { category: category })
    })

}
exports.unlistedCategory = (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/categoryUnlist`)
    .then(response => {
      const category = response.data
      res.render("AdminUnlist", { category: category })
    })

}
exports.editCategory = (req, res) => {


  res.render("AdminEditCateg")
}
exports.addProduct = (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/categoryFind`)
    .then(response => {
      const category = response.data

      res.render("addProduct", { category: category,error:req.session.invalidPrice,errorr:req.session.invalidPrices,errors:req.session.invalidPriced,err:req.session.discountPriced,
      notitle:req.session.title,noDescription: req.session.description,noRegular: req.session.regularPrice,noPromo:  req.session.promotionalPrice,noQty:req.session.quantity,
      noDis:req.session.discount,noCat:req.session.category,noImg:req.session.Images},(err, html) => {
        if(err){
          console.log(err);
          return res.status(500).send(err);
        }
  
        delete req.session.invalidPrice
        delete req.session.invalidPrices
        delete req.session.invalidPriced
        delete req.session.discountPriced
        delete req.session.regularPrice
        delete req.session.promotionalPrice
        delete req.session.quantity
        delete req.session.discount
        delete req.session.category
        delete req.session.Images
        delete req.session.title
        delete req.session.description
       
       
  
        res.status(200).send(html);})
    })
}
exports.productList = (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/productlist`)
    .then(response => {
      const products = response.data
      res.render("productlist", { products: products })
    })


}
exports.productUnlist = (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/unlistedProducts`)
    .then(response => {
      const products = response.data
      res.render("productUnlist", { products: products })
    })


}
exports.orderManage = async (req, res) => {
  try {
    const userId = req.session.UserID
    console.log("there is", userId);
    const orders = await axios.get(`http://localhost:${process.env.PORT}/api/OrdersManage`)
    const orderList = orders.data;
    console.log(orderList);

    res.render("AdminOrder", { orderList: orderList })

  } catch (error) {
    console.error("Error in requests:", error);
    res.status(500).send(error)

  }

}
exports. gotProductedit = async (req, res) => {
  try {
    const id = req.query.id;
    let doc;

    // First Axios request
    const response = await axios.get(`http://localhost:${process.env.PORT}/api/docFind?id=${id}`);
    doc = response.data;
    console.log(doc);

    // Second Axios request
    const secondResponse = await axios.get(`http://localhost:${process.env.PORT}/api/categoryFind`);
    const { title, description, regularPrice, promotionalPrice, quantity, discount, Images } = doc;
    const category = secondResponse.data;
    console.log(category); 

    // Render the response with both sets of data
    res.render("productEditCateg", { title, description, regularPrice, promotionalPrice, quantity, category, discount, Images, id,error:req.session.invalidPrice,errorr:req.session.invalidPrices,errors:req.session.invalidPriced,err:req.session.discountPriced,
      notitle:req.session.title,noDescription: req.session.description,noRegular: req.session.regularPrice,noPromo:  req.session.promotionalPrice,noQty:req.session.quantity,
      noDis:req.session.discount,noCat:req.session.category,noImg:req.session.Images},(err, html) => {
        if(err){
          console.log(err);
          return res.status(500).send(err);
        }
  
        delete req.session.invalidPrice
        delete req.session.invalidPrices
        delete req.session.invalidPriced
        delete req.session.discountPriced
        delete req.session.regularPrice
        delete req.session.promotionalPrice
        delete req.session.quantity
        delete req.session.discount
        delete req.session.category
        delete req.session.Images
        delete req.session.title
        delete req.session.description
       
       
  
        res.status(200).send(html);
    })
  }

   catch (error) {
    console.error(error);
    res.send(error);
  } 
};
exports.itemDetails=async(req,res)=>{
  const orderId=req.query.orderId 
  const productId=req.query.productId
  const response = await axios.get(`http://localhost:${process.env.PORT}/api/singleOrderDetail?orderId=${orderId}&productId=${productId}`);
  const details=response.data
  console.log(details);
  console.log(details[0].productInfo);
  res.render("singleOrder",{details:details})

}
exports.addCoupon=async(req,res)=>{
  try {
    const result=await couponFunction.findingCoupon()
  
    
    
  
    
    res.render('AddCoupon',{coupon:result,notcode:req.session.code,
    notMaxprice: req.session.maxprice ,notMaxuse:req.session.maxuse,
     notExpirydate:req.session.expiryDate,notDiscount:req.session.Discount} ,(err, html) => {
      if (err) {
        return res.status(500).send(err);
      }

      delete req.session.code
      delete req.session.maxprice
      delete req.session.maxuse
      delete req.session.expiryDate
      delete req.session.Discount

      res.status(200).send(html);
    })
    
  } catch (error) {
    console.error(error);
    res.send(error);
    
  }

}
exports.couponEdit=async(req,res)=>{
  try {
    const couponId=req.query.eid
    console.log("found",req.query.eid);
    console.log("got id",couponId);
    var result =  await couponFunction.singleCoupon(couponId,req,res)
    console.log("got",result);
    res.render('editCoupon',{result,notcode:req.session.ecode,
      notMaxprice: req.session.emaxprice ,notMaxuse:req.session.emaxuse,
       notExpirydate:req.session.eexpiryDate,notDiscount:req.session.eDiscount},(err, html) => {
        if (err) {
          return res.status(500).send(err);
        }
  
        delete req.session.ecode
        delete req.session.emaxprice
        delete req.session.emaxuse
        delete req.session.eexpiryDate
        delete req.session.eDiscount
  
        res.status(200).send(html);
      })
    
    
  } catch (error) {
    console.error(error);
    res.send(error);
    
  }
 

}

