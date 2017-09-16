var express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Better Fundraising for Individuals'
    });
});

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/home', function (req, res) {
    res.render('home');
});

router.get('/reset-password', function (req, res) {
    res.render('reset-password');
});

module.exports = router;
