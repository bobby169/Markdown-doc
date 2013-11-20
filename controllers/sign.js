var crypto = require('crypto');
var User = require('../proxy').User;

var notJump = [
  '/signup'         //regist page
];

exports.showSignup = function (req, res) {
  res.render('sign/signup');
};

exports.signup = function (req, res, next) {
  var name = req.body.name.trim();
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  if (name === '' || password === '' || email === '') {
    return res.render('sign/signup', {error: '信息不完整。'});
  }

  User.getUsersByQuery({'email': email}, function (err, users) {
    if (err) {
      return next(err);
    }
    if (users.length > 0) {
      res.render('sign/signup', {error: '邮箱已被使用。', name: name, email: email});
      return;
    }

    password = md5(password);
    var avatar = 'https://s.gravatar.com/avatar/' + md5(email.toLowerCase()) + '?s=48';

    User.newAndSave(name, password, email, avatar, function (err) {
      if (err) {
        return next(err);
      }

      User.getUserByEmail(email, function (err, user) {
        if (err) {
          return next(err);
        }
        req.session.user = user;
        res.redirect('/');
      })

    });

  });

}

exports.showSignin = function (req, res) {
  req.session._loginReferer = req.headers.referer;
  res.render('sign/signin');
};

exports.signin = function (req, res) {
  var email = req.body.email.trim();
  var password = req.body.password.trim();

  if (!email || !password) {
    return res.render('sign/signin', {error: '信息不完整'});
  }

  User.getUserByEmail(email, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('sign/signin', {error: '这个用户不存在'});
    }
    password = md5(password);
    if (password !== user.password) {
      return res.render('sign/signin', { error: '密码错误。' });
    }
    req.session.user = user;
    res.locals.user = req.session.user;

    var refer = req.session._loginReferer || '/';
    for (var i = 0, len = notJump.length; i !== len; ++i) {
      if (refer.indexOf(notJump[i]) >= 0) {
        refer = '/';
        break;
      }
    }
    res.redirect(refer);
  })
};

exports.showSignout = function (req, res) {
  req.session.user = null;
  res.redirect('/');
}



function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}