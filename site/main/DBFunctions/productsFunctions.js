const Product = require('../DBSchemas/productsSchema');
const mongoose = require('../mongooseDB');

const createProduct = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const options = { session };

        const newProduct = new Product(data);
        await newProduct.save(options);

        await session.commitTransaction();
        session.endSession();

        return newProduct;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error(err.message);
        throw err;
    }
};

const getAllProducts = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const products = await Product.find();
        await session.commitTransaction();
        session.endSession();

        console.log(products)

        return products;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err.message);
        throw err;
    }
};

module.exports = {
    createProduct,
    getAllProducts
};