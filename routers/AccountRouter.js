const express = require('express');
const Router = express.Router();

Router.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Account'
    })
})
Router.get('/login', (req, res) => {});
Router.post('/register', (req, res) => {});
module.exports = Router;