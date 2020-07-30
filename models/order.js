const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Order = db.define('order', {
    productTitle: {
        type: Sequelize.STRING
    },
    productImage: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    userId: {
        type: Sequelize.INTEGER
    },
    totalPrice: {
        type: Sequelize.INTEGER
    },
    
});

module.exports = Order;