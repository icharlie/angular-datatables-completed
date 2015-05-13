'use strict';

var users = require('../model/users');

exports.index = function* () {
  this.body = yield users.value();
};
