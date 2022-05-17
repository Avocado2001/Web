const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const jwt = require('jsonwebtoken');
const flash = require('express-flash');
const nodemailer = require('nodemailer');
//validator
const registerValidator = require('./validators/registerValidator');
const loginValidator = require('./validators/loginValidator');
const changePassValidator = require('./validators/changePassValidator');
const { render, redirect } = require('express/lib/response');
const generator = require('generate-password');
const { validationResult } = require('express-validator');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ewallet.webnc@gmail.com',
        pass: 'webnangcao'
    }
});
Router.get('/', loginValidator, (req, res) => {
    res.render('login', {
        error: '',
        username: '',
        password: ''
    });
});
Router.get('/register', registerValidator, (req, res) => {
    res.render('register', {
        error: '',
        email: '',
        phone: '',
        address: '',
        fullname: '',
        birthday: ''
    });
});
Router.post('/', loginValidator, (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let { username, password } = req.body;

        Account.findOne({ username }).then(account => {
            if (!account) {
                throw new Error('Username không tồn tại');
            }
            if (bcrypt.compareSync(password, account.password)) {
                return account;
            }
            return null;
        }).then(account => {
            if (!account) {
                return res.render('login', {
                    error: 'Sai mật khẩu',
                    password: '',
                    username
                })
            } else {
                req.session.account = account;
                if (account.isAdmin) {
                    return res.redirect('/admin');
                }
                return res.redirect('/user');
            }
        }).catch(err => {
            return res.render('login', {
                error: 'Lỗi đăng nhập',
                password: '',
                username
            });
        })
    } else {
        let messages = result.mapped();
        let message = '';
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        return res.render('login', {
            username: '',
            password: '',
            error: message
        });
    }
});
Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req);
    let {
        email,
        fullname,
        phone,
        address,
        birthday,
        password = generator.generate({
            // //Tự tạo mật khẩu
            length: 6,
            numbers: true
        }),
        // //Tạo username tự động(chưa so sánh username đã có hay chưa)
        username = generator.generate({
            length: 10,
            numbers: true,
            uppercase: false,
            exclude: 'abcdefghijklmnopqrstuvwxyz'
        })
    } = req.body;
    if (result.errors.length === 0) {

        Account.findOne({ email, phone }).then(account => {
                if (account) {
                    throw new Error('Email hoặc số điện thoại đã tồn tại');
                }
            })
            .then(() => bcrypt.hash(password, 10))
            .then(hashed => {
                let user = new Account({
                    email,
                    username,
                    phone,
                    password: hashed,
                    address,
                    fullname,
                    birthday
                });
                return user.save();
            }).then(() => {
                var mailOptions = {
                    from: 'ewallet.webnc@gmail.com',
                    to: email,
                    subject: 'E-Wallet',
                    text: 'Tài khoản của bạn đã được tạo \nUsername: ' + username + '\nPassword: ' + password
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.redirect('/');
                    }
                });
            }).catch(err => {
                res.render('register', {
                    email,
                    phone,
                    address,
                    fullname,
                    birthday,
                    error: err.message
                });
            })
    } else {
        let messages = result.mapped();
        let message = '';
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        res.render('register', {
            email,
            phone,
            address,
            fullname,
            birthday,
            error: message
        });
    }
});
//Đổi mật khẩu
Router.get('/changePassword', (req, res) => {

    res.render('changePassword', {
        error: '',
    });
});
Router.post('/changePassword', changePassValidator, (req, res) => {
    let { confirm1, confirm2 } = req.body;
    let result = validationResult(req);
    if (result.errors.length === 0) {
        if (req.session.account) {
            if (confirm1 === confirm2) {
                bcrypt.hash(confirm2, 10).then(hashed => {
                    Account.findByIdAndUpdate(req.session.account._id, {
                        password: hashed,
                        firsttime: false
                    }).then(() => {
                        req.session.account.firsttime = false;
                        if (req.session.account.isAdmin) {
                            return res.redirect('/admin');
                        }
                        return res.redirect('/user');
                    })
                }).catch(err => {
                    return res.render('changePassword', {
                        error: err.message
                    });
                })
            } else {
                return res.render('changePassword', {
                    error: 'Mật khẩu không khớp'
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
        res.render('register', {
            error: message
        });
    }

});

module.exports = Router;