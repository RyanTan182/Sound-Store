const express = require('express');
const Delivery = require('../models/delivery');
const Order = require('../models/order');
const Addresses = require('../models/address');
const Deliveryman = require('../models/deliveryman');
const router = express.Router();
const Nexmo = require('nexmo');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const nexmo = new Nexmo({
	apiKey: '599e1242',
	apiSecret: 'Cx6LjAjj0Kjeh0F4'
}, { debug: true });

router.get('/listDelivery', (req, res) => {
	if (req.user.UserType == 'Customer') {
		res.redirect('/Delivery/listdeliveryforuser')
	}
	else {
		Delivery.findAll({
			order: [['productTitle', 'ASC']],
			raw: true,
		}).then((deliveries) => {
			res.render('Delivery/listDelivery', { deliveries })
		})
	}
});

router.get('/editDelivery', (req, res) => {
	res.render('Delivery/editDelivery')
});


router.get('/listdeliveryforuser', (req, res) => {
	if (req.user.UserType == 'Admin') {
		res.redirect('/Delivery/listDelivery')
	}
	else {
		Delivery.findAll({
			where: {
				userId: req.user.id,
			},
			order: [['productTitle', 'ASC']],
			raw: true,
		}).then((deliveries) => {
			res.render('Delivery/listdeliveryforuser', { deliveries })
		})
	}
});


router.get('/OrderCheckStaff', (req, res) => {
	res.render('Delivery/OrderCheckStaff')
});

router.post('/OrderCheckUser/:id', (req, res) => {
	Delivery.findOne({
		where: {
			id: req.params.id
		}
	}).then((delivery) => {
		res.render('Delivery/OrderCheckUser', { delivery })
	})
});

router.post('/OrderCheckStaff/:id', (req, res) => {
	Addresses.findOne({
		where: {
			id: req.params.id
		}
	}).then((address) => {
		//comment : variable that contains what is returned above
		console.log(address)
		Delivery.findOne({
			where: {
				id: req.params.id
			}
		}).then((delivery) => {
			if (delivery.status == 'Ordered') {
				ordered = true
			} else {
				ordered = false
			}
			console.log(delivery)
			console.log(address)
			res.render('Delivery/OrderCheckStaff', { address, delivery, ordered })
		})
	})
});

router.post('/createdeliveryman', (req, res) => {
	let fname = req.body.fname;
	let lname = req.body.lname;
	let phone = req.body.phone;
	let requestid = req.body.requestid;
	let code = req.body.code;
	nexmo.verify.check({
		request_id: requestid,
		code: code
	  }, (err, result) => {
		if (result.status == '0') {
			Deliveryman.create({
				fname,
				lname,
				phone,
			}).then(() => {
				res.redirect('/Delivery/makedelivery/1');
				console.log(req.body)
			}).catch(err => console.log(err))
		} else {
			res.redirect('/Delivery/createdeliveryman?error=wrong_code')
		}
	})
	  });

router.post('/sendverificationcode', (req, res) => {
	nexmo.verify.request({
		number: req.body.phone,
		brand: 'SoundStore',
		code_length: '4'
	  }, (err, result) => {
		if (err) {
			res.send('invalid_phone')
		} else {
			console.log(result)
			res.send({res:'code_sent', id:result.request_id})
		}
	  });
})

router.get('/createdeliveryman', (req, res) => {
	Deliveryman.findAll({
		order: [['fname', 'ASC']],
		raw: true,
	}).then((deliverymans) => {
		res.render('Delivery/createdeliveryman', { deliverymans })
		console.log(deliverymans)
	})
});

router.get('/makedelivery/:id', (req, res) => {
	console.log('ok')
	Deliveryman.findAll({
		order: [['id', 'ASC']],
		raw: true,
	}).then((deliverymans) => {
		res.render('Delivery/makedelivery', { deliverymans, orderId:req.params.id })
		console.log(deliverymans)
	})
})


router.post('/senddelivery/:deliveryid/:orderid', (req, res) => {
	Addresses.findOne({
		where: {
			id: req.params.orderid
		},
		raw: true
	}).then((address) => {
		//comment : variable that contains what is returned above
		Delivery.findOne({
			where: {
				id: req.params.orderid
			},
			raw: true
		}).then(async (delivery) => {
			const number = await Deliveryman.findByPk(
				req.params.deliveryid
			)
			Delivery.update({
				DeliverymanID: number.dataValues.id
			}, 
			{ where: { id: req.params.orderid } })
			const phoneNumber = number.phone
			const customerPhoneNumber = await User.findByPk(
				delivery.userId
			)
			var jwttoken = jwt.sign({ id: delivery.id, address: address }, 'secretkey')
			const text = `the inoformation is:http://192.168.1.100:5000/Delivery/updateDelivery/${jwttoken}`
			const customerText = `The delivery status is waiting.`
			console.log(`http://192.168.1.100:5000/Delivery/updateDelivery/${jwttoken}`);
			nexmo.message.sendSms(
				'6588225004', phoneNumber, text, { type: 'unicode' },
				(err, responseData) => {
					if (err) {
						console.log(err);
					} else {
						nexmo.message.sendSms(
							'6588225004', customerPhoneNumber.ContactNo, customerText, { type: 'unicode' },
							(err, responseData) => {
								Delivery.update({
									status: 'Waiting'
								}, {
									where: {
										id: req.params.orderid
									}
		
								})
							}
						)
						console.log(delivery.status)
					}
				}
			)
			res.redirect('/Delivery/listDelivery')
		})
	})
})

router.get('/update/:id/:status', async (req, res) => {
	var decoded = jwt.verify(req.params.id, 'secretkey')
	let delivery = await Delivery.findOne({
		where: {
			id: decoded.id
		}
	})
	if (delivery.status == 'Waiting' || delivery.status == 'Delivering' || delivery.status == 'Reached') {
		delivery.status = req.params.status
		await delivery.save()
		User.findOne({
			where: {
				id: decoded.id
			},
			raw: true
		}).then(async (user) => {
			const users = await User.findByPk(
				user.id
			)
			const phoneNumber = users.ContactNo
			const text = `Delivery status changed:${delivery.status}`
			nexmo.message.sendSms(
				'6588225004', phoneNumber, text, { type: 'unicode' },
				(err, responseData) => {
					if (err) {
						console.log(err);
					}
				}
			)
			res.redirect(`/Delivery/updateDelivery/${req.params.id}`)
		})
	}
})

router.get('/updateDelivery/:id', function (req, res) {
	var decoded = jwt.verify(req.params.id, 'secretkey')
	Delivery.findOne({ where: { id: decoded.id } }).then(delivery => {
		var address = {dataValues: decoded.address}
		console.log(address)
		res.render('Delivery/updateDelivery', {
			delivery: delivery,
			address: address,
			jwttoken: req.params.id
		});
	})
})

//ordered, waiting, delivering, reached
module.exports = router;