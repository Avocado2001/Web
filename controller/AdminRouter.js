const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const Transaction = require('../models/TransactionModel');
const CheckLogin = require('../auth/CheckForAdmin');
const currencyFormatter = require('currency-formatter');
const changePassValidator = require('../routers/validators/changePassValidator');
const { validationResult } = require('express-validator');
const { render } = require('ejs');
const TransactionModel = require('../models/TransactionModel');
let userList = new Map();
const Router = express.Router();
Router.get('/', CheckLogin, (req, res) => {
    Account.find({}, function(err, users) {
        res.render('admin', {
            users
        });
    });
});

//danh sách chờ xác minh
Router.get('/waitActive', CheckLogin, (req, res) => {
   
    Account.find({ status: 0 }, function(err, users) {
        res.render('waitActive', {
            users
        });
    });

});


// Xem thông tin chi tiết
Router.get('/detailuser/:id', CheckLogin, (req, res) => {
    Account.findById(req.params.id, function(err, user) {
        res.render('detailuser', {
            user
        });
    });
});
// Xác minh tài khoản
Router.post('/detailuser/:id', CheckLogin, (req, res) => {
    let { status } = req.body;
    status = parseInt(status);
    if (status === 1) {
        Account.findByIdAndUpdate(req.params.id, {
            status
        }).then(() => {
            return res.redirect('/admin/detailuser/' + req.params.id);
        });
    } else if (status === 0) {
        Account.findByIdAndUpdate(req.params.id, {
            status
        }).then(() => {
            return res.redirect('/admin/detailuser/' + req.params.id);
        });
    } else {
        Account.findByIdAndUpdate(req.params.id, {
            status
        }).then(() => {
            return res.redirect('/admin/detailuser/' + req.params.id);
        });
    }
});






//danh sách đã xác minh
Router.get('/actived', CheckLogin, (req, res) => {
    Account.find({ status: 1 }, function(err, users) {
        res.render('actived', {
            users
        });
    });
});


//danh sách bị vô hiệu hóa
Router.get('/banning', CheckLogin, (req, res) => {
    Account.find({ status: 3 }, function(err, users) {
        res.render('banning', {
            users
        });
    });
});
//danh sách bị khóa vô thời hạn
Router.get('/bannedForever', CheckLogin, (req, res) => {
    Account.find({ status: 4 }, function(err, users) {
        res.render('bannedForever', {
            users
        });
    });
});
//đổi mật khẩu
Router.get('/changePasswordadmin', CheckLogin, (req, res) => {
    let user = req.session.account;
    res.render('changePasswordadmin', { error: '', fullname: user.fullname });
});
Router.post("/changePasswordadmin", changePassValidator, (req, res) => {
    let user = req.session.account;
    let { oldpass, confirm1, confirm2 } = req.body;
    let result = validationResult(req);
    if (result.errors.length === 0) {
        if (req.session.account) {
            if (bcrypt.compareSync(oldpass, user.password)) {
                if (confirm1 === confirm2) {
                    bcrypt
                        .hash(confirm2, 10)
                        .then((hashed) => {
                            Account.findByIdAndUpdate(req.session.account._id, {
                                password: hashed,
                            }).then(() => {
                                return res.redirect("/admin/changePasswordadmin");
                            });
                        })
                        .catch((err) => {
                            return res.render("changePasswordadmin", {
                                error: err.message,
                            });
                        });
                } else {
                    return res.render("changePassworduser", {
                        error: "Mật khẩu không khớp",
                        fullname: user.fullname,
                    });
                }
            } else {
                return res.render("changePasswordadmin", {
                    error: "Mật khẩu cũ không đúng",
                    fullname: user.fullname,
                });
            }
        } else {
            res.redirect("/");
        }
    } else {
        let messages = result.mapped();
        let message = "";
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        res.render("changePasswordadmin", {
            error: message,
            fullname: user.fullname,
        });
    }
});
//Quản lý giao dịch
Router.get('/acceptTransaction', CheckLogin, (req, res) => {
    Transaction.find({status_transation:1 }, function(err, transaction) {
        res.render('acceptTransaction', {
            transaction
        });
    });
    
});


module.exports = Router;