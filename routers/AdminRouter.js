const express = require('express');
const Router = express.Router();
Router.get('/admin', (req, res) => {
    res.render('admin');
});
module.exports = Router;
//chưa chạy đc nha