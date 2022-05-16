const express = require('express');
const CheckLogin = require('../auth/CheckForAdmin');
const Router = express.Router();
Router.get('/', CheckLogin, (req, res) => {
    return res.render('admin');
});
module.exports = Router;