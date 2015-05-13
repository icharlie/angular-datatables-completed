'use strict'

var home = require('./controllers/home');
var user = require('./controllers/user');

module.exports = function(app) {
    app.get('/', home);
    app.get('/users', user.index);

};



