const mongoose =require('mongoose')
const validator=require('validator')
const userRoles=require('../utils/userRoles')
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type: String,
        unique: true,
        required:true,
        validate: [validator.isEmail,'must be a viled email'],
    },
    profilePhoto:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId:null,
        }
    },
    role:{
        type:String,
        enum:[userRoles.ADMIN,userRoles.MANGER,userRoles.USER],
        default:userRoles.USER,
    },
    avater:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
})
module.exports= mongoose.model("User",userSchema)