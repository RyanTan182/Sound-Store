const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const multer = require('multer');
const { radioCheck } = require('../helpers/hbs');
const fs = require('fs');
const { query } = require('express');

/*
let newz = rec_arrayss.rec_updatedArray

const recommender = new ContentBasedRecommender({
    minScore: 0.2,
    maxSimilarDocuments: 15
});


    const documents = [
        { id:  '1000001', content: newz[0] },
        { id:  '1000002', content: rec_arrayz[1] },
        { id:  '1000003', content: rec_arrayz[2] },
        { id:  '1000004', content: rec_arrayz[3] },
        { id:  '1000005', content: rec_arrayz[4] }
    ];
    console.log(rec_arrayz[0])
    
    recommender.train(documents);
    
    const similarDocuments = recommender.getSimilarDocuments(1000001, 0, 5);
    
    console.log(similarDocuments);    

*/

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

/*
router.get('/edit/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {
        console.log(req.params.id)
        
        res.render('product/editProduct', {
            product: product 
        });
        console.log(product)
    }).catch(err => console.log(err)); 
});
*/
router.get('/edit/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {
        console.log(product.productTitle + '=======OOOOO')
        if(!product){
            alertMessage(res, 'info', 'No such videos', 'fas fa-exclamation-circle', true);
        }else{
            checkOptions(product);
            res.render('product/editProduct', {
                product 
            });
        }
    }).catch(err => console.log(err)); 
});



function checkOptions(product){
    product.headphonesType = (product.type.search('Headphones') >= 0) ? 'checked' : '';
    product.headsetType = (product.type.search('Headset') >= 0) ? 'checked' : '';
    product.earbudsType = (product.type.search('Earbuds') >= 0) ? 'checked' : '';
    product.earpieceType = (product.type.search('Earpiece') >= 0) ? 'checked' : '';
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

router.get('/browseProducts',(req, res) => {
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
});


router.get('/details/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {
        console.log(req.params.id)
        checkOptions(product);

        res.render('product/productDetails', {
            product
        });
    }).catch(err => console.log(err)); 
});


module.exports = router;