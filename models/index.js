var mongoose = require('mongoose');
var settings = require('../settings');
mongoose.connect(settings.db, function (err) {
  if (err) {
    console.error('connect to %s error: ', settings.db, err.message);
    process.exit(1);
  } else {
    console.log("Succeeded connected");
  }

});

require('./user');
require('./doc');

exports.User = mongoose.model('User');
exports.Doc = mongoose.model('Doc');