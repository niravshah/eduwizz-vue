var express = require('express');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/home', function (req, res) {
    res.render('index');
});

router.get('/reset-password', function (req, res) {
    res.render('reset-password');
});

module.exports = router;
