const express = require('express');
const Delivery = require('../models/delivery');
const Order = require('../models/order');
const Addresses = require('../models/address');
const Deliveryman = require('../models/deliveryman');
const router = express.Router();
const Nexmo = require('nexmo');
const User = require('../models/User');

const nexmo = new Nexmo({
    apiKey: '599e1242',
    apiSecret: 'Cx6LjAjj0Kjeh0F4'
}, {debug: true});

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
		console.log(address.userId)
		Delivery.findOne({
			where:{
				userId: address.userId
			}
		}).then((delivery)=>{
			console.log(delivery)
			console.log(address)
			res.render('Delivery/OrderCheckStaff',{address,delivery})
		})
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
	}).then(() => {
		res.redirect('/Delivery/makedelivery');
		console.log(req.body)
    })
    .catch(err => console.log(err))
})

router.get('/createdeliveryman', (req, res) => {
	Deliveryman.findAll({
		order: [['fname', 'ASC']],
		raw: true,
	}).then((deliverymans)=>{
		res.render('Delivery/createdeliveryman',{deliverymans})
		console.log(deliverymans)
	})
});

router.get('/makedelivery',(req,res) => {
	console.log('ok')
	Deliveryman.findAll({
		order: [['fname', 'ASC']],
		raw: true, 
	}).then((deliverymans)=>{
		res.render('Delivery/makedelivery',{deliverymans})
		console.log(deliverymans)
	})
})


router.post('/senddelivery/:id',(req, res) =>{
	Addresses.findOne({
		where:{
			userId: req.params.id
		},
		raw: true
	}).then((address) => {
		//comment : variable that contains what is returned above
		Delivery.findOne({
			where:{
				userId: address.userId
			},
			raw: true
		}).then(async (delivery) =>{
			const number = await Deliveryman.findByPk(
				delivery.DeliverymanID
			)
			const phoneNumber = number.phone
			const text = `the inoformation is:${delivery.productTitle},${address.address}`
			nexmo.message.sendSms(
				'6588225004', phoneNumber, text, { type: 'unicode'},
				(err, responseData) => {
					if(err){
						console.log(err);
					}else{
						Delivery.update({
							status: 'Waiting'
					},{
							where: {
								userId : req.params.id
							}
							
						})
						console.log(delivery.status)
					}
				}
			)
			res.redirect()
		})
	})
})

router.put('/update/:id',async (req,res)=>{
	let delivery = await Delivery.findOne({
		where: {
			userId: req.params.id
		}
	})
	if (delivery.status =='Waiting' || delivery .status == 'Delivering' || delivery.status == 'Reached'){
		delivery.status = req.body.status
		await delivery.save()
		User.findOne({
			where:{
				id : req.params.id
			},
			raw: true
		}).then(async (user) =>{
			const users = await User.findByPk(
				user.id
			)
			const phoneNumber = users.ContactNo
			const text = `delivery status changed:${delivery.status}`
			nexmo.message.sendSms(
				'6588225004', phoneNumber, text, { type: 'unicode'},
				(err, responseData) => {
					if(err){
						console.log(err);
					}
				}
			)
		})
	}
})

//ordered, waiting, delivering, reached
module.exports = router;