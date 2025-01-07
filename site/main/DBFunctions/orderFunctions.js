const Orders = require('../DBSchemas/ordersSchema');
const mongoose = require('../mongooseDB');

const getOrdersByUserId = async (userId) => {
    try {
        const orders = await Orders.find({ user: userId }).exec();
        
        return orders;  // Return the orders found
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Error fetching orders');  // Handle any errors
    }
};

const createOrder = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const options = { session };
        const newOrder = new Orders(data);
        await newOrder.save(options);

        await session.commitTransaction();
        session.endSession();

        return newOrder;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating order:', err);
        throw err;
    }
};

module.exports = {

    createOrder,
    getOrdersByUserId

};
