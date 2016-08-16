// express后端开发模板
var express = require('express');
// 穷举文件 -> 文件路径数组
var glob = require('glob');
// express路由
var router = express.Router();
// 图标中间件
var favicon = require('serve-favicon');
// Morgan log生成器
var logger = require('morgan');
// logger依赖cookieParser
var cookieParser = require('cookie-parser');
// methodOverride依赖bodyParser
var bodyParser = require('body-parser');
// 压缩
var compress = require('compression');
// HTTP 请求方法覆写
var methodOverride = require('method-override');
// express session
var session = require('express-session');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // 设置视图views文件夹路径
  app.set('views', config.root + '/app/views');
  // 设置模板引擎
  app.set('view engine', 'ejs');

  app.use(favicon(config.root + '/public/img/favicon.ico'));

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(session({
    name: "ferris",
    secret: 'kvkenssecret',
    cookie: {maxAge: 1000 * 60 * 60 * 24},//超时时间
    resave: false,
    saveUninitialized: true
  }));

  // var uuapRouter = require(config.root + '/app/controllers/login/loginFilter.js');
  // app.use('/', uuapRouter);

  // require身份验证的Ctrl
  var authRouter = require(config.root + '/app/controllers/login/authority.js');
  // 路由 / 到 authRouter
  app.use('/', authRouter);

  var cons_arr = ['event', 'poem', 'authority', 'util'];
  // 加载所有Ctrl文件
  cons_arr.forEach(function(item){
    var controllers = glob.sync(config.root + '/app/controllers/' + item + '/*.js');
    controllers.forEach(function (controller) {
      require(controller)(app);
    });
  });
  require(config.root + '/app/controllers/login/logout.js')(app);
  require(config.root + '/app/controllers/index.js')(app);


  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
