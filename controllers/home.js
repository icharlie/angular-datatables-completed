'use strict';


var fs = require('fs');
var path = require('path');

var page = fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf-8');

module.exports = function* () {
  this.body = page;
};
