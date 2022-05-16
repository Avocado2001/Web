const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    username: String,
    time: { type: Date, default: Date.now },
    money: { type: Number, default: 0 },
    numberCard: { type: Number, default: 0 },
    kind: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
});
module.exports = mongoose.model('Transaction', TransactionSchema);