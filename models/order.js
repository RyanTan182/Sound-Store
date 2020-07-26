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
});

module.exports = Order;