var Doc = require('../proxy').Doc
var User = require('../proxy').User;
var Util = require('../libs/util');

exports.showList = function (req, res, next) {
  var keyword = req.query.q || '';
  var curPage = req.query.p || 1;
  var limit = 20;
  var skip = (curPage - 1 ) * limit;
  var sort = {top: 'desc', update_date: 'desc'};
  var query = {};
  if (keyword) {
    keyword = keyword.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
    query.title = new RegExp(keyword, 'i');
  }

  Doc.getCountByQuery({}, function (err, count) {
    var toptalPage = count % limit === 0 ? parseInt(count / limit, 10) : parseInt(count / limit, 10) + 1;
    Doc.getDocsByQuery(query, skip, sort, limit, function (err, docs) {
      if (err) {
        return next(err);
      }

      res.render('index', {docs: docs, curPage: curPage, totalPage: toptalPage});
    });
  });

}

exports.showDetails = function (req, res, next) {
  var id = req.params.id;
  if (id.length !== 24) {
    return res.render('doc/detail', {error: "此文档不存在或已被删除", content: ''});
  }

  Doc.getDocById(id, function (err, doc) {
    return res.render('doc/detail', {
      id: id,
      title: doc.title,
      content: doc.content,
      create_date: doc.create_date,
      update_date: doc.update_date,
      creator: doc._creator,
      updator: doc._updator
    })
  });
}

exports.create = function (req, res, next) {
  res.render('doc/create');
};

exports.post = function (req, res, next) {
  var title = req.body.title.trim();
  var content = req.body.content;
  var top = req.body.top;
  if (!title) {
    return res.render('doc/create', {error: '标题不能为空'});
  } else if (title.length < 2 || title.length > 100) {
    return res.render('doc/create', {error: '标题字数太多或太少'});
  }
  Doc.newAndSave(title, content, top, req.session.user._id, function (err, doc) {
    if (err) {
      return next(err);
    }
    res.redirect('doc/' + doc.id);
  })
}

exports.showEdit = function (req, res, next) {
  var id = req.params.id;
  if (id.length !== 24) {
    return res.render('404');
  }

  Doc.getDocById(id, function (err, doc) {
    return res.render('doc/edit', {
      title: doc.title,
      top: doc.top,
      content: doc.content
    })
  });
}

exports.update = function (req, res, next) {
  var id = req.params.id;
  if (id.length !== 24) {
    return res.render('404');
  }

  var title = req.body.title;
  var top = req.body.top;
  var content = req.body.content;

  Doc.getDocById(id, function (err, doc) {
    doc.title = title;
    doc.top = top;
    doc.content = content;
    doc._updator = req.session.user._id;
    doc.update_date = new Date();
    doc.save(function (err) {
      return next(err);
    });


  });

  return res.redirect("/doc/" + id);
}

exports.delete = function (req, res, next) {
  var id = req.params.id;
  if (id.length !== 24) {
    return res.render('404');
  }

  Doc.getDocById(id, function (err, doc) {
    if (req.session.user._id != doc._creator._id) {
      return res.render('notify', {error: '无权限。'});
    }
    doc.remove(function (err) {
      return next(err);
    });
    return res.render('notify', {success: 'Doc已被删除。'});
  });
}