const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Payment = db.define('payment', {
    userId: {
        type: Sequelize.INTEGER,
        unique:true
    },
    total: {
        type: Sequelize.INTEGER
    },
  
  
});

module.exports = Payment;