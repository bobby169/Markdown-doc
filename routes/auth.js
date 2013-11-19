exports.signinRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    //res.render('notify', {error: '未登入。'});
    res.redirect('/signin');
    return;
  }
  next();
};
