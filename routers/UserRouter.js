const express = require('express');
const Account = require('../models/AccountModel');
const CheckLogin = require('../auth/CheckForUser');
const FirstTime = require('../auth/CheckFirstTime');
const currencyFormatter = require('currency-formatter');
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
Router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = Router;