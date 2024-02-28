const axios = require("axios")
const Adress = require("../model/AdressModel")
const Cart = require("../model/Cartmodel")
const userHelper = require("../helperFunction/userHelper")


exports.register = (req, res) => {
  const status = req.query.status ?? "true"

  res.render("userRegister", {
    status: status, Username: req.session.userName, errorMessage: req.session.password,
    errorEmail: req.session.gmail,
    WrongPass: req.session.wrongpass,
    InvalidiateEmail: req.session.invalidEmail,
    STRONGpASS:req.session.strongPass,
    exis:req.session.Exis

  }, (error, html) => {
    req.session.destroy(error => {
      if (error) {
        console.error("Error destroying session:", error);
      }


    })
    res.send(html);
  })
}
exports.login = (req, res) => {
  res.render("userlogin", {
    errorMessage: req.session.password,
    errorEmail: req.session.gmail,
    UserFound: req.session.noUser,
    WrongPass: req.session.wrongpass,
    userblock: req.session.block,
    InvalidiateEmail: req.session.invalidEmail

  }, (error, html) => {
    req.session.destroy(error => {
      if (error) {
        console.error("Error destroying session:", error);
      }
    });

    res.send(html);
  });
};
exports.otp = (req, res) => {

  res.render("OTPverify", { invalid: req.session.invalid, expired: req.session.expired })
  delete req.session.invalid;
  delete req.session.expired;

}
exports.home =async(req, res) => {
 const response= await axios.get(`http://localhost:${process.env.PORT}/api/categoryFind`)
 const category = response.data
 const loggedUser = req.session.homeName
console.log(category);
 const laptops=await userHelper.findLapotops(category[0].name)
 const keyboards=await userHelper.findLapotops(category[1].name)
 const Monitors=await userHelper.findLapotops(category[3].name)

 
     

      

 res.render("home", { category: category, homeName: loggedUser,Laptops:laptops,keyboards:keyboards,Monitors:Monitors })
  

}
exports.laptopPage = (req, res) => {
  const categoryName = req.params.categoryName;

  axios.get(`http://localhost:${process.env.PORT}/api/laptopFind?category=${categoryName}`)
    .then(response => {
      const laptops = response.data
      console.log("product", categoryName);
      res.render("Laptop", { laptops: laptops,category:laptops[0].category })
    })
 
}
exports.edit = (req, res) => {
  const editEmail = req.session.checkEmail
  console.log(editEmail);


  axios.get(`http://localhost:${process.env.PORT}/api/editAccount?editEmail=${editEmail}`)
    .then(response => {
      const doc = response.data

      req.session.editName = doc.name
      req.session.mailEdit = doc.email
      req.session.editId = doc._id
      res.render("userEditAccount", {
        name: req.session.editName, email: req.session.mailEdit, id: req.session.editId, notOld: req.session.old, notNew: req.session.new, notCon: req.session.confirm,
        notName: req.session.newName, notEq: req.session.notEq
      }, (err, html) => {
        if (err) {
          return res.status(500).send(err);
        }

        delete req.session.old
        delete req.session.newName
        delete req.session.confirm
        delete req.session.new
        delete req.session.notEq

        res.status(200).send(html);
      })



    })




}
exports.renderPass = (req, res) => {
  const editEmail = req.session.checkEmail
  res.render('changePass', {
    email: editEmail, notOld: req.session.old, notNew: req.session.new, notCon: req.session.confirm,
    notEq: req.session.notEq,StrongPass:req.session.strongPass
  }, (err, html) => {
    if (err) {
      return res.status(500).send(err);
    }

    delete req.session.old
    delete req.session.newName
    delete req.session.confirm
    delete req.session.new
    delete req.session.strongPass

    res.status(200).send(html);
  })




}
exports.singleProduct = async (req, res) => {
  const productId = req.query.sid
  console.log(productId);
  const userID = req.session.UserID
  const carted = await Cart.findOne({ userID: userID, productId: productId })
  console.log("hey here", carted);
  if (carted) {
    req.session.carted = true
  } else {
    req.session.carted = false
  }

  axios.get(`http://localhost:${process.env.PORT}/api/singleFind?sid=${productId}`)
    .then(response => {
      const product = response.data

      const status = req.session.carted


      res.render("singleProduct", { productS: product, status: status })
    })

}
exports.getCart = (req, res) => {
  const userID = req.session.UserID


  axios.get(`http://localhost:${process.env.PORT}/api/cartFind?uid=${userID}`)
    .then(response => {
      const cart = response.data
      console.log("shamil here");
      console.log(cart);
      console.log("iam here");
      const outOfStockProducts = cart.filter(item => item.product_info.quantity === 0);

      if (outOfStockProducts.length > 0) {
          req.session.outofStock = true;
      }else{
        req.session.outofStock = false
      }
      
      const sum = cart.reduce((accumulator, currentItem) => {
        const promotionalPrice = currentItem.product_info.promotionalPrice
        const price = parseInt(promotionalPrice) * currentItem.UserQuantity
        return accumulator + price;
      }, 0);

      console.log(sum);



      res.render("Cart", { carts: cart, Total: sum.toLocaleString(),outofStock:req.session.outofStock })
    })
}


exports.adress = (req, res) => {
  const userID = req.session.UserID
  axios.get(`http://localhost:${process.env.PORT}/api/addressFind?Aid=${userID}`)
    .then(response => {
      const Address = response.data

      res.render('manageAdress', {
        Address: Address, AdressName: req.session.AdressName, address: req.session.address,
        phone: req.session.phone, pincode: req.session.pincode, locality: req.session.locality, city: req.session.city,
        state: req.session.state
      }, (err, html) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        delete req.session.AdressName
        delete req.session.address
        delete req.session.phone
        delete req.session.pincode
        delete req.session.locality
        delete req.session.city
        delete req.session.state

        res.status(200).send(html);
      })
    })
}
exports.editAddress = (req, res) => {
  const editid = req.query.Aid;
  console.log("got ", editid);
  axios.get(`http://localhost:${process.env.PORT}/api/editFindAdres?Afid=${editid}`)
    .then(response => {
      const EditAddress = response.data;

      res.render('updateAdress', {
        Address: EditAddress, AdressName: req.session.AdressName, address: req.session.address,
        phone: req.session.phone, pincode: req.session.pincode, locality: req.session.locality, city: req.session.city,
        state: req.session.state
      }, (err, html) => {


        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        delete req.session.AdressName
        delete req.session.address
        delete req.session.phone
        delete req.session.pincode
        delete req.session.locality
        delete req.session.city
        delete req.session.state

        res.status(200).send(html);
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
};
exports.checkOut = async (req, res) => {
  try {
    const checkID = req.session.UserID
    console.log("jk", checkID);

    const response1 = await axios.get(`http://localhost:${process.env.PORT}/api/checkFind?checkId=${checkID}`);
    const carts = response1.data;
    console.log("new",carts[0].product_info.Images[0]);

    const sum = carts.reduce((accumulator, currentItem) => {
      const promotionalPrice =  currentItem.product_info.promotionalPrice;
      const price = parseInt(promotionalPrice) * currentItem.UserQuantity
      return accumulator + price;
    }, 0);
    console.log(sum);
    const totalProducts = carts.reduce((accumulator, currentItem) => {
      const produtsNum = currentItem.UserQuantity;

      return accumulator + produtsNum;
    }, 0);

    console.log("First request data:", carts);

    const response2 = await axios.get(`http://localhost:${process.env.PORT}/api/addressFind?Aid=${checkID}`);
    const Address = response2.data;
    console.log("Second request data:", Address);
    if(sum>5000){
      req.session.cash="cashondelivery is not available"
    }

    res.render('checkOut', { carts: carts, Address: Address, Total: sum, totalProducts: totalProducts,couponValue:req.session.couponValue,
      couponError:req.session.couponError,codeError:req.session.codeError,couponExpired:req.session.couponExpire,errorCash: req.session.cash,insufficent:req.session.insufficent }, (err, html) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      delete req.session.couponError
      delete req.session.codeError
      delete req.session.couponApplied
      delete req.session.couponExpire 
      delete req.session.cash
      delete req.session.insufficent
     

      res.status(200).send(html);
    });
  } catch (error) {
    console.error("Error in requests:", error);
    res.status(500).send(error);
  }

};
exports.placed = (req, res) => {
  res.render('OrderPlaced', (err, html) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    delete req.session.couponAmount
    
   

    res.status(200).send(html);})
}
exports.userOrder = async (req, res) => {
  try {
    const paginatedResults = req.paginatedResults;
    const page=req.page
    const userId = req.session.UserID
    const orders = await axios.get(`http://localhost:${process.env.PORT}/api/Orders?oid=${userId}`)
    const orderList = orders.data;
    console.log("my order",paginatedResults[0]._id);
    const totalOrders=await userHelper.totalOrders(req,res,"order")
    
    
     if(paginatedResults.length >0){
      
      res.render('UserOrder', { orderList: paginatedResults ,totalOrders:totalOrders,page:page,notCancel: req.session.notCancel },(err,html)=>{
        if(err){
          console.log(err);
        return res.status(500).send(err);

        }
        delete req.session.notCancel
     
     

      res.status(200).send(html);
      })
     }else{
      res.render('UserOrder', { orderList:orderList,totalOrders:totalOrders,page:page  })
     }
    
     
  

  } catch (error) {
    console.error("Error in requests:", error);
    res.status(500).send(error)

  }

}
exports.UserItemDetails=async(req,res)=>{
  const orderId=req.query.orderId
  const productId=req.query.productId
  console.log(orderId);
  console.log(productId);
  const response = await axios.get(`http://localhost:${process.env.PORT}/api/UserSingleOrderDetail?orderId=${orderId}&productId=${productId}`);
  const details=response.data
  console.log(details);
  const mainId=details[0]._id
  console.log(details[0]._id);
  res.render("UserSingleOrder",{details:details,MainId:mainId})
}
exports.searchProduct=async(req,res)=>{
  const data=req.query.searchQuery
  const products= await axios.get(`http://localhost:${process.env.PORT}/api/getSearch?did=${data}`)
  const productGot=products.data
  
  res.render("LaptopCopy", { laptops: productGot})
  
}
exports.wallet=async(req,res)=>{

  try {
    const userID=req.session.UserID
    const existingWallet=await userHelper.walletExisting(userID)
    console.log(existingWallet);
   
    if(existingWallet){
      const balance=existingWallet.balance
      const transactionArray=existingWallet.transactions
      res.render("Wallet",{balance,transactionArray,errorWallet:req.session.Amount},(err,html)=>{
        if(err){
          console.log(err);
        }
        delete req.session.Amount

        res.status(200).send(html);
      })

    }else{
      const userID=req.session.UserID
     const wallet= await userHelper.newWallet(userID)
     console.log(wallet);
     const balance=wallet.balance
    const transactionArray=wallet.transactions
      res.render("Wallet",{balance,transactionArray,errorWallet:req.session.Amount},(err,html)=>{
        if(err){
          console.log(err);
        }
        delete req.session.Amount

        res.status(200).send(html);
      })
    }


    
   
    
  } catch (error) {
    console.log(error);
    
  }

 
}

 