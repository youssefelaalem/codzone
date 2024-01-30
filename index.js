const express = require("express");
const app = express();
const path=require('path')

// var cors = require('cors')// if the connection IP addresses (orgin) are different
// app.use(cors())           //if req has been blocked by cors   
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
//join() to handle the direction of linex => uplou\avatar  at Mac or Microsoft => uplou/avatar

const mongoos = require("mongoose");
const httpStatusText =require("./utils/httpStatusText")
require('dotenv').config()
mongoos
  .connect(
    process.env.MONGO_LINK
  )
  .then(() => {
    console.log("connected to the database");
  });
app.use(express.json())//to receive json from the body
const routesCourses=require("./routes/routesCourses")
const routesUsers=require('./routes/routesUsers')
const transactionRouter=require('./routes/transaction')
app.use("/api/courses",routesCourses)
app.use("/api/users",routesUsers)
app.use('/api/transaction', transactionRouter)
// to handle all errors of routes that not exist in app
//global middelware for not found router
app.all("*",(req,res,next)=>{
  res.status(404).json({
    status:httpStatusText.ERROR,
    message:"this resource is not available"
  })
})
// global error handler taken next()
app.use((err,req,res,next)=>{
  res.status( err.statusCode||500).json({status:err.statusText||httpStatusText.ERROR,message:err.message,data:null,code:err.statusCode||500})
})
app.listen(process.env.PORT||5001, () => {
  console.log("http://localhost:5001/");
});
