var models = require('../models');
var Doc = models.Doc;

exports.newAndSave = function (title, content, top, authorId, callback) {
  var doc = new Doc();
  doc.title = title;
  doc.content = content;
  doc.top = top;
  doc._creator = authorId;
  doc._updator = null;
  doc.save(callback);
};

exports.getCountByQuery = function (query, callback) {
  Doc.count(query, callback);
};

exports.getDocsByQuery = function (query, skip, sort, limit, callback) {
  Doc.find(query).populate('_creator _updator').skip(skip).sort(sort).limit(limit).exec(callback);
};

exports.getDocById = function (id, callback) {
  Doc.findOne({_id: id}).populate('_creator _updator').exec(function (err, doc) {
    if (err) {
      return callback(err);
    }
    return callback(null, doc);
  })
}