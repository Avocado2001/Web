const express = require('express');
const CheckLogin = require('../auth/CheckLogin');
const Router = express.Router();
Router.get('/', CheckLogin, (req, res) => {
    return res.render('admin');
});
module.exports = Router;