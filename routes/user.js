const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Staff = require('../models/Staff');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const sgMail=require('@sendgrid/mail');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');

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
                    let token;
                        jwt.sign(email, 's3cr3Tk3y', (err, jwtoken) => {
                        if (err) console.log('Error generating Token: ' + err);
                        token = jwtoken;
                        });
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(password,salt,(err,hash) =>{
                            if(err) throw err;
                            password = hash;
                            User.create({ name, email, password,verified:0, })
                            .then(user => {
                                sendEmail(user.id, user.email, token) // Add this to call sendEmail function
                                .then(msg => { // Send email success
                                alertMessage(res, 'success', user.name + ' added. Please logon to ' +
                                user.email + ' to verify account.',
                                'fas fa-sign-in-alt', true);
                                res.redirect('/showLogin');
                                }).catch(err => { // Send email fail
                                alertMessage(res, 'warning', 'Error sending to ' + user.email,
                                'fas fa-sign-in-alt', true);
                                res.redirect('/');
                                });
                                }).catch(err => console.log(err));
                        })
                    });
                }
            });
        }
    });

function sendEmail(userId, email, token){
    sgMail.setApiKey(yeetus);

    const message = {
        to: email,
        from: 'Do Not Reply <admin@video-jotter.sg>',
        subject: 'Verify Video Jotter Account',
        text: 'Video Jotter Email Verification',
        html: `Thank you registering with Video Jotter.<br><br>
            Please <a href="http://localhost:5000/user/verify/${userId}/${token}">
                    <strong>verify</strong></a>your account.`
    };
    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(msg => resolve(msg))
    .catch(err => reject(err));
    });
    }

router.get('/verify/:userId/:token', (req, res, next) => {
    // retrieve from user using id
    User.findOne({
    where: {
    id: req.params.userId
    }
    }).then(user => {
    if (user) { // If user is found
    let userEmail = user.email; // Store email in temporary variable
    if (user.verified === true) { // Checks if user has been verified
    alertMessage(res, 'info', 'User already verified', 'fas faexclamation-circle', true);
    res.redirect('/showLogin');
    } else {
    // Verify JWT token sent via URL
    jwt.verify(req.params.token, 's3cr3Tk3y', (err, authData) => {
    if (err) {
    alertMessage(res, 'danger', 'Unauthorised Access', 'fas faexclamation-circle', true);
    res.redirect('/');
    } else {
    User.update({verified: 1}, {
    where: {id: user.id}
    }).then(user => {
    alertMessage(res, 'success', userEmail + ' verified.Please login', 'fas fa-sign-in-alt', true);
    res.redirect('/showLogin');
    });
    }
    });
    }
} else {
    alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamationcircle', true);
    res.redirect('/');
    }
    });
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
        Staff.findOne({ where: {email: req.body.email} })
            .then(staff => {
                if (staff) {
                // If user is found, that means email has already been
                    // registered
                    res.render('user/registerStaff', {
                        error: staff.email + ' already registered',
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
                            Staff.create({ name, email, password })
                            .then(staff => {
                                alertMessage(res, 'success', user.name + ' added.Please login', 'fas fa-sign-in-alt', true);
                                res.redirect('/showLoginStaff');
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
        successRedirect: '/user/displayUsers', // Route to /video/listVideos URL
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


router.get('/displayUsers', (req, res, next) => {
    User.findAll({
        where: {
            id: req.user.id
        },
        order: [
            ['email', 'ASC']
        ],
        raw: true
    })
    .then((users) => {
        res.render('user/displayUsers', {
            users: users,
        });
    })  
    .catch(err => console.log(err));
});

router.get('/listUsers', (req, res, next) => {
    User.findAll({
        where: {
            id: req.user.id
        },
        order: [
            ['email', 'ASC']
        ],
        raw: true
    })
    .then((users) => {
        res.render('user/listUsers', {
            users: users,
        });
    })  
    .catch(err => console.log(err));
});

router.get('/edit/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    }).then((users) => {
        res.render('user/editUser', {
            users
        });
    }).catch(err => console.log(err)); 
});

router.put('/saveEditedUser/:id', (req, res) => {
    // Retrieves edited values from req.body
    User.update({
        id:req.body.id,
        name:req.body.name
    }, {
    where: {
    id: req.params.id
    }
    }).then(() => {
    // After saving, redirect to router.get(/listVideos...) to retrieve all updated
    // videos
    res.redirect('/user/displayUsers');
    }).catch(err => console.log(err));
    });

router.get('/delete/:id', (req, res) => {
    User.findOne({
        where:{
            id:req.params.id,
        },
        attributes:['id']
    }).then((users) => {
        if(users != null){
            User.destroy({
                where:{
                    id:req.params.id
                }
            }).then(() => {
                alertMessage(res, 'info', 'User deleted', 'far fa-trash-alt', true);
                res.redirect('/user/listUsers');
            }).catch(err => console.log(err));
        }
    })
})