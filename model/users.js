'use strict';
var low = require('lowdb');
var db = low('users.json');


module.exports = db('users');
