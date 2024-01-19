const Userdb = require("../model/Usermodel");
const Categories = require("../model/AdminCategorymodel")
const order = require('../model/OrderModel')
const { ObjectId } = require('mongoose')
const { default: mongoose } = require('mongoose');
const Product = require('../model/productModel');

const bcrypt = require('bcrypt');
admincred = {
  adminemail: "admin@gmail.com",
  adminpass: 123
}

exports.Adminauth = (req, res) => {



  try {
    if (admincred.adminemail == req.body.email && admincred.adminpass == req.body.password) {
      req.session.isAuthenticated = true
      console.log("logged");



      res.redirect('/adminsdash')
    }
    else {
      // content={   
      //     error:true,
      //     value:"Invalid admin credentials"
      // }
      req.session.error = "invalid credentials"
      res.redirect("/adminlogin")
      // res.send(err);
    }
  } catch {
    console.log("error");

    res.redirect("/adminlogin")
  }


}
exports.UserManage = (req, res) => {

  Userdb.find()
    .then(user => {
      res.send(user)
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })




}
exports.CategoryFind = (req, res) => {




  Categories.find({ verified: true })
    .then(category => {
      res.send(category)
    })

    .catch(err => {
      res.status(500).send({ message: err.message })
    })


}
exports.categoryUnlist = (req, res) => {




  Categories.find({ verified: false })
    .then(category => {
      res.send(category)
    })

    .catch(err => {
      res.status(500).send({ message: err.message })
    })


}


exports.categoryManage = async (req, res) => {


  const categoryName = req.body.categoryName
  try {
    if (!categoryName) {
      req.session.error = "the field is required"
      return res.redirect("/adminCategory")

    }
    const newCategory = new Categories({
      name: categoryName,
      verified: true
    });
    const savedCategory = await newCategory.save()
    console.log(savedCategory);
    res.redirect('/adminCategory')



  } catch (error) {
    req.session.error = "An error occurred";
    res.redirect('/adminCategory');

  }


}
exports.unlisted = async (req, res) => {

  try {
    console.log(req.query.documentId);
    await Categories.updateOne({ _id: req.query.documentId }, { $set: { verified: false } })
    res.redirect("/adminCategory")
  } catch (error) {
    res.send(error)

  }
}
exports.listed = async (req, res) => {

  try {
    console.log(req.query.documentId);
    await Categories.updateOne({ _id: req.query.documentId }, { $set: { verified: true } })
    res.redirect("/unlistedCategory")
  } catch (error) {
    res.send(error)

  }
}
exports.CategoryEdit = async (req, res) => {

  try {
    const id = req.query.id
    const doc = await Categories.findOne({ _id: id })
    const valueName = doc.name
    console.log(valueName);
    res.render("AdminEditCateg", { cateName: valueName, id: id })



  } catch (error) {
    res.send(error)

  }
}
exports.updateCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const newName = req.body.categoryName;

    if (!newName) {
      req.session.error = "The field is required";
      return res.redirect(`/adminCategory/edit?id=${id}`);
    }
    console.log(id);

    await Categories.updateOne({ _id: id }, { $set: { name: newName } });

    res.redirect("/adminCategory")
  } catch (error) {
    req.session.error = "An error occurred";
    res.redirect("/adminCategory");
  }

}
exports.orderAdmin = async (req, res) => {
  try {
    const userID = req.query.oid;
    console.log("cont", userID);

    const data = await order.aggregate([

      { $unwind: "$orderItems" },
      {
        $project: {
          _id: 1,
          userId: 1,
          orderItems: 1,
          orderDate: 1
        },
      },
      { $sort: { orderDate: -1 } }
    ]);


    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
}
exports.saveStatus = async (req, res) => {
  try {
    const itemId = req.body.orderId
    const newStatus = req.body.selectedValue
    const productId=req.body.productId
  console.log("hi");
    console.log("itemid here", itemId);
    const UserQuantity=orderItems[0].quantity
    const response = await order.updateOne(
      { "orderItems._id": new mongoose.Types.ObjectId(itemId) },
      { $set: { "orderItems.$.orderStatus": newStatus } }
    )
  
    res.send(response)

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: err.message });
  }
}
exports.totalOrders = async (req, res) => {
  try {

    const data = await order.aggregate([

      { $unwind: "$orderItems" },
      {
        $project: {
          _id: 0,
          userId: 1,
          orderItems: 1,
          orderDate: 1
        },
      },
      
    ]);



    res.send(data)

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: err.message });
  }
}
exports.singleOrderDetail = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    console.log(orderId);
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








