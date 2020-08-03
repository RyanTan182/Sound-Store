const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Deluvery = db.define('product', {
    productTitle: {
        type: Sequelize.STRING
    },
    productImage: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
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

const Review = db.define(Review)

module.exports = Delivery;