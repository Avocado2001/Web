const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const today = new Date();
const TransactionSchema = new Schema({
    username: String,
    time: { type: String, default:today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+' '
    +today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()},
    money: { type: Number, default: 0 },
 
    //nạp tiền: 0, chuyển tiền: 1, rút tiền: 2, mua thẻ: 3
    kind: { type: Number, default: 0 },
    //0:duyệt, 1:chờ duyệt, 2:từ chối
    status_transation: { type: Number, default: 0 },
    note:String,
});
module.exports = mongoose.model('Transaction', TransactionSchema);