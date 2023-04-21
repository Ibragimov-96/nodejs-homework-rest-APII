const { User } = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravar = require('gravatar')
const path = require("path");
const avatarPath = path.join(__dirname, "../publick/avatars");

const Jimp = require("jimp");
const fsp = require("fs/promises");
const registr = async (email, password) => {
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    avatarURL: gravar.url(email)
    
  });
  await user.save();
};
const registrControl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({ message: "Email in use" });
  }
  await registr(email, password);
  res.status(200).json({ email, password });
};
const loginControl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ _id: user.id }, "secret");
  await User.findByIdAndUpdate(user._id, { token })
  res.status(200).json({
    token: token,
    user: {
      email: email,
      subscription: "starter",
    },

    
  });

};
const logOut = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { token: null });
};
const currentUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  const { email } = user;
 
   res.status(200).json({
    email: `${email}`,
    subscription: "starter",
  });
};


const updateAvatar = async (req, res, next) => {

  const file = req.file;
 const { _id } = req.user;


  const avatarName = `${_id}_${file.filename}`;
  const filePath = path.join(avatarPath, avatarName);

  Jimp.read(file.path)
    .then( async(image) => {
      image.resize(256, 256);
      fsp.rename(file.path, filePath);
const avatarURL = path.join("avatars", avatarName);
await User.findByIdAndUpdate(_id, { avatarURL });
      res.status(200).send("Ok");
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({ message: "Not authorized" });
    });
}


 

module.exports = {
  registrControl,
  loginControl,
  logOut,
  currentUser,
  updateAvatar
  };
