const express = require('express');
const bcrypt = require('bcrypt');
const Account = require('../models/AccountModel');
const CheckLogin = require('../auth/CheckForAdmin');
const currencyFormatter = require('currency-formatter');
const changePassValidator = require('./validators/changePassValidator');
const { validationResult } = require('express-validator');
const Router = express.Router();
Router.get('/', CheckLogin, (req, res) => {
    return res.render('admin');
});












Router.get('/changePasswordadmin', CheckLogin, (req, res) => {
    let user = req.session.account;
    res.render('changePasswordadmin', {error: '',fullname: user.fullname});
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