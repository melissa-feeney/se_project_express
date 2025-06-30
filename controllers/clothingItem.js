const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log("Created item:", item);
      res.status(201).json(item);
    })
    .catch((err) => {
      console.error("POST /items error:", err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item data" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).json(items))
    .catch((e) => {
      res.status(BAD_REQUEST).json({ message: "Error from getItems" });
    });
};
const getItemById = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item id" });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      res.status(200).json(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).json(item))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError" || e.name === "CastError") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      res.status(BAD_REQUEST).json({ message: "Error from updateItem" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log("Deleting item:", itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).json())
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
      } else if (e.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      res
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
      } else if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      res.status(INTERNAL_SERVER_ERROR).json({ message: "An error has occurred on the server." });
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
      } else if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
