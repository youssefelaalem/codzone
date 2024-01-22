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
    token:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:[userRoles.ADMIN,userRoles.MANGER,userRoles.USER],
        default:userRoles.USER,
    },
    avatar:{
        type:String,
        default:'uploads/avatar_1.png'

    }
})
module.exports= mongoose.model("User",userSchema)