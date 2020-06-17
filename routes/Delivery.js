const express = require('express');
const router = express.Router();

router.get('/listDelivery', (req, res) => {
    res.render('Delivery/listDelivery')
})

module.exports = router;