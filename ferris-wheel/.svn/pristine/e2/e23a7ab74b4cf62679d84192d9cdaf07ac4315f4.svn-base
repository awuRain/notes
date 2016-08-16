var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/logout', router);
};

router.get('/', function (req, res, next) {
  //销毁sesstion
  req.session.views.userName = null;
  req.session = null;
  res.redirect('https://uuap.baidu.com/logout?service=http://cp01-qa-lvyou-001.cp01.baidu.com:8000/');
});

