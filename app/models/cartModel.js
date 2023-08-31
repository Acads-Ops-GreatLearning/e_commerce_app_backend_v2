const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  price:{
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0
  },
  units: {
    type: Number,
    required: true,
    default: 1
  },
});

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  orderTotalPrice: {
    type: Number,
    required: true,
  },
  products: {
    type: Object,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  createdTs: {
    type: Date,
    default: new Date(),
  },
  updatedTs: {
    type: Date,
    default: new Date(),
  },
});

const CartModel = mongoose.model("CartModel", cartSchema);

module.exports = CartModel;
