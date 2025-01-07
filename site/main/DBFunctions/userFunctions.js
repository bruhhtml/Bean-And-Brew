const User = require('../DBSchemas/userSchema');
const mongoose = require('../mongooseDB');
const bcrypt = require('bcrypt');

const getUserByEmail = async (email) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findOne({ email }).session(session);

        if (!user) {
            throw new Error('User not found');
        }

        await session.commitTransaction();
        session.endSession();
        return user;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error fetching user by email:', error);
        return error;
    }
}

const createUser = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const options = { session };
        const newUser = new User(data);
        await newUser.save(options);

        await session.commitTransaction();
        session.endSession();

        return newUser;
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating user:', err);
        throw err;
    }
};

const updateUserById = async (id, data) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        return updatedUser;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

module.exports = {
    createUser,
    getUserByEmail,
    updateUserById
};
