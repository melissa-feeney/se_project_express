const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);

const userRouter = require("./users");

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
