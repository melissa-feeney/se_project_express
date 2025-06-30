const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");
const clothingItem = require("./clothingItem");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
