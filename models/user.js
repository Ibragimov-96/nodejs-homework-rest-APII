
const {User}=require('../db/userModel')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')



const registr = async (email,password)=>{
  
    const user = new User({
      email,password: await bcrypt.hash(password,10)
    })
    await user.save()
  }
  
  const registrControl = async(req,res)=>{
    const {email,password}= req.body
    const user = await User.findOne({email})
   
    if(user){
     res.status(409).json({ "message": "Email in use"})
    }
     await registr(email,password)
    res.status(200).json({email,password})
  }
  const loginControl = async (req,res)=>{
    const {email,password}= req.body
   const user = await User.findOne({email})
   
   if(!user){
    res.status(401).json({"message": "Email or password is wrong"})
   }

  if(! await bcrypt.compare(password, user.password)){
    res.status(401).json({"message": "Email or password is wrong"})
  }
    const token = jwt.sign({_id: user.id},"secret")
    res.status(200).json({
      token: token,
      "user": {
        email: email,
        subscription: "starter"
      }
    })
   
  }
  const logOut = (req, res, next) => {
  
    User.findByIdAndUpdate(req.user._id, { token: null})
   
  };
  const currentUser = (req, res, next) => {
  
  const user =  User.findByIdAndUpdate(req.user._id)
  const {token,email}= user
   if(!token){
    res.status(401).json({"message": "Not authorized"})
   }
   res.status(200).json({
    "email": `${email}`,
    "subscription": "starter"
  })
  };
  
  module.exports = {
    registrControl,
    loginControl,
    logOut,
    currentUser
  }
  