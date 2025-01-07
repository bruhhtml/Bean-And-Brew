const mongoose = require('../mongooseDB');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    dob: {
        type: Date,
        required: false,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {

        type: Number,
        required: false,
        default: null,

    },
}, { collection: 'users', versionKey: false });

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
