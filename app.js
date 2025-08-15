const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { INTERNAL_SERVER_ERROR } = require("./utils/errors");

const mainRouter = require("./routes/index");
// const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://localhost:3001",
//     changeOrigin: true,
//   })
// );

app.use("/", mainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
