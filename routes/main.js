const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');

// Home pg
router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {title: title}) // renders views/index.handlebars
});

// Login pg
router.get('/showLogin', (req, res) => {
	res.render('user/login') // renders views/user.handlebars
});


// Register pg
router.get('/showRegister', (req, res) => {
	res.render('user/register') // renders views/register.handlebars
});

// About page
router.get('/about', (req, res) => {
	const author = 'Denzel Washington';
	alertMessage(res, 'success', 'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger', 'Unauthorised access to video', 'fas fa-exclamation-circle', false);
	let error = 'Error message using error object';
	let errors = [{text:'First error message'},
				   {text:'Second error message'},
				    {text:'Third error message'}];
	let success_msg = 'Success message!';
	let error_msg = 'Error message using error_msg';
	
	res.render('about', {
		author: author,
		error: error,
		errors,
		success_msg:success_msg,
		error_msg:error_msg
	})
});

// About
router.get('/about', (req, res) => {
	const author = 'Geralt'
	res.render('about', {author:author}) // renders views/about.handlebars
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


module.exports = router;

