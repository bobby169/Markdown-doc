var sign = require('../controllers/sign');
var doc = require('../controllers/doc');
var auth = require('./auth');
module.exports = function (app) {
  app.get('/signup', sign.showSignup);
  app.post('/signup', sign.signup);
  app.get('/signin', sign.showSignin);
  app.post('/signin', sign.signin);
  app.get('/signout', sign.showSignout);

  app.get('/doc/create', auth.signinRequired, doc.create);
  app.post('/doc/create', auth.signinRequired, doc.post);

  app.get('/', doc.showList);
  app.get('/doc/:id', doc.showDetails);
  app.get('/doc/:id/edit', auth.signinRequired, doc.showEdit);
  app.post('/doc/:id/edit', doc.update);
  app.get('/doc/:id/delete', auth.signinRequired, doc.delete);

  app.get('/about',function(req,res){
    res.render("about");
  });

  app.use(function (req, res) {
    res.render("404");
  });
}
