const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/autorization");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  console.log(err)
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });
  
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
app.listen(3001, () => {
  console.log("server is asing");
});
module.exports = app;
