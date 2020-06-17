const alertMessage = require('../helpers/messenger');
const express = require('express');
const router = express.Router();


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

// Register
router.get('/showRegister', (req, res) => {
	res.render('user/register')
});

// About
router.get('/about', (req, res) => {
	const author = 'Geralt'
	res.render('about', {author:author}) // renders views/about.handlebars
});

module.exports = router;
