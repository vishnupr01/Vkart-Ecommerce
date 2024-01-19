const express=require("express")
const route=express.Router()
const UserRender=require("../services/UserRender")

const Usercontroller=require("../controller/userController")
const Adminauthentication=require('../Middlewares/middleware')
const productController=require("../controller/productController")
route.get('/', UserRender.home)
route.get('/register',Adminauthentication.NotUser, UserRender.register)
route.post('/api/registerUser',Usercontroller.createUser)
route.post('/api/checkotp',Usercontroller.sendOTPVerificationEmail)
route.post('/api/verifyotp',Usercontroller.verifyOTP)
route.post('/api/login',Adminauthentication.NotUser,Usercontroller.loginAuth)
route.get('/api/Block',Usercontroller.Blocked)
route.get('/api/unBlock',Usercontroller.UnBlocked)
route.get('/laptop', Adminauthentication.isUser, productController.laptopPage)

route.get('/loadAccount',Usercontroller.loadAccount)
route.get('/logout',Usercontroller.logOut)
route.get('/editAccount',UserRender.edit)
route.get('/api/editAccount',Usercontroller.editAccount)
route.post('/api/changes',Usercontroller.passwordChanges)
route.get('/changePassword',UserRender.renderPass)
route.get('/singleProduct',UserRender.singleProduct)
route.get('/api/singleFind',Usercontroller.singleFind)
route.post('/api/changesSave',Usercontroller.ChangesSave)
route.get('/gotoCart',productController.AddtoCart)
route.get('/getCart',UserRender.getCart)
route.get('/api/cartFind',productController.cartFind)
route.get('/deleteCart',productController.deleteCart)
route.get('/manageAdress',UserRender.adress)
route.post('/api/createAdress',Usercontroller.createAdress)
route.get('/api/addressFind',Usercontroller.addressFind)
route.get('/deleteAdress',Usercontroller.deleteAddress)
route.get('/editAddress',UserRender.editAddress)
route.get('/api/editFindAdres',Usercontroller.editFindAdress)
route.post('/api/UpdateAdress',Usercontroller.UpdateAddress)
route.get('/api/checkOut',UserRender.checkOut)
route.get('/api/checkFind',Usercontroller.checkFind)
route.get('/UpdateQuantity',Usercontroller.UpdateQuantity)
route.get('/placed',UserRender.placed)
route.post('/api/payment',Usercontroller.payment)
route.get('/viewOrders',UserRender.userOrder)
route.get('/api/Orders',Usercontroller.ordersFind)
route.get('/api/cancelOrder',Usercontroller.cancelOrder)
route.get('/UserItemDetails',UserRender.UserItemDetails)
route.get('/api/UserSingleOrderDetail',Usercontroller.UserSingleOrderDetail)





route.get('/login',Adminauthentication.NotUser, UserRender.login)

route.get('/otp',Adminauthentication.isRegister,UserRender.otp)


module.exports=route