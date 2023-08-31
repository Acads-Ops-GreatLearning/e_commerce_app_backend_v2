const mongoose = require('mongoose');
const { default: categoryModel } = require('./categoryModel');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantityInStock: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        categoryId:{
            type: mongoose.Schema.Types.ObjectId,
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
        }
    }
);

const ProductModel = mongoose.model('ProductModel', productSchema);

module.exports = ProductModel;