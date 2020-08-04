const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Delivery = db.define('delivery', {
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
    status: {
        type: Sequelize.STRING, 
        defaultValue: 'ordered'
    },
});



module.exports = Delivery;