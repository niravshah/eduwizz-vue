const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (passport) {

    router.post('/api/auth/login', passport.authenticate('local', {
        failWithError: true
    }), function (req, res, next) {
        var token = jwt.sign({email: req.user.email, sid: req.user.sid}, 'shhhhh');
        res.status(200).json({'message': 'ok', 'email': req.user.email, 'sid': req.user.sid, 'token': token});
    }, function (err, req, res, next) {
        res.status(403).json({'message': err, 'id': 1});
    });

    router.post('/api/auth/reset-password', passport.authenticate('jwt', {
        failWithError: true
    }), function (req, res, next) {

        if (req.body.password === req.body.repeatPassword) {
            User.findOneAndUpdate({sid: req.user.sid, isResetPassword: true}, {
                password: bcrypt.hashSync(req.body.password, saltRounds),
                isResetPassword: false
            }, {new: true}, function (err, user) {
                if (err) {
                    res.status(403).json({'message': 'Error executing password reset.'});
                } else if (user) {
                    req.user = user;
                    var token = jwt.sign({email: req.user.email, sid: req.user.sid}, 'shhhhh');
                    res.status(200).json({
                        'message': 'ok',
                        'email': req.user.email,
                        'sid': req.user.sid,
                        'token': token
                    });
                } else {
                    res.status(403).json({'message': 'Error executing password reset.'});
                }
            });
        } else {
            res.status(403).json({'message': 'Could not reset password. Repeat Password does not match'});
        }

    }, function (err, req, res, next) {
        res.status(403).json({'message': err, 'id': 1});
    });


    router.post('/api/auth/first-login', passport.authenticate('local', {
            failWithError: true
        }), function (req, res, next) {

            if (req.user.mobileCode == req.body.mobileCode
            ) {

                User.findOneAndUpdate({sid: req.user.sid}, {
                    isEmailVerified: true,
                    isMobileVerified: true,
                    firstLogin: false
                }, {new: true}, function (err, user) {

                    if (err) {
                        res.status(403).json({'message': 'Error executing first login updates.'});
                    } else {
                        req.user = user;
                        var token = jwt.sign({email: req.user.email, sid: req.user.sid}, 'shhhhh');
                        res.status(200).json({
                            'message': 'ok',
                            'email': req.user.email,
                            'sid': req.user.sid,
                            'token': token
                        });
                    }
                });
            }
            else {
                res.status(403).json({'message': 'Could not verify mobile code'});
            }
        },
        function (err, req, res, next) {
            res.status(403).json({'message': err, 'id': 1});
        });
    
    return router;
};
