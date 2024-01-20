const axios = require("axios")
const Adress = require("../model/AdressModel")
const Cart = require("../model/Cartmodel")

exports.register = (req, res) => {
  const status = req.query.status ?? "true"

  res.render("userRegister", {
    status: status, Username: req.session.userName, errorMessage: req.session.password,
    errorEmail: req.session.gmail,
    WrongPass: req.session.wrongpass,
    InvalidiateEmail: req.session.invalidEmail

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
exports.home = (req, res) => {
  axios.get(`http://localhost:${process.env.PORT}/api/categoryFind`)
    .then(response => {
      const category = response.data
      const loggedUser = req.session.homeName



      console.log(loggedUser);

      res.render("home", { category: category, homeName: loggedUser })
    })

}
exports.laptopPage = (req, res) => {
  const categoryName = req.params.categoryName;

  axios.get(`http://localhost:${process.env.PORT}/api/laptopFind?category=${categoryName}`)
    .then(response => {
      const laptops = response.data
      console.log("product", categoryName);
      res.render("Laptop", { laptops: laptops, })
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
    notEq: req.session.notEq
  }, (err, html) => {
    if (err) {
      return res.status(500).send(err);
    }

    delete req.session.old
    delete req.session.newName
    delete req.session.confirm
    delete req.session.new

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

    const sum = carts.reduce((accumulator, currentItem) => {
      const promotionalPrice = currentItem.promotionalPrice;
      const price = parseInt(promotionalPrice) * currentItem.UserQuantity
      return accumulator + price;
    }, 0);
    const totalProducts = carts.reduce((accumulator, currentItem) => {
      const produtsNum = currentItem.UserQuantity;

      return accumulator + produtsNum;
    }, 0);

    console.log("First request data:", carts);

    const response2 = await axios.get(`http://localhost:${process.env.PORT}/api/addressFind?Aid=${checkID}`);
    const Address = response2.data;
    console.log("Second request data:", Address);

    res.render('checkOut', { carts: carts, Address: Address, Total: sum, totalProducts: totalProducts }, (err, html) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.status(200).send(html);
    });
  } catch (error) {
    console.error("Error in requests:", error);
    res.status(500).send(error);
  }

};
exports.placed = (req, res) => {
  res.render('OrderPlaced')
}
exports.userOrder = async (req, res) => {
  try {
    const userId = req.session.UserID
    console.log("there is", userId);
    const orders = await axios.get(`http://localhost:${process.env.PORT}/api/Orders?oid=${userId}`)
    const orderList = orders.data;


    res.render('UserOrder', { orderList: orderList })

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
  console.log(details[0].productInfo);
  res.render("UserSingleOrder",{details:details})
}
exports.searchProduct=async(req,res)=>{
  const data=req.query.searchQuery
  const products= await axios.get(`http://localhost:${process.env.PORT}/api/getSearch?did=${data}`)
  const productGot=products.data
  
  res.render("LaptopCopy", { laptops: productGot})
  
}

