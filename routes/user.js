const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
var bcrypt = require('bcryptjs');
// User register URL using HTTP post => /user/register
router.post('/registerUser', (req, res) => {
    let errors = [];

    // Retrieves fields from register page from request body
    let {name, email, password, password2} = req.body;

    // Checks if both passwords entered are the same
    if(password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }

    // Checks that password length is more than 4
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('user/registerUser', {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: {email: req.body.email} })
            .then(user => {
                if (user) {
                // If user is found, that means email has already been
                    // registered
                    res.render('user/registerUser', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2
                        });
                } else {
                    // Create new user record
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(password,salt,(err,hash) =>{
                            if(err) throw err;
                            password = hash;
                            User.create({ name, email, password })
                            .then(user => {
                                alertMessage(res, 'success', user.name + ' added.Please login', 'fas fa-sign-in-alt', true);
                                res.redirect('/showLoginUser');
                            })
                            .catch(err => console.log(err));
                        })
                    });
                }
            });
        }
    });

router.post('/registerStaff', (req, res) => {
    let errors = [];

    // Retrieves fields from register page from request body
    let {name, email, password, password2} = req.body;

    // Checks if both passwords entered are the same
    if(password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }

    // Checks that password length is more than 4
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if (errors.length > 0) {
        res.render('user/registerStaff', {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: {email: req.body.email} })
            .then(user => {
                if (user) {
                // If user is found, that means email has already been
                    // registered
                    res.render('user/registerStaff', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2
                        });
                } else {
                    // Create new user record
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(password,salt,(err,hash) =>{
                            if(err) throw err;
                            password = hash;
                            User.create({ name, email, password })
                            .then(user => {
                                alertMessage(res, 'success', user.name + ' added.Please login', 'fas fa-sign-in-alt', true);
                                res.redirect('/showLoginUser');
                            })
                            .catch(err => console.log(err));
                        })
                    });
                }
            });
        }
    });
    
// Login Form POST => /user/login
router.post('/loginUser', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/accountManagement', // Route to /video/listVideos URL
        failureRedirect: '/showLoginUser', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
        message given by the strategy's verify callback, if any. When a failure occur passport passes the message
        object as error */
    })(req, res, next);
});

router.post('/loginStaff', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/product/listProducts', // Route to /video/listVideos URL
        failureRedirect: '/showLoginStaff', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
        message given by the strategy's verify callback, if any. When a failure occur passport passes the message
        object as error */
    })(req, res, next);
});
module.exports = router;

router.post('/forgotPassword', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/loginUser', // Route to /video/listVideos URL // Route to /login URL
        failureRedirect: '/showLoginUser',
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
        message given by the strategy's verify callback, if any. When a failure occur passport passes the message
        object as error */
    })(req, res, next);
});

router.get('/accountManagement', (req, res, next) => {
    res.render('user/accountManagement')
})
