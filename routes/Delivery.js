const express = require('express');
const Delivery = require('../models/delivery');
const Order = require('../models/order');
const Addresses = require('../models/address');
const Deliveryman = require('../models/deliveryman');
const router = express.Router();

router.get('/listDelivery', (req, res) => {
	Delivery.findAll({
		order: [['productTitle', 'ASC']],
		raw: true,
	}).then((deliveries)=>{
		res.render('Delivery/listDelivery',{deliveries})
	})
});

router.get('/editDelivery', (req, res) => {
	res.render('Delivery/editDelivery')
});


router.get('/listdeliveryforuser', (req, res) => {
	Delivery.findAll({
		where:{
			userId:req.user.id,
		},
		order: [['productTitle', 'ASC']],
		raw: true,
	}).then((deliveries)=>{
		res.render('Delivery/listDelivery',{deliveries})
	})
});

router.get('/makedelivery', (req, res) => {
	res.render('Delivery/makedelivery')
});


router.get('/OrderCheckStaff', (req, res) => {
	res.render('Delivery/OrderCheckStaff')
});

router.get('/OrderCheckUser', (req, res) => {
	res.render('Delivery/OrderCheckUse')
});

router.post('/OrderCheckStaff/:id',(req, res) =>{
	Addresses.findOne({
		where:{
			userId: req.params.id
		}
	}).then((address) => {
		//comment : variable that contains what is returned above
		res.render('Delivery/OrderCheckStaff',{address})
	})
});


router.post('/createdeliveryman', (req,res) =>{
	let fname = req.body.fname;
	let	lname = req.body.lname;
	let phone = req.body.phone;
	
	Deliveryman.create({
		fname,
		lname,
		phone,
	}).then(deliveries => {
        res.redirect('/Delivery/makedelivery');
    })
    .catch(err => console.log(err))
})

router.get('/createdeliveryman', (req, res) => {
	Deliveryman.findAll({
		order: [['fname', 'ASC']],
		raw: true,
	}).then((deliverymans)=>{
		res.render('Delivery/createdeliveryman',{deliverymans})
	})
});

module.exports = router;