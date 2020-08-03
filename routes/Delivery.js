const express = require('express');
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
	
}
)


module.exports = router;