const e = require("express");
const asyncWrapper = require("../middleware/asyncWrapper");
const user = require("../models/User.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const generate_token = require("../utils/generat_token");

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
//register
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
  console.log("req.file=>",req.file);
  // creattion
  const newUser = new user({
    firstName,
    lastName,
    email,
    password: password_Hashed,
    role,
    avatar:req.file.filename,
  });
  //generate token
  const token = generate_token({ email: newUser.email, _id: newUser._id ,role:newUser.role });
  console.log("token", token);
  newUser.token = token;
  //save
  await newUser.save();
  //response
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { status: "success", newUser, token } });
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

module.exports = { getAllUsers, register, login };
