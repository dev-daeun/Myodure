const dbConfig = require('../config.json').database;
const mysql = require('promise-mysql');
module.exports = mysql.createPool(dbConfig);
