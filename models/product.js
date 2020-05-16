const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Product = db.define('product', {
title: {
type: Sequelize.STRING
},
story: {
type: Sequelize.STRING(2000)
},
language: {
type: Sequelize.STRING
},
subtitles: {
type: Sequelize.STRING,
},
classification: {
type: Sequelize.STRING
},
dateRelease: {
    type: Sequelize.DATE
}
});
module.exports = Product;