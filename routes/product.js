const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage});

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
        res.render('product/listProducts', {
            products: products,
            productImage: products.productImage
        });
    })  
    .catch(err => console.log(err));
});


//route for the addProduct
router.get('/addProducts', (req, res) => {
    res.render('product/addProducts')
})

// Adds new products from /product/addProducts
router.post('/addProducts', upload.single('productImage'), (req, res) => {
    let productTitle = req.body.productTitle;
    let productImage = req.file.originalname;
    let description = req.body.description.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let type = req.body.type.toString();
    let brand = req.body.brand;
    let price = req.body.price;
    let userId = req.user.id;

    // Multi-value components return array of strings or undefined
    Product.create({
        productTitle,
        productImage,
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
            alertMessage(res, 'info', 'No such products', 'fas fa-exclamation-circle', true);
        }
        checkOptions(product);

        res.render('product/editProducts', {
            product
        });
    }).catch(err => console.log(err)); 
});

function checkOptions(product){
    product.headphones = (product.type.search('Headphones') >= 0) ? 'checked' : '';
    product.headset = (product.type.search('Headset') >= 0) ? 'checked' : '';
    product.earbuds = (product.type.search('Earbuds') >= 0) ? 'checked' : '';
    product.earpiece = (product.type.search('Earpiece') >= 0) ? 'checked' : '';
}

//route for the optionPage
router.get('/optionPage', (req, res) => {
    res.render('product/optionPage')
})

router.get('/delete/:id', (req, res) => {
    let productId = req.params.id;
    let userId = req.user.id;

    Product.findOne({
        where:{
            id: productId,
            userId: userId
        },
        attributes:['id', 'userId']
    }).then((product) => {
        if(product != null){
            Product.destroy({
                where:{
                    id: productId
                }
            }).then(() => {
                alertMessage(res, 'info', 'Product Listing deleted', 'far fa-trash-alt', true);
                res.redirect('/product/listProducts');
            }).catch(err => console.log(err));
        }
    })
})

router.get('/browseProducts', (req, res) => {
    res.render('product/browseProducts')
})

router.get('/browseProducts', (req, res) => {
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
        res.render('product/browseProducts', {
            products: products,
            productImage: products.productImage
        });
    })  
    .catch(err => console.log(err));
});

module.exports = router;