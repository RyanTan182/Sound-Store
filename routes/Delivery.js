const express = require('express');
const Delivery = require('../models/delivery');
const Order = require('../models/order');
const router = express.Router();

router.get('/listDelivery', (req, res) => {
    res.render('Delivery/listDelivery')
})

router.get('/editDelivery', (req, res) => {
	res.render('Delivery/editDelivery')
});


router.get('/listdeliveryforuser', (req, res) => {
	res.render('Delivery/listdeliveryforuser')
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

router.post('/listDelivery',(req, res) =>{
	Order.findOne({
		where:{
			id:req.params.id
		}
	}).then((order)=>{
		Delivery.create({
			productTitle:order.productTitle,
			productImage:order.productImage,
			price:order.price,
			quantity:1,
			userId:req.user.id,
			totalPrice:order.price
		})
	})
	let fname = req.body.fname;
	let	lname = req.body.lname;
	let	email = req.body.email;
	let	address = req.body.address;
	let	country = req.body.country;
	let	postalcode = req.body.postalcode;
	let	phonenum = req.body.phonenum;
	let userId = req.user.id;
	console.log(fname)
	Delivery.create({
		fname,
		lname,
		email,
		address,
		country,
		postalcode,
		phonenum, 
		userId,
	})
});

router.get('/Check/:id', (req, res) => {
    Delivery.findOne({
        where: {
            userId: req.params.id
        }
    }).then((delivery) => {
        console.log(req.params.id)
        
        res.render('Delivery/OrderCheckStaff', {
            delivery
        });
    })
});

module.exports = router;