const express=require("express")
const route=express.Router()
const UserRender=require("../services/UserRender")
const userHelper=require("../helperFunction/userHelper")

const Usercontroller=require("../controller/userController")
const Adminauthentication=require('../Middlewares/middleware')
const WalletController=require('../controller/WalletController')

const productController=require("../controller/productController")
const order = require("../model/OrderModel")
const products=require("../model/productModel")
route.get('/', UserRender.home)
route.get('/register',Adminauthentication.NotUser, UserRender.register)
route.post('/api/registerUser',Usercontroller.createUser)
route.post('/api/checkotp',Usercontroller.sendOTPVerificationEmail)
route.post('/api/verifyotp',Usercontroller.verifyOTP)
route.post('/api/login',Adminauthentication.NotUser,Usercontroller.loginAuth)
route.get('/api/Block',Usercontroller.Blocked)
route.get('/api/unBlock',Usercontroller.UnBlocked)
route.get('/laptop',Adminauthentication.paginationResults2(products), productController.laptopPage)


route.get('/loadAccount',Adminauthentication.notBlocked,Usercontroller.loadAccount)
route.get('/logout',Usercontroller.logOut)
route.get('/editAccount',Adminauthentication.notBlocked,Adminauthentication.isUser, UserRender.edit)
route.get('/api/editAccount',Usercontroller.editAccount)
route.post('/api/changes',Usercontroller.passwordChanges)
route.get('/changePassword',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.renderPass)
route.get('/singleProduct',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.singleProduct)
route.get('/api/singleFind',Usercontroller.singleFind)
route.post('/api/changesSave',Usercontroller.ChangesSave)
route.get('/gotoCart',productController.AddtoCart)
route.get('/getCart',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.getCart)
route.get('/api/cartFind',productController.cartFind)
route.get('/deleteCart',productController.deleteCart)
route.get('/manageAdress',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.adress)
route.post('/api/createAdress',Usercontroller.createAdress)
route.get('/api/addressFind',Usercontroller.addressFind)
route.get('/deleteAdress',Usercontroller.deleteAddress)
route.get('/editAddress',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.editAddress)
route.get('/api/editFindAdres',Usercontroller.editFindAdress)
route.post('/api/UpdateAdress',Usercontroller.UpdateAddress)
route.get('/api/checkOut',UserRender.checkOut)
route.get('/api/checkFind',Usercontroller.checkFind)
route.get('/UpdateQuantity',Usercontroller.UpdateQuantity)
route.get('/placed',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.placed)
route.post('/api/payment',Usercontroller.payment)
route.get('/viewOrders',Adminauthentication.notBlocked,Adminauthentication.isUser ,Adminauthentication.paginationResults(order), UserRender.userOrder)
route.get('/api/Orders',Usercontroller.ordersFind)
route.get('/api/cancelOrder',Usercontroller.cancelOrder)
route.get('/UserItemDetails',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.UserItemDetails)
route.get('/api/UserSingleOrderDetail',Usercontroller.UserSingleOrderDetail)
route.get('/searchProduct',Adminauthentication.notBlocked,Adminauthentication.isUser,UserRender.searchProduct)
route.get('/api/getSearch',Usercontroller.getSearch)
route.post('/api/paymentVerification',Usercontroller.paymentVerification)
route.get('/wallet',UserRender.wallet)
route.get('/invoice',Usercontroller.invoice)
route.get('/retryPayment',Usercontroller.retryPayment)
route.get('/AddWallet',WalletController.AddWallet)
route.post('/api/paymentVerificationWallet',WalletController.paymentVerificationWallet)






route.get('/login',Adminauthentication.NotUser, UserRender.login)

route.get('/otp',Adminauthentication.isRegister,UserRender.otp)


module.exports=route