const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const sgMail=require('@sendgrid/mail');
const jwt=require('jsonwebtoken');
const request=require('request');
const bodyParser=require('body-parser');

const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// User register URL using HTTP post => /user/register
router.post('/registerUser', (req, res) => {
    let errors = [];

    // Retrieves fields from register page from request body
    let {name, email, password, password2,UserType,captcha} = req.body;

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
            UserType,
        });}
    /* if(req.body.captcha===undefined ||
            req.body.captcha===''||
            req.body.captcha===null
        ){
            return res.json({"success":false,"msg":"Please select captcha"})
        }

        else {
        //Secret Key
        const secretKey='6LeKxbAZAAAAAKLdlRMAGymVM29KdzSHgtbLSAG0';
        const verifyUrl='https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}'

        request(verifyUrl,(err,response,body)=>{
            body=JSON.parse(body);
            console.log(body);

            //If not successful
            if(body.success !== undefined && !body.success){
                return res.json({"success":false,"msg":"Failed captcha verification"});
            }
            //If success
            return res.json({"success":true,"msg":"Captcha passed"});
        }) */
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
                        password2,
                        UserType,
                        });
                } else {
                    // Create new user record
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(password,salt,(err,hash) =>{
                            if(err) throw err;
                            password = hash;
                            User.create({ name, email, password,UserType, })
                            .then(user => {
                                }).catch(err => console.log(err));
                        })
                    });
                }
            });
        }
      /* } */
    );

    
// Login Form POST => /user/login
router.post('/loginUser', (req, res, next) => {
    passport.authenticate('User', {
        successRedirect: '/user/displayUsers', // Route to /video/listVideos URL
        failureRedirect: '/showLoginUser', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
        message given by the strategy's verify callback, if any. When a failure occur passport passes the message
        object as error */
    })(req, res, next);
});


router.post('/forgotPassword', (req, res, next) => {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {
              user: '!!! YOUR SENDGRID USERNAME !!!',
              pass: '!!! YOUR SENDGRID PASSWORD !!!'
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
      });
    });

    app.post('/reset/:token', function(req, res) {
        async.waterfall([
          function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
              }
      
              user.password = req.body.password;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
      
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            });
          },
          function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
              service: 'SendGrid',
              auth: {
                user: '!!! YOUR SENDGRID USERNAME !!!',
                pass: '!!! YOUR SENDGRID PASSWORD !!!'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'passwordreset@demo.com',
              subject: 'Your password has been changed',
              text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              req.flash('success', 'Success! Your password has been changed.');
              done(err);
            });
          }
        ], function(err) {
          res.redirect('/');
        });
      });

      
router.get('/displayUsers', (req, res, next) => {
  if (req.user.UserType=='Admin'){
    res.redirect('displayUsers2')
  }
  else{
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
  }
});

router.get('/displayUsers2', (req, res, next) => {
  if (req.user.UserType=='Customer'){
    res.redirect('displayUsers')
  }
  else{
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
      res.render('user/displayUsers2', {
          users: users,
      });
  })  
  .catch(err => console.log(err));
  }
});

router.get('/listUsers', (req, res, next) => {
    User.findAll({
        where: {
            UserType:'Customer'
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
            id:req.params.id,
            name:users.name
        });
    }).catch(err => console.log(err)); 
});

router.post('/saveEditedUser/:id', (req, res) => {
    // Retrieves edited values from req.body
    User.update({
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

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/showLoginUser' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router ;