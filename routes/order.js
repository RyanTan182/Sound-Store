const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../models/order');
const Product = require('../models/Product');
const Payment = require('../models/payment');
const Addresses = require('../models/address');



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

router.get('/update/:id', (req, res) => {
    Order.findOne({
        where: {
            userId: req.params.id
        }
    }).then((order) => {
        console.log(req.params.id)
        
        res.render('order/editquantity', {
            order
        });
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

router.get('/address', (req, res) => {
	res.render('order/address')
})

router.post('/address', (req, res) => {
	let fname = req.body.fname;
	let	lname = req.body.lname;
	let	email = req.body.email;
	let	address = req.body.address;
	let	country = req.body.country;
	let	postalcode = req.body.postalcode;
	let	phonenum = req.body.phonenum;
	let userId = req.user.id;
	console.log(fname)
	Addresses.create({
		fname,
		lname,
		email,
		address,
		country,
		postalcode,
		phonenum, 
		userId,
	}).then((Addresses)=>{
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
	})
	}).then((payment)=>{
		if(!payment){
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
	res.redirect('/order/payment')
})
});

router.get('/payment', (req, res) => {
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
	}).then((payment)=>{
		
		res.render('order/payment',{payment,total:payment.total})

	})
	
});


router.post('/confirmation', (req, res) => {
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
	}).then((payment)=>{
		
		res.render('order/confirmation',{payment,total:payment.total})

	})
	
});

module.exports = router;