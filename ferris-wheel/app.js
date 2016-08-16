var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ferris-wheel-development');
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database');
});

// 穷举 /app/models/下的所有文件 并一一require进来
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

// 对express进行初始化
require('./config/express')(app, config);

// 开始监听
app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

