const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../models/order');
const Product = require('../models/Product');
const Payment = require('../models/payment');
const Addresses = require('../models/address');
const Delivery = require('../models/delivery')
const nodemailer = require("nodemailer");


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
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
	}).then((payment)=>{
		console.log(req.body.totalprice) 
		if(payment){
			//this happens if cancel half way and update existing payment
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
	let fname = req.body.fname;
	let	lname = req.body.lname;
	let	email = req.body.email;
	let	address = req.body.address;
	let	country = req.body.country;
	let	postalcode = req.body.postalcode;
	let	phonenum = req.body.phonenum;
	let userId = req.user.id;
	Addresses.create({
		fname,
		lname,
		email,
		address,
		country,
		postalcode,
		phonenum, 
		userId,
	}).then(()=>{
		Payment.findOne({
			where:{
				userId:req.user.id,
			},
		}).then((payment)=>{
			
			res.render('order/payment',{payment,total:payment.total})
	
		})
	})
	
});


router.post('/confirmation', (req, res) => {
	Payment.findOne({
		where:{
			userId:req.user.id,
		},
		
	}).then((payment)=>{
		async function main() {
			// Generate test SMTP service account from ethereal.email
			// Only needed if you don't have a real mail account for testing
			
		  
			// create reusable transporter object using the default SMTP transport
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					   user: 'bearmax69@gmail.com',
					   pass: 'polarballs'
				   }
			   });
			const output = `
			$${payment.total} has been deducted from your account
			`
			// send mail with defined transport object
			let info = await transporter.sendMail({
			  from: '"Yong Sheng" <bearmax69@gmail.com>', // sender address
			  to: "yongsheng.chia.123@gmail.com", // list of receivers
			  subject: "Order Confirmation", // Subject line
			  text: "{{total}} has been deducted from your account", // plain text body
			  html: output // html body
			});
		  
			console.log("Message sent: %s", info.messageId);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
		  
			// Preview only available when sending through an Ethereal account
			console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		  }
		  
		  main().catch(console.error);
		Payment.destroy({
			where: {
				id:payment.id,
			},
		}).then(()=>{
			Order.findAll({
				where:{
					userId:req.user.id,
				}
			}).then((order) =>{
				for(var o of order){
					Delivery.create({
						productTitle:o.productTitle,
						productImage:o.productImage,
						price:o.price,
						quantity:o.quantity,
						userId:req.user.id,
						totalPrice:o.price
					})

				}
			}).then(()=>{
				Order.destroy({
					where:{
						userId:req.user.id,
					}
				})
			})
				
			
		})
		res.render('order/confirmation',{payment,total:payment.total})
	})
	

});

module.exports = router;