const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../models/order');
const Product = require('../models/Product');
const Payment = require('../models/payment');




router.get('/cart', (req, res) => {
	Order.findAll({
		where:{
			userId:req.user.id,
		},
		order: [['productTitle', 'ASC']],
		raw: true,
	}).then((orders)=>{
		res.render('order/cart',{orders})
	})
});

router.post('/cart/:id', (req, res) => {
	Product.findOne({
		where:{
			id:req.params.id
		}
	}).then((prod)=>{
		Order.create({
			productTitle:prod.productTitle,
			productImage:prod.productImage,
			price:prod.price,
			quantity:1,
			userId:req.user.id,
			totalPrice:prod.price
		})
	}).then(()=>{
		res.redirect('/order/cart')
	})	
});


router.post('/delete/:id', (req, res) => {
	Order.destroy({
		where:{
			id:req.params.id,
		},
	}).then(()=>{
		res.redirect('/order/cart')
	})
});


router.post('/address', (req, res) => {
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
	}).then((payment)=>{
		if(payment){
			Payment.update(
				{
					total: req.body.totalprice,
				},
				{
					where: {
						userId: req.user.id,
					},
				}
			)
		}
		else{
		Payment.create({
			userId:req.user.id,
			total:req.body.totalprice,
		})
	}
	res.render('order/address')
})
});

router.post('/payment', (req, res) => {
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
	}).then((payment)=>{
		console.log(payment.total)
		res.render('order/payment',{payment,total:payment.total})

	})
	
});


router.get('/confirmation', (req, res) => {
	res.render('order/confirmation')
});

module.exports = router;