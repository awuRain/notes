// express框架 express
var express = require('express'),
// 配置文件 config
  config = require('./config/config'),
// 遍历文件模块 glob
  glob = require('glob'),
// node 的 mongo数据库操作模块 mongoose 
  mongoose = require('mongoose');

// 链接到本地数据库
mongoose.connect('mongodb://localhost/ferris-wheel-development');
// 获取数据库连接实例
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

