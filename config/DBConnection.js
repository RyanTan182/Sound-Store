const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const product = require('../models/Product');
const delivery = require('../models/Delivery');

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('sstore database connected');
        })
        .then(() => {
            user.hasMany(product);
            user.hasMany(delivery);
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };