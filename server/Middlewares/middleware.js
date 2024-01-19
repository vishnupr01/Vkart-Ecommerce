const express = require('express')
const axios =require('axios')
const app = express()
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
    if(!req.session.isLogged){
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
  


}
module.exports = Adminauthentication;