const jwt = require("jsonwebtoken");

const autMid = (req, res, next) => {
  const [tokenType, token] = req.headers["authorization"].split(" ");
 
  if (!token) {
    next(res.status(400).json({ message: "No tokken" }));
  }
  try {
    const user = jwt.decode(token, "secret");
    req.token = token;
    req.user = user;

    next();
  } catch (err) {
    res.json({ message: "no Tokkens" });
  }
};

module.exports = { autMid };
