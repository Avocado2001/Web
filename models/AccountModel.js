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
    birthday: Date,
    //4 trạng thái: 0: chưa xác minh, 1: đã xác minh, 2: hủy, 3: yêu cầu bổ sung thông tin
    verification: { tipe: Number, default: 0 },
    //kiểm tra xem có phải là đăng nhập lần đầu không true là 1st false đã đổi mk  
    firsttime: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    account_balance: { type: Number, default: 0 }
});
module.exports = mongoose.model('Account', AccountSchema);