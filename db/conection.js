// mongodb+srv://inokesha:<password>@cluster0.pn08li1.mongodb.net/?retryWrites=true&w=majority
const mongoose = require('mongoose');
const connectMongo = async()=>{
 mongoose.connect('mongodb+srv://inokesha:inokesha@cluster0.pn08li1.mongodb.net/db-contacts?retryWrites=true&w=majority');
}
module.exports = {connectMongo}