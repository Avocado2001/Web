const express = require('express');
const CheckLogin = require('../auth/CheckLogin');
const Router = express.Router();
Router.get('/', (req, res) => {
    res.render('user');
});
Router.get('/profile', (req, res) => {
    res.render('profile');
});
Router.get('/addMoney', (req, res) => {
    res.render('addMoney');
});
Router.get('/withdrawMoney', (req, res) => {
    res.render('withdrawMoney');
});
Router.get('/transferMoney', (req, res) => {
    res.render('transferMoney');
});
Router.get('/buyCard', (req, res) => {
    res.render('buyCard');
});
Router.get('/history', (req, res) => {
    res.render('history');
});
module.exports = Router;