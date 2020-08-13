const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Deliveryman = db.define('deliveryman', {
    fname: {
        type: Sequelize.STRING
    },
    lname:{
        type: Sequelize.STRING
    },
    Phone : {
        type: Sequelize.STRING
    }
});



module.exports = Deliveryman;