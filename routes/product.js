const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');

// List videos belonging to current logged in user
router.get('/listProducts', (req, res) => {
    Product.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['name', 'ASC']
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
    let name = req.body.name;
    let description = req.body.description.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let type = req.body.type.toString();
    let subtitles = req.body.subtitles === undefined ? '' :req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;

    // Multi-value components return array of strings or undefined
    Product.create({
        name,
        description,
        classification,
        language,
        subtitles,
        dateRelease,
        userId
    }) .then(product => {
        res.redirect('/product/listProducts');
    })
    .catch(err => console.log(err))
});

//route for the optionPage
router.get('/optionPage', (req, res) => {
    res.render('product/optionPage')
})

module.exports = router;