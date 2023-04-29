const express = require("express");
const Joi = require("joi");

const path = require("path");
const multer = require("multer");

const storageAvatar = path.join(__dirname, "../../tmp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageAvatar);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();
const { validateEmail } = require("./middlewares/validateBody");

const { autMid } = require("./middlewares/autorizeMidlewears");

const {
  registrControl,
  loginControl,
  logOut,
  currentUser,
  updateAvatar,
  verification,
  reVerification,
} = require("../../models/user");

const reqistration = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});
const login = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});

router.post("/register", validateEmail(reqistration), async (req, res) => {
  await registrControl(req, res);
});
router.post("/login", validateEmail(login), async (req, res) => {
  await loginControl(req, res);
});
router.use(autMid);

router.post("/logout", async (req, res) => {
  await logOut(req, res);
  res.status(204).json("Bearer {{token}}");
});
router.get("/current", async (req, res) => {
  await currentUser(req, res);
  res.status(204).json("Bearer {{token}}");
});

router.patch("/avatar", upload.single("myAvatar"), async (req, res) => {
  await updateAvatar(req, res);
});
router.get("/verify/:verificationToken", async (req, res) => {
  await verification(req, res);
});

router.post("/verify/:verificationToken", async (req, res) => {
  await reVerification(req, res);
});
module.exports = router;

//"/verify/:verificationToken"
