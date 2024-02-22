const express = require('express')
const axios =require('axios')
const order = require("../model/OrderModel")
const app = express()
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongoose')
admincred = {
  adminemail: "admin@gmail.com",
  adminpass: 123
}
const Adminauthentication = {


  isAdmin: (req, res, next) => {
    console.log(req.body);




    if (req.session.isAuthenticated) {

      return next()
    } else {
      // content={
      //     error:true,
      //     value:"Invalid admin credentials"
      // }

      res.redirect("/adminlogin")
      // res.send(err);
    }
  },
  NotAdmin: (req, res, next) => {
    if (!req.session.isAuthenticated) {
      return next()
    } else {
      axios.get(`http://localhost:${process.env.PORT}/api/UserManagement`)
  .then(response => {
   const users=response.data
     
   res.render("AdminIndex",{users:users})
   
  })
    }

  },
  isUser:(req,res,next)=>{
    if(req.session.isLogged){
      
      
      return next()
    }else{
      res.redirect('/login')
    }
  },
  NotUser:(req,res,next)=>{
    if(!req.session.isLogged||req.session.blocked){
      return next()
    }else{
      res.redirect("/")
    }
  },
  isRegister:(req,res,next)=>{
    if(req.session.registered){
      return next()
    }else{
      res.redirect("/register")
    }
  },
  isverifiedotp:(req,res,next)=>{
    if(req.session.otpVerify){
      return next()
    }else{
      res.redirect("/otp")
    }
  },
  notBlocked:(req,res,next)=>{
    if(!req.session.blocked){
      return next()

    }
    res.redirect("/login")

  },
 paginationResults:(model)=>{
    return async(req,res,next)=>{
    const page =req.query.page
    const limit=req.query.limit
    
    const startIndex=(page-1)*limit
    const endIndex =page*limit
    
    const results={}
    const data = await model.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.session.UserID) } },
      { $unwind: "$orderItems" },
      { 
        $sort: { orderDate: -1 } 
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          orderItems: 1,
          orderDate: {
            $dateToString: {
              format: " %Y-%m-%d", // Customize the format as needed
              date: "$orderDate",
              
            }
          }

        },
      }
      
       ]);
   
    if(endIndex<data.length){
    results.next ={
    page:page+1,
    limit:limit
    }
    }
    
    if(startIndex>0){
    results.previous ={
    page:page-1,
    limit:limit
    
    }
    }
   
    
   
     results.result=data.slice(startIndex,endIndex)
   
    req.paginatedResults=results.result
    req.page=page
    
    next()
    }
    
    },
    paginationResults2:(model)=>{
      return async(req,res,next)=>{
        const page = req.query.page || 1; // Default to page 1 if not provided
        const limit = req.query.limit ||8; // Default to limit 5 if not provided
      const category= req.query.category
      const minPrice=req.query.minPrice
      const maxPrice=req.query.maxPrice
      console.log(req.query);
      
      const startIndex=(page-1)*limit
      const endIndex =page*limit
      
      console.log("hey cater",category);
      const results={}
      if(minPrice&&maxPrice){
        const data = await model.find({ verified: true,category:req.query.catName,   promotionalPrice: { $gte: minPrice, $lte: maxPrice } })
    
      if(endIndex<data.length){
      results.next ={
      page:page+1,
      limit:limit
      }
      }
      
      if(startIndex>0){
      results.previous ={
      page:page-1,
      limit:limit
      
      }
      }
     
      
     
       results.result=data.slice(startIndex,endIndex)
     
      req.paginatedResults=results.result
      req.page=page
      
      next()

      }else{
        const data = await model.find({verified: true,category:category });
    
      if(endIndex<data.length){
      results.next ={
      page:page+1,
      limit:limit
      }
      }
      
      if(startIndex>0){
      results.previous ={
      page:page-1,
      limit:limit
      
      }
      }
     
      
     
       results.result=data.slice(startIndex,endIndex)
     
      req.paginatedResults=results.result
      req.page=page
      
      next()
      }
    
      
      }
      
      }

  


}

module.exports = Adminauthentication;
