const express = require('express');
const nunjucks = require('nunjucks');

const homeRouter = require('./routes/home');

const app = express();

require('dotenv').config()

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(express.static('public'))

app.get('/idnex', (req, res) => {
    res.send('App works');
});

app.use('', homeRouter);

module.exports = app;
