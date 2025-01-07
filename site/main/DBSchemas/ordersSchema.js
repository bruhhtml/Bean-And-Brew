const mongoose = require('../mongooseDB');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
        default: null
    },
    firstName: {
        type: String,
        required: false,
        default: null,
    },
    lastName: {
        type: String,
        required: false,
        default: null,
    },
    email: {
        type: String,
        required: true,
        default: null,
    },
    phone: {

        type: Number,
        required: false,
        default: null,

    },
    basket: {

        type: Object,
        required: true,

    }
}, { collection: 'orders', versionKey: false });

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;