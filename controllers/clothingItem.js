const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log("Created item:", item);
      return res.status(201).json(item);
    })
    .catch((err) => {
      console.error("POST /items error:", err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Error from createItem" });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      console.error("GET /items error:", err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Error from getItems" });
    });

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .json({ message: "You can only delete your own items" });
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).json({ message: "Item successfully deleted" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Error from deleteItem" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
