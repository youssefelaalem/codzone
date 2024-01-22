const express= require("express")
const route=express.Router()
const coursesController = require("../controllers/coursesController.js");
const verifyToken = require("../middleware/verifyToken.js");
const allowedUser=require('../middleware/allowedUser')
const userRoles =require('../utils/userRoles')
route.get("/", coursesController.getallCourses);
route.post("/",verifyToken,coursesController.addCourse);
route.get('/:id',coursesController.getCourse)
route.patch('/:id',coursesController.updateCourse)
route.delete("/:id",verifyToken,allowedUser(userRoles.ADMIN,userRoles.MANGER),coursesController.deleteCourse)

module.exports=route 