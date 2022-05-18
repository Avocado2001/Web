const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const CheckLogin = require('../auth/CheckForAdmin');
const currencyFormatter = require('currency-formatter');
const changePassValidator = require('../routers/validators/changePassValidator');
const { validationResult } = require('express-validator');
const { render } = require('ejs');
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
    Account.find({ status: 2 }, function(err, users) {
        res.render('banning', {
            users
        });
    });
});
//danh sách bị khóa vô thời hạn
Router.get('/bannedForever', CheckLogin, (req, res) => {
    Account.find({ status: 3 }, function(err, users) {
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
Router.post('/changePasswordadmin', changePassValidator, (req, res) => {
    let user = req.session.account;
    let { confirm1, confirm2 } = req.body;
    let result = validationResult(req);
    if (result.errors.length === 0) {
        if (req.session.account) {
            if (confirm1 === confirm2) {
                bcrypt.hash(confirm2, 10).then(hashed => {
                    Account.findByIdAndUpdate(req.session.account._id, {
                        password: hashed,
                    }).then(() => {
                        return res.redirect('/admin/changePasswordadmin');
                    })
                }).catch(err => {
                    return res.render('changePasswordadmin', {
                        error: err.message
                    });
                })
            } else {
                return res.render('changePasswordadmin', {
                    error: 'Mật khẩu không khớp',
                    fullname: user.fullname
                });
            }
        } else {
            res.redirect('/');
        }
    } else {
        let messages = result.mapped();
        let message = '';
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        res.render('changePasswordadmin', {
            error: message,
            fullname: user.fullname

        });
    }

});
module.exports = Router;