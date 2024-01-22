const express= require("express")
const route=express.Router()
const usersController=require("../controllers/usersController")
const multer  = require('multer')

const diskStorage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log('file',file);

        cb(null,'uploads')

    },
    filename:function(req,file,cb){
        const ext= file.mimetype.split('/')[1]
        const fileName=`user-${Date.now()}.${ext}`
        cb(null,fileName)
    }
})

const fileFilter=(req,file,cb)=>{
    const imageType=file.mimetype.split('/')[0]
    if(imageType==='image'){
        cb(null,true)
    }else{
        cb(appError.create('the file must be image',400),false)
    }
}

const upload = multer({ storage: diskStorage ,fileFilter}) 
const verifyToken =require('../middleware/verifyToken')
const appError = require("../utils/appError")

//get all users
// route.route('/').get(usersController.getAllUsers)
route.get('/',verifyToken,usersController.getAllUsers)
//register
route.post("/register",upload.single('avatar'),usersController.register)

//login
route.post("/login",usersController.login)

module.exports=route 