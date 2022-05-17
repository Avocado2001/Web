const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
    username: String,
    time: { type: Date, default: Date.now },
    money: { type: Number, default: 0 },
    numberCard: { type: Number, default: 0 },
    //chuyển tiền: 0, nạp tiền: 1, rút tiền: 2, mua thẻ: 3
    kind: { type: Number, default: 0 },
    //0:duyệt, 1:chờ duyệt, 2:từ chối
    status: { type: Number, default: 0 },
});
module.exports = mongoose.model('Transaction', TransactionSchema);