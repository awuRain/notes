var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');


// 所有路由到 event/* 的都会执行权限登录检查
router.all('/event/*', function (req, res, next) {
  var query = req.query;
  var views = req.session.views;
  //检查用户权限
  if(req.session.views && req.session.views.authority) {
    if('superadmin' == req.session.views.authority || 'admin' == req.session.views.authority) {
      next();
    }
    else {
      res.render('auth', {userName: req.session.views.userName});
    }
  }
  else {
    UserModel.find({'username':req.session.views.userName}, function(err, user){
      if(err) {
        res.json({
          "errno": 1,
          "msg": err.toString()
        });
        return;
      }
      else {
        if(user.length == 1 && ('superadmin' == user[0].authority || 'admin' == user[0].authority)) {
          req.session.views.authority = user[0].authority;
          next();
        }
        else {
          req.session.views.authority = 'visitor';
          res.render('auth', {userName: req.session.views.userName});
        }
      }
    });
  }

  // req.session.views.authority = 'visitor';
  // res.render('auth', {userName: req.session.views.userName});


});


module.exports = router;
