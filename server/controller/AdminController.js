const Userdb = require("../model/Usermodel");
const Categories = require("../model/AdminCategorymodel")
const order = require('../model/OrderModel')
const { ObjectId } = require('mongoose')
const { default: mongoose } = require('mongoose');
const Product = require('../model/productModel');
const CsvParser = require('json2csv').Parser


const bcrypt = require('bcrypt');

admincred = {
  adminemail: "admin@gmail.com",
  adminpass: 123
}

exports.Adminauth = (req, res) => {



  try {
    if (admincred.adminemail == req.body.email && admincred.adminpass == req.body.password) {
      req.session.isAuthenticated = true
     



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
  
    res.redirect('/adminCategory')



  } catch (error) {
    req.session.error = "An error occurred";
    res.redirect('/adminCategory');

  }


}
exports.unlisted = async (req, res) => {

  try {
    
    await Categories.updateOne({ _id: req.query.documentId }, { $set: { verified: false } })
    res.redirect("/adminCategory")
  } catch (error) {
    res.send(error)

  }
}
exports.listed = async (req, res) => {

  try {
   
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

    
    
    res.status(200).send(details); // Sending the details as the response

  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message });
  }
};
exports.getDetailsChart = async (req, res) => {
  try {
    let labelObj = {};
    let salesCount;
    let findQuerry;
    let currentYear;
    let currentMonth;
    let index;

    switch (req.body.filter) {
      case "Weekly":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;

        labelObj = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
        };

        salesCount = new Array(7).fill(0);

        findQuerry = {
          orderDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
        };
        index = 0;
        break;
      case "Monthly":
        currentYear = new Date().getFullYear();
        labelObj = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        salesCount = new Array(12).fill(0);

        findQuerry = {
          orderDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59),
          },
        };
        index = 1;
        break;
      case "Daily":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;
        let end = new Date(currentYear, currentMonth, 0, 23, 59, 59);
        end = String(end).split(" ")[2];
        end = Number(end);

        for (let i = 0; i < end; i++) {
          labelObj[`${i + 1}`] = i;
        }

        salesCount = new Array(end).fill(0);

        findQuerry = {
          orderDate: {
            $gt: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
        };

        index = 2;
        break;
      case "Yearly":
        findQuerry = {};

        const ord = await order.find().sort({ orderDate: 1 });
        const stDate = ord[0].orderDate.getFullYear();
        const endDate = ord[ord.length - 1].orderDate.getFullYear();

        for (let i = 0; i <= Number(endDate) - Number(stDate); i++) {
          labelObj[`${stDate + i}`] = i;
        }

        salesCount = new Array(Object.keys(labelObj).length).fill(0);

        index = 3;
        break;
      default:
        return res.json({
          label: [],
          salesCount: [],
        });
    }

    // const orders = await OrderDb.find(findQuerry);

    const orders = await order.aggregate(
      [
        {
          $match: findQuerry
        },
        {
          '$unwind': {
            'path': '$orderItems'
          }
        }
      ]
    );

    orders.forEach((order) => {
      if (index === 2) {
        salesCount[
          labelObj[Number(String(order.orderDate).split(" ")[index])]
        ] += 1;
      } else {
        salesCount[labelObj[String(order.orderDate).split(" ")[index]]] += 1;
      }
    });

    res.json({
      label: Object.keys(labelObj),
      salesCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server err");
  }
}
exports.salesReport = async (req, res, next) => {
  const startDate = req.query.startDate  
const endDate = req.query.endDate  
const startDateString = new Date(startDate.toString())
const endDateString =new Date(endDate.toString())
   
console.log(startDateString );

  try {
    let Order = [];
    const data = await order.aggregate([
      {
        $match: {
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $match:{
          "orderDate":{
            $gte:startDateString ,
            $lt:endDateString
          }
        }
      }
    ]);
    data.forEach((orders) => {
      const { _id, paymentMethod, orderDate } = orders;
      
      const { productId, quantity, pName, price } = orders.orderItems;
      Order.push({ _id, productId, orderDate, pName, price, quantity, paymentMethod }
      );
    })
    const TotalPrice = data.reduce((total, values) => total += values.orderItems.price * values.orderItems.quantity, 0)
    console.log('total', TotalPrice);
    console.log(startDateString );
    Order.push({ TotalPrice })

    const csvFields = ['Orders ID', 'Orders Date', 'Product Name', 'Price of a unit ', 'Qty', 'Payment method', 'Total Amount']

    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(Order);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attatchment: filename=salesReport.csv");

    res.status(200).end(csvData);
    // console.log(data);
    // res.send(data)
  } catch (error) {
    // res.send(error) 
    console.log(error);
    next(error)
  }
}

exports.ftProducts = async (req, res) => {
  Product.find()
  .then(products => {
    res.send(products)
  })
  .catch(err => {
    res.status(500).send({ message: err.message })
  })
};









