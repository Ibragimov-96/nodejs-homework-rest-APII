const express = require("express");
const Joi = require("joi");
const router = express.Router();
const {validateEmail} = require("./middlewares/validateBody");

const {autMid}= require('./middlewares/autorizeMidlewears')

const {
  registrControl,
    loginControl,
    logOut,
    currentUser
  } = require("../../models/user");

const reqistration = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
  
  })
  const login = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
  
  })

router.post("/register",validateEmail(reqistration),
async (req,res)=>{
 await registrControl(req,res)
})
router.post("/login",validateEmail(login),
async (req,res)=>{
  await loginControl(req,res)
 })
 router.use(autMid)
 router.post("/logout",async(req,res)=>{
  await logOut(req,res)
  res.status(204).json("Bearer {{token}}")
 }

 )

 router.get("/current",async(req,res)=>{
  await currentUser(req,res)
  res.status(204).json("Bearer {{token}}")
 }

 )
module.exports = router;