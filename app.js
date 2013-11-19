/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.logger({stream: accessLog}));



app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/images' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: 'user',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: 'md_doc'
  })
}));

app.locals.markdown = require('./common/render_helper').markdown;
app.locals.formatDate = require('./common/render_helper').formatDate;
app.use(function(req, res, next) {
  //res.locals.error = req.flash('error').toString();
  //res.locals.success = req.flash('success').toString();
  res.locals.user = req.session ? req.session.user : null;
  next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


routes(app);