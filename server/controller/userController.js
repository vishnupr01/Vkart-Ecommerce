const Userdb = require('../model/Usermodel');
const UserOTPverification = require('../model/OTPverification')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt');
const { reset } = require('nodemon');
const { request, response } = require('express');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongoose');
const Product = require('../model/productModel');
const Adress = require('../model/AdressModel');
const Cart = require('../model/Cartmodel');
const order = require('../model/OrderModel')
const razorpay=require("razorpay")
const crypto=require('crypto')
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env

const userHelper=require('../helperFunction/userHelper')


const saltrounds = 10; // Adjust the number of salt rounds as needed


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  }
})

exports.createUser = async (req, res) => {

  try {
    const email = req.body.email
    if (!req.body) {
      res.status(400).send({ message: "Content cannot be empty!" });
    }
    const validateEmail = (email) => {
      // Regular expression for a basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };


    if (!req.body.name) {
      req.session.userName = "the Fileld is required"
    }
    if (!req.body.email) {
      req.session.gmail = "the Fileld is required"
    }
    if (!req.body.password) {
      req.session.password = "the Fileld is required"
    }
    if (req.session.gmail || req.session.password) {
      return res.status(401).redirect('/login')
    }
    if (!validateEmail(email)) {
      req.session.invalidEmail = "Invalid email address"
      return res.redirect('/register')

    }


    console.log('here');

    // Check if a user with the same email already exists
    const existingUser = await Userdb.findOne({ email: req.body.email });
    const rePassword = req.body.repassword
    const firstPassword = req.body.password
    try {
      if (firstPassword !== rePassword) {
        res.redirect('/register?status=false');

      }

    } catch (error) {
      console.error('Error in createUser:', error);
      res.status(500).render('error.ejs', { error: 'Some error occurred' });
    }


    if (existingUser) {
      res.status(400).render('email_error.ejs');
    } else {
      try {
        const hashPassword = await bcrypt.hash(req.body.password, saltrounds);

        // If the email is not already in use, create a new user
        const user = new Userdb({
          name: req.body.name,
          email: req.body.email,
          password: hashPassword,
          verified: false,
          status: false,
          block: false
        });

        req.session.user = user
        //Store the user'semail in the session 
        req.session.email = req.body.email
        // const savedUser = await user.save()
        req.session.registered = true


        res.redirect('/otp');

      }

      catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send({ message: 'Error hashing password' });
      }
    }

    console.log('end');
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const email = req.session.email;

      // MAIL OPTIONS
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Enter <b>${otp}</b> in the app to verify the email address</p>`,
      };
      // const hashedOTP = await bcrypt.hash(otp, 10);
      const newOTPVerification = new UserOTPverification({
        email: email,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30000,
      });
      console.log(otp);

      // Save the OTP verification record in the DB
      await newOTPVerification.save();

      // Send OTP verification email
      await transporter.sendMail(mailOptions);
      setTimeout(async () => {
        // Delete the OTP verification record from the DB
        await UserOTPverification.deleteOne({ _id: newOTPVerification._id });
        console.log(`OTP record deleted after 30 seconds for email: ${email}`);
      }, 60000)

      // Redirect to OTP verification page


    } catch (error) {
      console.error('Error in sendOTPVerificationEmail:', error);
      throw new Error('Failed to send OTP verification email');
    }

  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).send({ message: 'Some error occurred' });
  }
};

exports.sendOTPVerificationEmail = async (req, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const email = req.session.email;

    // MAIL OPTIONS
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Enter <b>${otp}</b> in the app to verify the email address</p>`,
    };
    // const hashedOTP = await bcrypt.hash(otp, 10);
    const newOTPVerification = new UserOTPverification({
      email: email,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30000,
    });
    console.log(otp);

    // Save the OTP verification record in the DB
    await newOTPVerification.save();

    // Send OTP verification email
    await transporter.sendMail(mailOptions);
    setTimeout(async () => {
      // Delete the OTP verification record from the DB
      await UserOTPverification.deleteOne({ _id: newOTPVerification._id });
      console.log(`OTP record deleted after 30 seconds for email: ${email}`);
    }, 60000)

    // Redirect to OTP verification page


  } catch (error) {
    console.error('Error in sendOTPVerificationEmail:', error);
    throw new Error('Failed to send OTP verification email');
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const enteredOTP = req.body.otp; // Assuming you have a form field named "otp"
    const email = req.session.email;
    console.log(enteredOTP);
    console.log(email);

    // Retrieve the OTP verification record from the DB
    const otpVerificationRecord = await UserOTPverification.findOne({ email: email }).sort({ expiresAt: -1 });
    console.log(otpVerificationRecord);

    if (!otpVerificationRecord) {
      console.log("first error");
      // Handle the case where the OTP record is not found
      req.session.invalid = "invalid otp"
      req.session.expired = null
      res.redirect('/otp')
      return;
    }
    const currentTime = Date.now();
    if (currentTime > otpVerificationRecord.expiresAt) {
      req.session.expired = "expired otp"
      req.session.invalid = null
      res.redirect('/otp')
      return
    }


    // Compare the entered OTP with the stored hashed OTP
    if (enteredOTP == otpVerificationRecord.otp) {
      const newUser = req.session.user
      const savedUser = new Userdb(newUser)
      await savedUser.save()
      await Userdb.findOneAndUpdate({ email: email }, { $set: { verified: true } });
      req.session.otpVerify = true
      res.redirect('/login');
      console.log("ready");



    } else {
      req.session.invalid = "invalid otp"
      req.session.expired = null
      res.redirect('/otp');


    }
    // const isOTPValid = await bcrypt.compare(enteredOTP, otpVerificationRecord.otp);


    // if (!isOTPValid) {
    //   console.log("second error") 
    //   // Handle the case where the entered OTP is not valid
    //   res.redirect('/otp?status=invalid');
    //   return;
    // }
    console.log("correct")

    // OTP is valid, update the user's verification status in the Userdb collection

    console.log("recorrect")


    // Redirect to a success page or any other appropriate page

  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).send('Internal Server Error');
  }
};
exports.loginAuth = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Userdb.findOne({ email: email })
    const blocked = await Userdb.findOne({ email: email, block: true })
    const validateEmail = (email) => {
      // Regular expression for a basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };



    if (!req.body.email) {
      req.session.gmail = "the Fileld is required"
    }
    if (!req.body.password) {
      req.session.password = "the Fileld is required"
    }
    if (req.session.gmail || req.session.password) {
      return res.status(401).redirect('/login')
    }
    if (!validateEmail(email)) {
      req.session.invalidEmail = "Invalid email address"
      return res.redirect('/login')

    }
    if (blocked) {
      req.session.block = "the user is blocked"
      return res.redirect('/login')
    }
    if (!user) {
      req.session.noUser = 'no user found'
      return res.redirect('/login')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      req.session.wrongpass = 'Invalid password'
      return res.redirect('/login')
    }
    const loggedUser = await Userdb.findOneAndUpdate({ email: email }, { $set: { status: true } });
    req.session.isLogged = true
    req.session.homeName = loggedUser.name
    req.session.checkEmail = loggedUser.email
    req.session.UserID = loggedUser._id
    console.log(req.session.UserID);



    res.redirect('/')
  } catch (error) {
    res.status(401).redirect('/register')
  }

}
exports.Blocked = async (req, res) => {
  console.log('HYYY');
  console.log(req.query.email);
  try {
    await Userdb.updateOne({ email: req.query.email }, { $set: { block: true } })
    req.session.blocked = true
    res.redirect("/UserManage")
  } catch (error) {
    res.send(error)

  }

};
exports.UnBlocked = async (req, res) => {
  try {
    await Userdb.updateOne({ email: req.query.email }, { $set: { block: false } })
    req.session.blocked = false
    res.redirect("/UserManage") 
  } catch (error) {
    res.send(error)

  }

};
exports.loadAccount = async (req, res) => {

  try {


    const checkEmail = req.session.checkEmail
    if (req.session.isLogged) {

      const loggedUser = await Userdb.findOne({ email: checkEmail })
      const name = loggedUser.name
      const email = req.session.checkEmail

      console.log(name);
      
        res.render("userAccount", { name, email })
    
      

    } else {
      req.session.modal = true
      res.redirect('/')

    }





  } catch (error) {
    console.error("Error loading account:", error);
    res.status(500).render("errorPage", { errorMessage: "An error occurred while loading the account." });


  }
}
exports.logOut = (req, res) => {

  req.session.destroy();
  res.redirect('/login')

}
exports.editAccount = async (req, res) => {

  const editEmail = req.query.editEmail
  console.log(editEmail);
  Userdb.findOne({ email: editEmail })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
exports.passwordChanges = async (req, res) => {


  try {

    const newDoc = await Userdb.findOne({ email: req.session.checkEmail })
    console.log(newDoc);
    console.log(req.session.checkEmail);


    const oldPassword = req.body.oldPassword
    const newPassword = req.body.editPassword
    const confirmPass = req.body.confirmPass
    const newName = req.body.newName
    console.log(oldPassword);


    const isPasswordValid = await bcrypt.compare(oldPassword, newDoc.password)
    if (!oldPassword) {
      req.session.old = "the Fileld is required"
    }
    if (!confirmPass) {
      req.session.confirm = "the Fileld is required"
    }
    if (!newPassword) {
      req.session.new = "the Fileld is required"
    }
    if (req.session.new || req.session.confirm || req.session.old) {
      return res.status(401).redirect('/changePassword')
    }


    if (isPasswordValid) {
      console.log("pass");

      if (newPassword === confirmPass) {
        const hashPassword = await bcrypt.hash(newPassword, saltrounds);
        console.log("here");
        const myDoc = await Userdb.updateOne({ email: req.session.checkEmail }, { $set: { name: newName, password: hashPassword } })
        console.log(myDoc);
        res.redirect('/editAccount')

      } else {
        req.session.notEq = "enter correct password"
        res.redirect('/changePassword')
      }
    } else {
      req.session.notEq = "enter correct password"
      res.redirect('/changePassword')

    }


  } catch (error) {
    console.error("Error loading account:", error);
    res.status(500).render("errorPage", { errorMessage: "An error occurred while loading the account." });


  }

}
exports.ChangesSave = async (req, res) => {


  try {



    const newDoc = await Userdb.findOne({ email: req.session.checkEmail })
    console.log(newDoc);
    const newName = req.body.newName
    if (!newName) {
      req.session.newName = "the Fileld is required"
      res.redirect('/editAccount')
    }

    const myDoc = await Userdb.updateOne({ email: req.session.checkEmail }, { $set: { name: newName } })
    res.redirect('/loadAccount')


  } catch (error) {
    console.error("Error loading account:", error);
    res.status(500).render("errorPage", { errorMessage: "An error occurred while loading the account." });


  }
}
exports.singleFind = async (req, res) => {
  const productId = req.query.sid
  console.log(productId);
  Product.findOne({ _id: productId })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })


}
exports.createAdress = async (req, res) => {
  const userID = req.session.UserID
  console.log("adress", userID);
  try {
    if (!req.body.Adressname) {
      req.session.AdressName = "the Fileld is required"
    }
    if (!req.body.address) {
      req.session.address = "the Fileld is required"
    }
    if (!req.body.phone) {
      req.session.phone = "the Fileld is required"
    }
    if (!req.body.pincode) {
      req.session.pincode = "the Fileld is required"
    }
    if (!req.body.locality) {
      req.session.locality = "the Fileld is required"
    }
    if (!req.body.city) {
      req.session.city = "the Fileld is required"
    }
    if (!req.body.state) {
      req.session.state = "the Fileld is required"
    }

    
    if (req.session.phone || req.session.address || req.session.AdressName
         ||req.session.state || req.session.city|| req.session.locality ||req.session.pincode ) {
      return res.status(401).redirect('/manageAdress')
    }
    const address = new Adress({
      userID: userID,
      name: req.body.Adressname,
      Adress: req.body.address,
      phone: req.body.phone,
      pincode:req.body.pincode,
      locality:req.body.locality,
      city:req.body.city,
      state:req.body.state

    })
    await address.save()
    res.redirect('/manageAdress')



  } catch (error) {
    console.error("Error loading account:", error);
    res.status(500).render("errorPage", { errorMessage: "An error occurred while loading the account." });

  }
}
exports.addressFind = (req, res) => {
  const userID = req.query.Aid
  Adress.find({ userID: userID })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: err.message })
    })


}
exports.deleteAddress = async (req, res) => {
  try {
    const AdressId = req.query.Aid
    console.log("delete", AdressId);

    await Adress.deleteOne({ _id: AdressId });
    res.redirect('/manageAdress')


  } catch (error) {
    console.error("Error loading account:", error);
    res.status(500).render("errorPage", { errorMessage: "An error occurred while loading the account." });

  }


}
exports.editFindAdress = (req, res) => {
  const AddressID = req.query.Afid
  Adress.findOne({ _id: AddressID })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: err.message })
    })


}
exports.UpdateAddress = async (req, res) => {
  console.log("iam here");
  try {
    const Aid = req.query.Aid
    const newName = req.body.Adressname
    const newAdress = req.body.address
    const newPhone = req.body.phone
    const newPincode=req.body.pincode
    const newlocality=req.body.locality
    const  newState=req.body.state
    const newCity=req.body.city
    if (!newName) {
      req.session.AdressName = "the Fileld is required"
    }
    if (!newAdress ) {
      req.session.address = "the Fileld is required"
    }
    if (!newPhone) {
      req.session.phone = "the Fileld is required"
    }
    if (!newPincode) {
      req.session.pincode = "the Fileld is required"
    }
    if (!newlocality) {
      req.session.locality = "the Fileld is required"
    }
    if (!newState) {
      req.session.city = "the Fileld is required"
    }
    if (!newCity) {
      req.session.state = "the Fileld is required"
    }

    
    if (req.session.phone || req.session.address || req.session.AdressName
         ||req.session.state || req.session.city|| req.session.locality ||req.session.pincode ) {
      return res.status(401).redirect(`/editAddress?Aid=${Aid}`)
    }

    await Adress.updateOne({ _id: Aid }, { $set: { name: newName, Adress: newAdress, phone: newPhone,pincode:newPincode,
    locality:newlocality,state:newState,city:newCity } })
    res.redirect('/manageAdress')




  } catch (error) {
    console.log(err);
    res.status(500).send({ message: err.message })

  }

}
exports.checkFind = (req, res) => {
  const checkID = req.query.checkId
  console.log("user got", checkID);
  Cart.find({ userID: checkID })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: err.message })
    })


}
exports.UpdateQuantity = async (req, res) => {
  const totalQuantity = req.query.quid
  const productId = req.query.productId
  await Cart.updateOne({ productId: productId, userID: req.session.UserID }, { $set: { UserQuantity: totalQuantity } })
  res.redirect('/getCart')

}
exports.payment = async (req, res) => {
  const body = req.body
  const address = req.body.selectedAddress
  const paymentMethod = req.body.paymentMethod 
  const userId = req.session.UserID
  const cartId = req.query.cartId
  const totalAmount = req.body.totalAmount
  console.log(paymentMethod);
  
  const doc = await Cart.find({ userID: userId })

  const orderItemsArray = [];


  

  // Iterate through each orderDetails in the doc
  for (const orderDetails of doc) {

    // Create an order item object and push it to the array
    orderItemsArray.push({
      productId: orderDetails.productId,
      quantity: orderDetails.UserQuantity,
      pName: orderDetails.productName,
      price: orderDetails.promotionalPrice,
      mrp: orderDetails.mrp,
      discount: orderDetails.discount,
      image: orderDetails.productImages,
      orderStatus: 'Pending',
      returnReason: '',
      cancelReason: '',

    });
  }

 
  
  const newOrder = new order({
    userId: userId,
    paymentMethod: paymentMethod, // replace with actual paymentMethod if available in Cart model
    orderDate: new Date(),
    address: address,
    totalAmount: totalAmount,
    orderItems: orderItemsArray
  });

 const savedOrder= await newOrder.save();
 req.session.orderId=savedOrder.id


 await Cart.deleteMany({ userID: req.session.UserID })

  if(paymentMethod==="cashOnDelivery"){
    console.log("codddd");
    const originalOrder = await order.findById(req.session.orderId);
    const updateProductPromises = originalOrder.orderItems.map(async (item) => {
      const productId = item.productId;
      const orderedQuantity = item.quantity;

      await Product.updateOne(
        { _id: productId },
        { $inc: { quantity: -orderedQuantity } }
      );
    });
    function updateOrderStatus(originalOrder , newStatus) {
      originalOrder.orderItems.forEach((item) => {
        item.orderStatus = newStatus;
      });
    }
    updateOrderStatus(originalOrder, "ordered");
    const updatedOrder = await originalOrder.save();
    return res.json({codSuccess:true})
  }else{
    const orders = await userHelper.generateRazorpay(savedOrder._id,totalAmount );
    console.log(orders,'kdf;adlfjakafjsdkalfjk');
    return res.status(200).json({orders});
    
    }
}

exports.ordersFind = async (req, res) => {
  try {
    const userID = req.query.oid;
   

    const data = await order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userID) } },
      { $unwind: "$orderItems" },
      {
        $project: {
          _id: 1,
          userId: 1,
          orderItems: 1,
          orderDate: 1,

        },
      },
      { $sort: { orderDate: -1 } }
    ]);


    res.send(data);
  } catch (err) {
    
    res.status(500).send({ message: err.message });
  }
};
exports.cancelOrder = async (req, res) => {

  try {
    
    const orderId = req.query.cancelId
    const productId=req.query.productId
    const {orderItems} = await order.findOne({ "orderItems._id": new mongoose.Types.ObjectId(orderId) }, {"orderItems.$": 1, _id: 0});
   
  const UserQuantity=orderItems[0].quantity
    await order.updateOne(
      { "orderItems._id": new mongoose.Types.ObjectId(orderId) },
      { $set: { "orderItems.$.orderStatus": "Canceled" } }
    )
    await Product.updateOne({_id:productId},{$inc:{quantity:UserQuantity}})
    
    res.redirect('/viewOrders')

  } catch (error) {
    
    res.status(500).send({ message: err.message });
  }
}
exports.UserSingleOrderDetail =async(req, res) => {
  try {
    const orderId = req.query.orderId;
    
    const productId = req.query.productId;
 
    const details = await order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      {
        $lookup: {
          from: "userdbs",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$orderItems"
      },
      {
        $lookup: {
          from: "products", 
          localField: "orderItems.productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $match: {
          "productInfo._id": new mongoose.Types.ObjectId(productId)
        }
      },
      {
        $project: {
          userInfo: 1,
          productInfo: 1,
          orderDate:1,
          address:1,
          paymentMethod:1,
          "orderItems.orderStatus":1
          



        }
      }
    ]);

    // console.log("hello");
    // console.log(details[0].userInfo);
    // console.log(details[0].productInfo);
    // console.log(details[0].orderDate)
    // console.log("Address:", details[0].address)
    
    res.status(200).send(details); // Sending the details as the response

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message });
  }
};
exports.getSearch = async (req,res) =>{
  try {
    // const search = req.body.search;
    const search = req.query.did;
    console.log(search);
    const regexPattern = new RegExp(search, 'i');
    const searchResults = await Product.find({
      $or: [
        {title: regexPattern },
        { category: regexPattern },
        // { subTitle: regexPattern },
        // { descriptionHeading: regexPattern },
        // { description: regexPattern },
      ],
    });

    res.send(searchResults)
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
}

exports.paymentVerification = async(req, res) => {
  try {
    console.log("payment verification");
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const body_data = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET_KEY)
      .update(body_data)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      console.log(razorpay_order_id);
      console.log(req.session.orderId);
      const originalOrder = await order.findById(req.session.orderId);
      console.log(("got by",originalOrder));
      function updateOrderStatus(originalOrder , newStatus) {
        originalOrder.orderItems.forEach((item) => {
          item.orderStatus = newStatus;
        });
      }
      updateOrderStatus(originalOrder, "ordered");
      const updatedOrder = await originalOrder.save();
    
      const updateProductPromises = originalOrder.orderItems.map(async (item) => {
        const productId = item.productId;
        const orderedQuantity = item.quantity;

        await Product.updateOne(
          { _id: productId },
          { $inc: { quantity: -orderedQuantity } }
        );
      });

      await Promise.all(updateProductPromises);
      console.log(updatedOrder);
    
     
      console.log('Order status updated successfully');
      res.redirect('/placed');
    } else {
      const originalOrder = await order.findById(req.session.orderId);
      function OrderStatus(originalOrder , newStatus) {
        originalOrder.orderItems.forEach((item) => {
          item.orderStatus = newStatus;
        });
      }
      OrderStatus(originalOrder, "payment failed");
      const updatedOrder = await originalOrder.save();
      console.log("entered");
    // Corrected the ObjectId creation
      res.status(500).send({ success: false, message: 'Internal Server Error' });
    }

  } catch (error) {
    console.log(error);
  }
};
















