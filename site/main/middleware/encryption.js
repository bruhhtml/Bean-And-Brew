const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashData(data) {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    } catch (error) {
        console.error('Error hashing data:', error);
        throw error;
    }
}

async function compareData(plainData, hashedData) {
    try {
        const match = await bcrypt.compare(plainData, hashedData);
        return match;
    } catch (error) {
        console.error('Error comparing data:', error);
        throw error;
    }
}

module.exports = {
    hashData,
    compareData
}