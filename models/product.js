const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Product = db.define('product', {
    productTitle: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING(2000)
    },
    type: {
        type: Sequelize.STRING
    },
    brand: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.INTEGER
    },
    dateRelease: {
        type: Sequelize.DATE
    }, 
});
module.exports = Product;