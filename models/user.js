const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { User } = require("../db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravar = require("gravatar");
const path = require("path");
const avatarPath = path.join(__dirname, "../publick/avatars");

const Jimp = require("jimp");
const fsp = require("fs/promises");

//
async function main(user) {
  const { email, verificationToken } = user;
  const transporter = nodemailer.createTransport({
    port: 3001,
    secure: false,
  });
  const info = await transporter.sendMail({
    from: "<dima.ibragimov.1996@ukr.net>",
    to: `${email}`,
    subject: "Verification Confirmation",

    html: `<a href='localhost:3001/users/verify/${verificationToken}'>Verification click</a>`, // html body
  });
}

//

const registr = async (email, password) => {
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    avatarURL: gravar.url(email),
    verificationToken: uuidv4(),
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

  main(user).catch(console.error);

  res.status(200).json({ email, password });
};
const loginControl = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.verify === false) {
    res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Email or password is wrong" });
  }
  const token = jwt.sign({ _id: user.id }, "secret");
  await User.findByIdAndUpdate(user._id, { token });
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
    .then(async (image) => {
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
};

const verification = async (req, res) => {
  const verificationToken = req.params.verificationToken;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    res(400).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.status(200).json({ message: "Verification successful" });
};

const reVerification = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }
  if (user.verify === true) {
    res.status(400).json({ message: "Verification has already been passed" });
  }
  main(user).catch(console.error);
  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  registrControl,
  loginControl,
  logOut,
  currentUser,
  updateAvatar,
  verification,
  reVerification,
};
