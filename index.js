require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const AccountRouter = require('./routers/AccountRouter');
const AdminRouter = require('./routers/AdminRouter');
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Welcome to API'
    })
});
app.use(express.static(__dirname + '/public'));
app.use('/account', AccountRouter);
// app.use('/admin', AdminRouter); chưa chạy đc



//connect moongose and server
const port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost/vidientu', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => console.log('http://localhost:' + port));
}).catch(err => console.log('Connect fail: ' + err.message));