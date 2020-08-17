const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const User = db.define('user', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    UserType: {
        type: Sequelize.STRING,
        defaultValue: "Customer",
    },
    ContactNo:{
        type:Sequelize.STRING
    },
    SecurityQn:{
        type: Sequelize.STRING
    },
    SecurityAnswer:{
        type: Sequelize.STRING
    },
});
module.exports = User;
