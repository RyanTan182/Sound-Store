const alertMessage = require('../helpers/messenger');
const express = require('express');
const router = express.Router();
const nodemailer=require('nodemailer');
const User = require('../models/User');

router.get('/', (req, res) => {
	const title = 'SoundStore';
	res.render('index', {title: title}) // renders views/index.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/about', (req, res) => {
	const author = 'Uwais';
	
	res.render('about', {
		author: author,
	})
});
	

// Login
router.get('/showLoginUser', (req, res) => {
	res.render('user/loginUser')
});

router.get('/showForgotPassword', (req, res) => {
	res.render('user/forgotPassword')
});

// router.get('/showSecurityQn', (req, res) => {
// });
// Register
router.get('/showRegisterUser', (req, res) => {
	res.render('user/registerUser')
});

//User Management
router.get('/showAccountManage', (req, res) => {
	res.render('user/accountManagement')
});

router.get('/displayUsers', (req, res) => {
	res.render('user/displayUsers')
});

router.get('/ListUsers', (req, res) => {
	res.render('user/ListUsers')
});

router.get('/googleForm', (req, res) => {
	res.render('user/googleForm')
});

router.get('/newPassword', (req, res) => {
	res.render('user/newPassword')
});
// About
router.get('/about', (req, res) => {
	const author = 'Geralt'
	res.render('about', {author:author}) // renders views/about.handlebars
});


//newsletter
router.get('/newsletter', (req, res) => {
	res.render('newsletter')
});

router.post('/newsletter', (req, res) => {
	console.log(req.body.email)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'soundstore111@gmail.com',
	  pass: 'SoundStore182?'
	}
  });
  
  var mailOptions = {
	from: 'soundstore111@gmail.com',
	to: req.body.email,
	subject: 'Thanks for suscribing!',
	html:"<h1>Thank you for subscribing!</h1><p>You will now receive updates and promotions on Sound Store!</p>"
  };
  
  transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	  alertMessage(res,'success',' Success!'+' Email sent!', 'fas fa-sign-in-alt', true);
	  res.render('newsletter')
	}
  });
});

module.exports = router;
