const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const today = new Date();
const TransactionSchema = new Schema({
    username: String,
    time: { type: Date, default: today.toLocaleString('ICT', {timeZone: 'Asia/ho_chi_minh'})},
    money: { type: Number, default: 0 },
 
    //chuyển tiền: 0, nạp tiền: 1, rút tiền: 2, mua thẻ: 3
    kind: { type: Number, default: 0 },
    //0:duyệt, 1:chờ duyệt, 2:từ chối
    status_transation: { type: Number, default: 0 },
    note:String,
});
module.exports = mongoose.model('Transaction', TransactionSchema);