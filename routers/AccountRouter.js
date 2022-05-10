const express = require('express');
const Router = express.Router();
const Account = require('../models/AccountModel');
const registerValidator = require('./validators/registerValidator');
const loginValidator = require('./validators/loginValidator');
const { render } = require('express/lib/response');
Router.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Account'
    })
});
Router.get('/login', loginValidator, (req, res) => {

    res.render('login');
});
Router.get('/register', registerValidator, (req, res) => {
    res.render('register');
});
Router.get('/login', (req, res) => {});
Router.post('/register', (req, res) => {});
module.exports = Router;