const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: String,
    phone: {
        type: Number,
        unique: true
    },
    password: String,
    address: String,
    fullname: String,
    birthday: Date
});
module.exports = mongoose.model('Account', AccountSchema);