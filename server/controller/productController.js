const Product = require('../model/productModel')
const path = require('path')
const multer = require('multer');
const axios = require("axios")
const fs = require("fs")
const carts = require('../model/Cartmodel');
const { Mongoose } = require('mongoose');
const { default: mongoose } = require('mongoose');
const { response } = require('express');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }

});
exports.uploads = multer({ storage: storage, array: true })
exports.newProduct = async (req, res) => {


  const Images = req.files.map((file) => "/uploads/" + file.filename)
  



  try {


    const OrginalPrice = req.body.regularPrice
    const offerPrice = req.body.promotionalPrice
    const quantity = req.body.quantity
    const discount = req.body.discount
    // if (!req.body) {
    //   res.status(400).send({ message: "Content cannot be empty!" });
    // }

    if (!req.body.title) {
      req.session.title = "the Fileld is required"
    }
    if (!req.body.description) {
      req.session.description = "the Fileld is required"
    }
    if (!req.body.regularPrice) {
      req.session.regularPrice = "the Fileld is required"
    }
    if (!req.body.promotionalPrice) {
      req.session.promotionalPrice = "the Fileld is required"
    }
    if (!req.body.quantity) {
      req.session.quantity = "the Fileld is required"
    }
    if (!req.body.discount) {
      req.session.discount = "the Fileld is required"
    }
    if (!req.body.category) {
      req.session.category = "the Fileld is required"
    }
    if (Images.length === 0) {
      req.session.Images = "select Images"
    }
    if (req.session.Images || req.session.category
      || req.session.discount || req.session.quantity
      || req.session.promotionalPrice || req.session.regularPrice
      || req.session.description || req.session.title) {
      return res.status(401).redirect('/addProduct')
    }

    const validateRegularPrice = (OrginalPrice) => {
      // Regular expression for a basic email validation
      const tester = /^(\d+,?)*\d+$/;
      return tester.test(OrginalPrice);
    };
    const validatequantity = (qty) => {
      // Regular expression for a basic email validation
      const tester = /^(\d+(\.\d+)?|\.\d+)$/
      return tester.test(qty);
    };
    if (!validateRegularPrice(OrginalPrice)) {
     
      req.session.invalidPrice = "Enter correct input"
      return res.redirect('/addProduct')

    }
    if (!validateRegularPrice(offerPrice)) {
      req.session.invalidPrices = "Enter correct input"
      return res.redirect('/addProduct')

    }
    if (!validatequantity(quantity)) {
      req.session.invalidPriced = "Enter correct qty"
      return res.redirect('/addProduct')

    }
    if (!validatequantity(discount)) {
      
      req.session.discountPriced = "Enter correct discount"
   
      return res.redirect('/addProduct')

    }

    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      regularPrice: req.body.regularPrice,
      promotionalPrice: req.body.promotionalPrice,
      quantity: req.body.quantity,
      discount: req.body.discount,
      Images: Images,
      category: req.body.category,
      verified: true,
 



    })
   
    const savedProduct = await newProduct.save()
    
    res.redirect("/productlist")


  } catch (error) {
  
    res.status(500).json({ message: 'Internal server error' });

  }
}
exports.listedProducts = async (req, res) => {
  Product.find({ verified: true })
    .then(product => {
      res.send(product)
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })



}
exports.laptopPage = async (req, res) => {
  const category = req.query.category


  const productGot = await Product.find({ verified: true, category: category })
  const newId = productGot._id
  


  res.render("Laptop", { laptops: productGot, category: category })
}
exports.laptopPages = async (req, res) => {
  const category = req.query.catName
  
  const minPrice=req.query.minPrice
  const maxPrice=req.query.maxPrice
 


  const productGot = await Product.find({ verified: true, category: category,  promotionalPrice: { $gte: minPrice, $lte: maxPrice } })
  

 res.render("Laptop", { laptops: productGot, category: category })
}
exports.unlistedProducts = async (req, res) => {
  Product.find({ verified: false })
    .then(product => {
      res.send(product)
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
}
exports.addProductlist = async (req, res) => {

  try {
   
    await Product.updateOne({ _id: req.query.documentId }, { $set: { verified: true, quantity: 4 } })
    res.redirect("/productlist")
  } catch (error) {
    res.send(error)

  }
}
exports.deleteProductlist = async (req, res) => {

  try {
   
    await Product.updateOne({ _id: req.query.documentId }, { $set: { verified: false, quantity: 0 } })

    
    res.redirect("/productlist")
  } catch (error) {
    res.send(error)

  }
}
exports.updateProducts = async (req, res) => {
  const newImages = req.files.map((file) => "/uploads/" + file.filename)
  try {

    const id = req.query.id;
    const title = req.body.newtitle;

    const description = req.body.description
    const regularPrice = req.body.regularPrice
    const promotionalPrice = req.body.promotionalPrice
    const quantity = req.body.quantity
    const discount = req.body.discount

    const category = req.body.category



  ;


    if (!title) {
      req.session.title = "the Fileld is required"
    }
    if (!description) {
      req.session.description = "the Fileld is required"
    }
    if (!regularPrice) {
      req.session.regularPrice = "the Fileld is required"
    }
    if (!promotionalPrice) {
      req.session.promotionalPrice = "the Fileld is required"
    }
    if (!quantity) {
      req.session.quantity = "the Fileld is required"
    }
    if (!discount) {
      req.session.discount = "the Fileld is required"
    }
    if (!category) {
      req.session.category = "the Fileld is required"
    }

    if (req.session.Images || req.session.category
      || req.session.discount || req.session.quantity
      || req.session.promotionalPrice || req.session.regularPrice
      || req.session.description || req.session.title) {
      return res.status(401).redirect(`/gotProductedit?id=${id} `)
    }

    const validateRegularPrice = (OrginalPrice) => {
      // Regular expression for a basic email validation
      const tester = /^(\d+,?)*\d+$/;
      return tester.test(OrginalPrice);
    };
    const validatequantity = (qty) => {
      // Regular expression for a basic email validation
      const tester = /^(\d+(\.\d+)?|\.\d+)$/
      return tester.test(qty);
    };
    if (!validateRegularPrice(regularPrice)) {
     
      req.session.invalidPrice = "Enter correct input"
  
      return res.redirect(`/gotProductedit?id=${id} `)

    }
    if (!validateRegularPrice(promotionalPrice)) {
      console.log("my error");
      req.session.invalidPrices = "Enter correct input"
      console.log("error spotted");
      return res.redirect(`/gotProductedit?id=${id} `)

    }
    if (!validatequantity(quantity)) {
      console.log("my error");
      req.session.invalidPriced = "Enter correct qty"
      console.log("error spotted");
      return res.redirect(`/gotProductedit?id=${id} `)

    }
    if (!validatequantity(discount)) {
      console.log("my error");
      req.session.discountPriced = "Enter correct discount"
      console.log("error spotted");
      return res.redirect(`/gotProductedit?id=${id} `)
 
    }  
    await Product.updateOne({ _id: id }, {

      $set: {

        title: title, description: description, regularPrice: regularPrice, promotionalPrice: promotionalPrice,
        quantity: quantity, discount: discount, category: category
      },
      $push: {
        Images: { $each: newImages }
      }
    });


    res.redirect("/productlist")
  } catch (error) {
    req.session.error = "An error occurred";
    console.log(error);
    res.redirect("/bty");
  }

}
exports.productEdit = async (req, res) => {

  try {

    const id = req.query.id
    console.log(id);
    Product.findOne({ _id: id })
      .then(product => {
        res.send(product)
      })

  } catch (error) {
    res.send(error)

  }
}
exports.deleteImage = async (req, res) => {

  try {
    const imageId = req.query.imageId;
    const imageObjectId = parseInt(imageId);
    const productId = req.query.productId;


    const product = await Product.findById(productId);

    let imagesArray = product.Images;
    if (imageObjectId >= 0 && imageObjectId < imagesArray.length) {

      imagesArray.splice(imageObjectId, 1);
      const result = await Product.updateOne(
        { _id: productId },
        { $set: { Images: imagesArray } }

      );
      res.status(200).send("Image deleted successfully");
    } else {
      // Handle invalid index
      res.status(400).send("Invalid image index");
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



exports.AddtoCart = async (req, res) => {

  try {
    const UserID = req.session.UserID
    const productID = req.query.singleID
  


    const product = await Product.findOne({ _id: productID })

    const { title, promotionalPrice, Images, quantity, discount, regularPrice } = product




    const carted = new carts({
      productName: title,
      promotionalPrice: promotionalPrice,
      stock: quantity,
      userID: UserID,
      productImages: Images,
      discount: discount,
      status: true,
      productId: productID,
      UserQuantity: 1,
      mrp: regularPrice
    });
    await carted.save();

    const productUpdateResult = await Product.findByIdAndUpdate(productID, { $set: { status: true } }, { new: true })
   


    res.redirect('/getCart')

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }

}




exports.cartFind = async (req, res) => {
  try {
    const userID = req.query.uid;
  

    const cart = await carts.aggregate([
      { $match: { userID: userID } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" },
      {
        $project: {
          product_info: 1,
          userID: 1,
          UserQuantity: 1,

        }
      }
    ]); 

    // Assuming you want to send the cart data back to the client
   
    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteCart = async (req, res) => {
  try {
    const deleteID = req.query.cartID
    
    await Product.updateOne({ _id: deleteID }, { $set: { status: false } })
    await carts.deleteOne({ productId: deleteID });
    res.redirect('/getCart')

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }


}




