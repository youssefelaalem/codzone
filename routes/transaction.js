const { Router } = require("express");
const { get, post } = require("../controllers/transaction.js");
const router = new Router()
router.get('/', get)
router.post('/', post)
module.exports=router 