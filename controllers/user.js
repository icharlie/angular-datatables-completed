'use strict';

var users = require('../model/users');

exports.index = function* () {
  this.body = yield users.value();
};


exports.new = function* (next) {
  var newUser = this.request.body;
  newUser.id = users.last().id + 1;
  users.push(newUser);
  this.body = yield newUser;
};


exports.delete = function* (next) {
  var userId = +this.params.id;
  users.remove({id: userId});
  this.body = undefined;
};
