const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "685ec4d45944ddc69ee3c3e9",
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
