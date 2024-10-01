const express= require("express")
const dotenv = require("dotenv")
const morgan=require("morgan")
const app = express()
const path = require("path")
dotenv.config({path:'config.env'})
const PORT=process.env.PORT||8080
const connectDB = require('./server/database/connection')
const bcrypt=require("bcrypt")
const flash = require('express-flash')
const multer=require("multer")

const session = require('express-session')

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true

}))
app.use(morgan('tiny'))
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }))
const cacheTime = 60;
app.use((req, res, next) => {
  // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
  res.setHeader("Cache-Control", `public,no-store, must-revalidate, max-age=${cacheTime}`);
  res.setHeader("Pragma", "no-cache"); 
  res.setHeader("Expires","0") 
  next()
})

app.use('/',require("./server/routes/userRouter"))
app.use('/',require("./server/routes/AdminRouter"))


app.use(express.static(path.join(__dirname, 'assets')))

// Multer error handling middleware
app.use((err, req, res, next) => {  
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);
    return res.status(500).json({ message: 'Multer error', error: err });
  }
  next(err);
});
app.get("*",function(req,res){
  res.status(404).render("404error")
})

app.set('view engine', 'ejs')
connectDB()




app.listen(PORT,()=>console.log(`server is running on http://localhost:${PORT}`))