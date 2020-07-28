const alertMessage = require('../helpers/messenger');
const express = require('express');
const router = express.Router();
const nodemailer=require('nodemailer');

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

router.get('/showLoginStaff', (req, res) => {
	res.render('user/loginStaff')
});

router.get('/showForgotPassword', (req, res) => {
	res.render('user/forgotPassword')
});
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
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'soundstore111@gmail.com',
	  pass: 'SoundStore182?'
	}
  });
  
  var mailOptions = {
	from: 'kangkhen182@gmail.com',
	to: 'ryantan182@hotmail.com',
	subject: 'Thanks for suscribing!',
	text: 'Thank you for subscribing to our Newsletter! We will keep you updated with all the latest news and discounts on Sound Store!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	  res.render('newsletter')
	}
  });
});

module.exports = router;
