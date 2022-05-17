const express = require('express');
const CheckLogin = require('../auth/CheckForUser');
const FirstTime = require('../auth/CheckFirstTime');
const Router = express.Router();

Router.get('/', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('user', {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        birthday: user.birthday
    });
});
Router.get('/profile', CheckLogin, FirstTime, (req, res) => {
    let user = req.session.account;
    res.render('profile', {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        birthday: user.birthday,
        account_balance: user.account_balance,
        status: user.status
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