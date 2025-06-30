const router = require("express").Router();
const { NOT_FOUND, BAD_REQUEST } = require("../utils/errors");

const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", createItem);

router.get("/", (req, res, next) => {
  if (req.originalUrl.endsWith("/items/") && req.originalUrl !== "/items/") {
    return res.status(BAD_REQUEST).json({ message: "Invalid request" });
  }
  return getItems(req, res, next);
});

router.get("/", getItems);

router.get("/:itemId", getItemById);

router.put("/:itemId", updateItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
