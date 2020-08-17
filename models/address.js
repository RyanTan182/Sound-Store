const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Addresses = db.define('addresses', {
    fname: {
        type: Sequelize.STRING
    },
    lname: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    },
    postalcode: {
        type: Sequelize.INTEGER
    },
    phonenum: {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.INTEGER
    },
});

module.exports = Addresses;