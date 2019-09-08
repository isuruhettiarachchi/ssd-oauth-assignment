const express = require('express');
const router = express.Router();

const googleUtil = require('../utils/google-util');

router.get('/', (req, res) => {
    res.render('index.html', {'title': 'Application Home'});
});

router.get('/login/google', (req, res) => {
    res.redirect(googleUtil.urlGoogle());
});

module.exports = router;