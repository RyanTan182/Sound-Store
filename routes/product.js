const express = require('express');
const router = express.Router();
// List videos belonging to current logged in user
router.get('/listProducts', (req, res) => {
    res.render('product/listProducts', { // pass object to listVideos.handlebar
        product: 'List of products'
    });
});
module.exports = router;

