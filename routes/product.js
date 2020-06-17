const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');

    router.get('/listProducts', (req, res) => {
    Product.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['productTitle', 'ASC']
        ],
        raw: true
    })
    .then((products) => {
        // pass object to listVideos.handlebar
        res.render('product/listProducts', {
            products: products
        });
    })  
    .catch(err => console.log(err));
});


//route for the addProduct
router.get('/addProducts', (req, res) => {
    res.render('product/addProducts')
})

// Adds new products from /product/addProducts
router.post('/addProducts', (req, res) => {
    let productTitle = req.body.productTitle;
    let description = req.body.description.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let type = req.body.type;
    let brand = req.body.brand;
    let price = req.body.price;
    let userId = req.user.id;

    // Multi-value components return array of strings or undefined
    Product.create({
        productTitle,
        description,
        type,
        price,
        brand,
        dateRelease,
        userId
    }) .then(product => {
        res.redirect('/product/listProducts');
    })
    .catch(err => console.log(err))
});

router.get('/edit/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {
        if(!product){
            alertMessage(res, 'info', 'No such videos', 'fas fa-exclamation-circle', true);
        }
        checkOptions(product);
            // call views/video/editVideo.handlebar to render the edit video page
        res.render('product/editProduct', {
            product // passes video object to handlebar
        });
    }).catch(err => console.log(err)); // To catch no video ID
});

//route for the optionPage
router.get('/optionPage', (req, res) => {
    res.render('product/optionPage')
})

module.exports = router;