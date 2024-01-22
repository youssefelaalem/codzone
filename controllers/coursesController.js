const asyncWrapper = require("../middleware/asyncWrapper");
let Course = require("../models/Courses.model");
const httpStatusText = require("../utils/httpStatusText");
const appError =require('../utils/appError')

const getallCourses =asyncWrapper(
async (req, res) => {
  const Query=req.query;
  const limit = Query.limit || 10;
  const page = Query.page || 1;
  const skip=(page-1)*limit
  const courses = await Course.find({},{"__v":false})
    .limit(limit).skip(page)
    res.json({ status: httpStatusText.SUCCESS, allCourses: courses });
});

const addCourse = asyncWrapper(
async (req, res, next) => {
  console.log("------------------------------------------------------");
  const newCourse = new Course(req.body);
  await newCourse.save().then(() => console.log("error"));
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const getCourse = asyncWrapper (
  async(req, res,next) => {
  
    //params return from the route
    const course = await Course.findById(req.params.id);
    if (!course) {
      const error=appError.create('course not found',404,httpStatusText.FAIL)
      
      return next(error)
      // return res.status(404).json({status: httpStatusText.FAIL,data: { course: "course not found" },});
    }
    res.json({ status: httpStatusText.SUCCESS, course });
  //   try {
  // } catch (err) {
  //   return res
  //     .status(400)
  //     .json({ status: httpStatusText.ERROR, message: err.message });
  // }
});

const updateCourse = asyncWrapper(
async (req, res) => {
  const _id = req.params.id;
  const updatedCourse = await Course.updateOne({ _id },{ $set: { ...req.body }});
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updatedCourse } });
  
});

const deleteCourse =asyncWrapper(
 async (req, res) => {

    const _id = req.params.id;
    console.log(_id);
   
    const deletedCourse = await Course.deleteOne({ _id });

    return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
  
});

module.exports = {
  getallCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
};
