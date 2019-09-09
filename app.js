const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const session = require('express-session');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');

const app = express();

require('dotenv').config()

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(express.static('public'))

app.use(
    session({
      name: 'sid',
      saveUninitialized: false,
      resave: false,
      secret: 'sssh, quiet! it\'s a secret!',
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
      }
    })
  )
  

app.use(passport.initialize());
app.use(passport.session());

app.get('/idnex', (req, res) => {
    res.send('App works');
});

app.use('', loginRouter);

module.exports = app;
