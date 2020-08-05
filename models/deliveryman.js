const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Deliveryman = db.define('deliveryman', {
    productTitle: {
        type: Sequelize.STRING
    },
});



module.exports = Deliveryman;