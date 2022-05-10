require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const AccountRouter = require('./routers/AccountRouter');
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        code: 0,
        message: 'Welcome to API'
    })
});
app.use('/account', AccountRouter);

//connect moongose and server
const port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost/vidientu', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, () => console.log('http://localhost:' + port));
}).catch(err => console.log('Connect fail: ' + err.message));