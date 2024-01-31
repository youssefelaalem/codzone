const e = require("express");
const asyncWrapper = require("../middleware/asyncWrapper");
const user = require("../models/User.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const generate_token = require("../utils/generat_token");
const path = require("path");
const {cloudinaryUploadImage,cloudinaryRemoveImage} = require("../utils/cloudinary")
const fs = require("fs");

///////////////////////getAllUsers///////////////////////////
const getAllUsers = asyncWrapper(async (req, res) => {
//     const authHeader =
//     req.headers["Authoraization"] || req.headers["authorization"];
//   const token = authHeader.split(" ")[1];
//     console.log('token at allUsers',authHeader)
  const Query = req.query;
  const limit = Query.limit || 10;
  const page = Query.page || 1;
  const skip = (page - 1) * limit;
  const users = await user.find({}, { __v: false, password: false });
  res.json({ status: httpStatusText.SUCCESS, allUsers: users });
});

/////////////////////register/////////////////////////////
const register = asyncWrapper(async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password ,role } = req.body;
  const oldUser = await user.findOne({ email: email });
  // console.log(oldUser);
  if (oldUser) {
    const error = appError.create(
      "user already exists !!",
      400,
      httpStatusText.FAIL
    );
    return next(error); 
  }
  const password_Hashed = await bcrypt.hash(password, 10);
  //to assign the images
  //1.validation
  console.log("req.file=>",req.file);
  if(!req.file){
    return res.status(400).json({message:"no file provided"})
  }
  //2.get the path to the image
  const imagePath = path.join(__dirname,`../uploads/${req.file.filename}`)
  //3.upload ro cloudinary
  const result =await cloudinaryUploadImage(imagePath)
  console.log(result)
  
  
  // creattion
  const newUser = new user({
    firstName,
    lastName,
    email,
    password: password_Hashed,
    role,
    avatar:req.file.filename,
  });

  //4.get the user from database
  //5.delete the old profile photo if it exists
  if (newUser.profilePhoto.publicId !== null){
    await cloudinaryRemoveImage(newUser.profilePhoto.publicId)
  }
  //6.change the profile photo
  newUser.profilePhoto={
    url:result.secure_url,
    publicId:result.public_id,
  }
  ////////////////////////generate token////////////////////////
  const token = generate_token({ email: newUser.email, _id: newUser._id ,role:newUser.role });
  console.log("token", token);
  newUser.token = token;
  //save
  await newUser.save();
  
  //response
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { status: "success", userData:newUser, token } });

    //8.Remove the photo from the server
    fs.unlinkSync(imagePath)
  });
// LOGIN
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "email and pass are required !!",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const userData = await user.findOne({ email });
  if (!userData) {
    const error = appError.create(
      "user NOT exists !!",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const comparedPassword = await bcrypt.compare(password, userData.password);

  console.log(userData);

  if (userData && comparedPassword) {
    const token = generate_token({ email: userData.email, _id: userData._id ,role:userData.role});

    res
      .status(201)
      .json({
        status: httpStatusText.SUCCESS,
        data: { status: "success", userData, token },
      });
  } else {
    const error = appError.create(
      "data  NOT matched !!",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
});

/////////////////profilePhotoUpload//////////////////////////////////
  const profilePhotoUpload =asyncWrapper(async(req,res)=>{
    //1.valedation
    if (!req.file){
      return res.status(400).json({message:"no file provided"})
    }
    //2.get the path of image
    const imagePath = path.join(__dirname,`../uploads/${req.file.filename}`)
    //3.upload to cloudinary 
    const result =await cloudinaryUploadImage(imagePath)
    // console.log(result)
    
    //4. get hte user from DB
    const userlogged = await user.findById(req.currentUserToken._id)
   
    //5.delete the old profile photo if it exists
  if (userlogged.profilePhoto.publicId !== null){
    await cloudinaryRemoveImage(userlogged.profilePhoto.publicId)
  }
    //6.change the profile photo
    userlogged.profilePhoto={
    url:result.secure_url,
    publicId:result.public_id,
  }
  await userlogged.save()
    //7.send response to client
    res.status(200).json({message:"your profile photo uploaded successfully",profilePhotoLink:{url:userlogged.profilePhoto.url}})
    //8.Remove the photo from the server
    fs.unlinkSync(imagePath)
  })
module.exports = { getAllUsers, register, login,profilePhotoUpload };
