var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  //下面这句是为了本地测试用的
  req.session.views = {"userName":"yanbin01"};
  res.render('index', {userName:req.session.views.userName});
});





