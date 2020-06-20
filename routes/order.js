const express = require('express');
const router = express.Router();
const moment = require('moment');






router.get('/cart', (req, res) => {
	res.render('order/cart')
});


router.get('/address', (req, res) => {
	res.render('order/address')
});

router.get('/payment', (req, res) => {
	res.render('order/payment')
});


router.get('/confirmation', (req, res) => {
	res.render('order/confirmation')
});

module.exports = router;