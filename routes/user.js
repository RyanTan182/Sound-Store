const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
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
    let {name, email, password, password2,ContactNo,UserType,SecurityQn,SecurityAnswer} = req.body;

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
            ContactNo,
            SecurityQn,
            SecurityAnswer,
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
                        ContactNo,
                        SecurityQn,
                        SecurityAnswer,
                        });
                } else {
                    // Create new user record
                    bcrypt.genSalt(10,(err,salt) =>{
                        bcrypt.hash(password,salt,(err,hash) =>{
                            bcrypt.hash(SecurityAnswer, 10, function(err, hash){
                            if(err) throw err;
                            password = hash;
                            SecurityAnswer=hash;
                            User.create({ name, email, password,UserType,ContactNo,SecurityQn,SecurityAnswer })
                            .then(user => {
                                }).catch(err => console.log(err));
                        })
                    });
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

router.post('/forgotPassword', (req, res) => {
  // Find user with email in input
  User.findOne({ where: {email: req.body.email} })
  .then(user => {
  if (user) {
    res.render('user/securityQn',{SecurityQn: user.SecurityQn, email:req.body.email})
  } else {
  // If user is found, that means email has already been
   // registered
   res.render('user/forgotPassword', {
    error:'No account registered on our end! Please create a new account!',
    });
  }
  });
  }
  );

router.post('/securityQn', (req, res) => {
    let errors = []
    // Retrieves fields from register page from request body
    let {SecurityAnswer,email} = req.body;
    // If all is well, checks if user is already registered
    User.findOne({
        order: [
            ['SecurityQn', 'ASC']
        ],
        raw: true,
        where: {
            email:email
        }
    }).then((user)=>{
        User.findOne({ where: {SecurityAnswer:SecurityAnswer} })
        console.log(req.body.SecurityAnswer,user.SecurityAnswer);
        bcrypt.compare(SecurityAnswer,user.SecurityAnswer,function(err, isMatch) {
            if(err) throw err;
            if (isMatch) {
            res.redirect('newPassword');
        } else {
        // If user is found, that means email has already been
            // registered
            User.findOne({ where: {email: req.body.email} })
            .then((user)=>{
                res.render('user/securityQn', {SecurityQn: user.SecurityQn, email:req.body.email,error:'Answer incorrect!'});
            });
        }
    });
    })
});

router.get('/newPassword', (req, res) => {
    let errors = [];
    let {email,password,password2}=req.body
    /* if(password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }
    // Checks that password length is more than 4
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    } */
    {
        res.render('user/newPassword', {
          email:req.body.email,
          password:req.body.password
        })};
});

router.post('/savePassword', (req, res) => {
    // Create new user record
    let{password,email}=req.body
        bcrypt.hash(password,10,function(err,hash) {
            if(err) throw err;
            password = hash;
            User.update({
                password
            }, 
            {
            where: {
            email:req.body.email
            }
            })
            .then(user => {
              res.redirect('/');
                }).catch(err => console.log(err));
                console.log(password)
        
    });
})
      
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
            name:users.name,
            email:users.email,
            password:users.password,
            ContactNo:users.ContactNo,
            SecurityQn:users.SecurityQn,
            SecurityAnswer:users.SecurityAnswer,
        });
    }).catch(err => console.log(err)); 
});

router.post('/saveEditedUser/:id', (req, res) => {
    let {password,SecurityAnswer} = req.body;
        bcrypt.hash(password, 10, function(err, hash) {
            bcrypt.hash(SecurityAnswer, 10, function(err, hash){
            if(err) throw err;
            password = hash;
            SecurityAnswer = hash;
    // Retrieves edited values from req.body
    User.update({
        name:req.body.name,
        email:req.body.email,
        ContactNo:req.body.ContactNo,
        SecurityQn:req.body.SecurityQn,
        SecurityAnswer:SecurityAnswer,
        password
    }, 
    {
    where: {
    id: req.params.id
    }
    }).then(() => {
    // After saving, redirect to router.get(/listVideos...) to retrieve all updated
    // videos
    console.log(password)
    res.redirect('/user/displayUsers');
    }).catch(err => console.log(err));
});
});
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

router.get(
    '/google',
    passport.authenticate('google',{
        scope:['profile','email'],
    })
);

router.get('/google/redirect',
passport.authenticate('google',{failureRedirect:'/loginUser'}),
(req,res)=>{
    User.findOne({where: {email:req.user.email}}).then((user)=>{
        if(user.SecurityQn=='' && user.SecurityAnswer==''){
            res.redirect('/googleForm')
        }
        else{
            res.redirect('/')
        }
    })
})

router.get('/googleForm', (req, res) => {
    let errors = [];
    let {password,password2,SecurityQn,SecurityAnswer}=req.body
    /* if(password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }
    // Checks that password length is more than 4
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    } */
    {
        res.render('user/newPassword', {
        email:users.email,
        password:req.body.password,
        ContactNo:req.body.ContactNo,
        SecurityQn:req.body.SecurityQn,
        SecurityAnswer:req.body.SecurityAnswer
        })};
});

router.post('/saveDetails', (req, res) => {
    // Create new user record
    let{password,SecurityQn,SecurityAnswer,ContactNo}=req.body
        bcrypt.hash(password,10,function(err,hash) {
            bcrypt.hash(SecurityAnswer, 10, function(err, hash){
            if(err) throw err;
            password = hash;
            SecurityAnswer=hash;
            User.update({
                password,
                ContactNo,
                SecurityQn,
                SecurityAnswer
            }, 
            {
            where: {
            email:req.body.email
            }
            })
            .then(user => {
              res.redirect('/');
                }).catch(err => console.log(err));
                console.log(password)
        
    });
})
})

module.exports = router ;