// mongodb+srv://inokesha:<password>@cluster0.pn08li1.mongodb.net/?retryWrites=true&w=majority
require('dotenv').config()
const mongoose = require("mongoose");
const connectMongo = async () => {
  mongoose.connect(
    process.env.MoongoServer
 
  );
};
module.exports = { connectMongo };
