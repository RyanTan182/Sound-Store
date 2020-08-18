const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const multer = require('multer');
const { radioCheck } = require('../helpers/hbs');
const fs = require('fs');
const { query } = require('express');


  

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage});

let directory = './public/uploads/';
let imgFiles = fs.readdirSync(directory);

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
            checkOptions(product);
            checkDropdown(product);
            res.render('product/editProduct', {
                product
            });
    }).catch(err => console.log(err)); 
});

router.post('/updateProduct/:id', upload.single('productImage'), (req, res) => {
    Product.update(
        {
            productTitle: req.body.productTitle,
            description: req.body.description,
            type: req.body.type,
            price: req.body.price,
            brand: req.body.brand,
            productImage: req.body.productImage
        },
        {
            where: {
                id: req.params.id,
            },
        }
    ).then(() => {
        res.redirect('/product/listProducts');
    })
});


function checkOptions(product){
    product.headphonesType = (product.type.search('Headphones') >= 0) ? 'checked' : '';
    product.headsetType = (product.type.search('Headset') >= 0) ? 'checked' : '';
    product.earbudsType = (product.type.search('Earbuds') >= 0) ? 'checked' : '';
    product.earpieceType = (product.type.search('Earpiece') >= 0) ? 'checked' : '';
}

function checkDropdown(product){
    product.razerBrand = (product.brand.search('Razer') >= 0) ? 'selected' : '';
    product.sennheiserBrand = (product.brand.search('Sennheiser') >= 0) ? 'selected' : '';
    product.beatsByDreBrand = (product.brand.search('Beats by Dre') >= 0) ? 'selected' : '';
    product.sonyBrand = (product.brand.search('Sony') >= 0) ? 'selected' : '';
}

//route for the optionPage
router.get('/optionPage', (req, res) => {
    if (req.user.UserType=='Customer'){
        res.redirect('/product/browseProducts')
      }
    else{
        res.render('product/optionPage')
    }
})

router.get('/delete/:id', (req, res) => {
    Product.findOne({
        where:{
            id: req.params.id,
        },
    }).then((product) => {
        req.session.type = product.type
        req.session.prod = product
        Product.destroy({
            where: {
                id:req.params.id,
            },
        }).then(() => {
            res.redirect('/product/listProducts')
        })
    })
})

router.get('/browseProducts',(req, res) => {
    if (req.user.UserType=='Admin'){
        res.redirect('/product/optionPage')
      }
    else{
        Product.findAll({
            order: [
                ['productTitle', 'ASC']
            ],
            raw: true
        })
        .then((products) => {
            res.render('product/browseProducts', {
                imgFiles:imgFiles,
                products: products
            });
        })  
        .catch(err => console.log(err)); 
    }  
});


router.get('/details/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {
        res.render('product/productDetails', {
            product
        });
    }).catch(err => console.log(err)); 
});


module.exports = router;