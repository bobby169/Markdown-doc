var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var DocSchema = new Schema({
  title: { type: String },
  content: { type: String },
  top: { type: Boolean, default: false },
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
  _creator:{ type: ObjectId, ref: 'User' },
  _updator:{ type: ObjectId, ref: 'User' }

});

mongoose.model('Doc', DocSchema);
