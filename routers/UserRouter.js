const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const CheckLogin = require('../auth/CheckForUser');
const FirstTime = require('../auth/CheckFirstTime');
const currencyFormatter = require('currency-formatter');
const changePassValidator = require('./validators/changePassValidator');
const { validationResult } = require('express-validator');
const Router = express.Router();

Router.get('/', CheckLogin, FirstTime, (req, res) => {
    let id = req.session.account._id;
    Account.findById(id, (err, data) => {
        return res.render('user', {
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            address: data.address,
            birthday: data.birthday,
            account_balance: currencyFormatter.format(data.account_balance, {
                symbol: 'đ',
                thousand: ',',
                precision: 1,
                format: '%v %s'
            }),
            status: data.status
        });
    });
});
Router.get('/addMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('addMoney', { fullname: user.fullname });
});
Router.post('/addMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    let { numberCard, dateExp, cvv } = req.body;
});
Router.get('/withdrawMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('withdrawMoney', { fullname: user.fullname });
});
Router.get('/transferMoney', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('transferMoney', { fullname: user.fullname });
});
Router.get('/buyCard', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('buyCard', { fullname: user.fullname });
});
Router.get('/history', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('history', { fullname: user.fullname });
});


Router.get('/changePassworduser', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('changePassworduser', {error: '',fullname: user.fullname});
});


Router.post('/changePassworduser', changePassValidator, (req, res) => {
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
                        return res.redirect('/user/changePassworduser');
                    })
                }).catch(err => {
                    return res.render('changePassworduser', {
                        error: err.message
                    });
                })
            } else {
                return res.render('changePassworduser', {
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
        res.render('changePassworduser', {
            error: message,
            fullname: user.fullname

        });
    }

});





















Router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});




module.exports = Router;