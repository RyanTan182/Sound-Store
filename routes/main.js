const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {title: title}) // renders views/index.handlebars
});



router.get('/showLogin', (req, res) => {
	
	res.render('user/login') // renders views/user.handlebars
});



router.get('/showRegister', (req, res) => {
	
	res.render('user/register') // renders views/register.handlebars
});

router.get('/about', (req, res) => {
	const author = 'Denzel Washington';
	alertMessage(res, 'success', 'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger','Unauthorised access', 'fas fa-exclamation-circle', false);
	let error = 'Error message using error object';
	let errors = [{text:'First error message'},
					{text:'Second error message'},
						{text:'Third error message'}];
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	res.render('about', {
	author: author,
	error:error,
	errors:errors,
	success_msg: success_msg,
	error_msg: error_msg
	})
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
router.get('/about', (req, res) => {
	const author = 'Denzel Washington';
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';
	res.render('about', {
	author: author,
	success_msg: success_msg,
	error_msg: error_msg
	})
	});
	

module.exports = router;

