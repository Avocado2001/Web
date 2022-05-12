const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const jwt = require('jsonwebtoken');
const registerValidator = require('./validators/registerValidator');
const loginValidator = require('./validators/loginValidator');
const { render } = require('express/lib/response');
var generator = require('generate-password');
const { validationResult } = require('express-validator');

Router.get('/', loginValidator, (req, res) => {
    res.render('login');
});
Router.get('/register', registerValidator, (req, res) => {
    res.render('register', {
        error: ''
    });
});
Router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let { email, password } = req.body;
        let acc = undefined;
        Account.findOne({ email: email }).then(account => {
            if (!account) {
                throw new Error('Email is not exist');
            }
            acc = account;
            return bcrypt.compare(password, account.password)
        }).then(match => {
            if (!match) {
                return res.status(401).json({
                    code: 3,
                    message: 'Login fail, password is incorrect'
                })
            }
            const { JWT_SECRET } = process.env;
            jwt.sign({
                email: acc.email,
                fullname: acc.fullname
            }, 'JWT_SECRET', {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) throw err;
                return res.json({
                    code: 0,
                    message: 'Login success',
                    token: token
                });
            })
        }).catch(err => {
            return res.status(401).json({
                code: 2,
                message: 'Login fail ' + err.message
            })
        })
    } else {
        let messages = result.mapped();
        let message = '';
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        return res.json({
            code: 1,
            message
        })
    }
});
Router.post('/register', registerValidator, (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        let {
            email,
            fullname,
            phone,
            address,
            birthday,
            // //Tạo username tự động(chưa so sánh username đã có hay chưa)
            username = generator.generate({
                length: 10,
                numbers: true,
                uppercase: false,
                exclude: 'abcdefghijklmnopqrstuvwxyz'
            })
        } = req.body;
        Account.findOne({ email, phone }).then(account => {
                if (account) {
                    throw new Error('Email hoặc số điện thoại đã tồn tại');
                }
            })
            .then(() => generator.generate({
                // //Tự tạo mật khẩu
                length: 6,
                numbers: true
            }))
            //.then(password => bcrypt.hash(password, 10))
            .then(password => {
                let user = new Account({
                    email,
                    username,
                    phone,
                    password,
                    address,
                    fullname,
                    birthday
                });
                return user.save();
            }).then(() => {
                return res.render('login');
            }).catch(err => {
                res.render('register', { error: err.message });
            })
    } else {
        let messages = result.mapped();
        let message = '';
        for (m in messages) {
            message = messages[m].msg;
            break;
        }
        res.render('register', { error: message });
    }
});
module.exports = Router;