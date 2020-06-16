const express = require('express');
const router = express.Router();
const moment = require('moment');






router.get('/cart', (req, res) => {
	res.render('order/cart')
});




module.exports = router;