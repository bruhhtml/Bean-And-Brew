const mongoose = require('../mongooseDB');

const customizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    options: [{
        optionName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }
    }]
}, { _id: false });

const productsSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    customizations: [customizationSchema]
}, { collection: 'products', versionKey: false });

const Product = mongoose.model('Product', productsSchema);

module.exports = Product;
