var models = require('../models');
var User = models.User;

exports.getUsersByQuery = function (query, callback) {
  User.find(query, callback);
};

exports.getUserByEmail = function (email, callback) {
  User.findOne({'email': email}, callback);
};

exports.newAndSave = function (name, password, email, avatar, callback) {
  var user = new User();
  user.name = name;
  user.password = password;
  user.email = email;
  user.avatar = avatar;
  user.save(callback);
};