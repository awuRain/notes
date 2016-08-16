var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
var ApplyModel = mongoose.model('Apply');
var UserModel = mongoose.model('User');
require('date-utils');


module.exports = function (app) {
  app.use('/authority', router);
};

router.get('/', function (req, res, next) {
  //先查找管理员
  UserModel.find({'authority':'superadmin'}, function(err, superadmin){
    UserModel.find({'username':req.session.views.userName}, function(err, user){
      if(user.length == 1) {
        req.session.views.authority = user[0].authority;
      }
      else {
        req.session.views.authority = 'visitor';
      }
      if(req.session.views.authority !== 'superadmin') {
        ApplyModel.find({user_name: req.session.views.userName}, function(err, applylogs){
          res.render('authority/apply', {userName: req.session.views.userName, authority: req.session.views.authority, applylogs: applylogs,superadmin:superadmin});
        });
      }
      else {
        ApplyModel.find({'status': 'doing'}, function(err, applylogs){
          res.render('authority/apply', {userName: req.session.views.userName, authority: req.session.views.authority, applylogs: applylogs,superadmin:superadmin});
        });
      }
    });
  });
});

router.get('/apply', function (req, res, next) {
  //申请权限，插入applys collection
  var apply_authority = req.query.apply_authority;//申请的具体权限
  var user_name = req.session.views.userName;//用户名
  var date = (new Date()).toFormat('YYYY-MM-D HH24:MI');

  ApplyModel.find({"user_name":user_name}, function(err, log){
    if(log.length == 0) {
      ApplyModel.create({
        "apply_authority": apply_authority,
        "user_name": user_name,
        "date": date,
        "status": "doing"
      }, function(err){
        if(err){
          res.json({
            "errno": 1,
            "msg": err.toString()
          });
        }
        else {
          res.json({
            "errno": 0,
            "msg": ""
          });
        }
      });
    }
    else {
      ApplyModel.update({"user_name":user_name}, {$set:{"status":"doing", "apply_authority": apply_authority}}, function(err){
        if(err){
          res.json({
            "errno": 1,
            "msg": err.toString()
          });
        }
        else {
          res.json({
            "errno": 0,
            "msg": ""
          });
        }
      });
    }
  });
});


router.get('/accept', function (req, res, next) {

  var apply_authority = req.query.authority;//申请的具体权限
  var user_name = req.query.username;//用户名

  ApplyModel.update({"user_name":user_name},{$set:{"status":"accept"}}, function(err){
    UserModel.find({"username": user_name}, function(err,users){
      if(users.length == 0) {
        UserModel.create({"username":user_name, "authority": apply_authority}, function(err){
          if(err){
            res.json({
              "errno": 1,
              "msg": err.toString()
            });
          }
          else {
            res.json({
              "errno": 0,
              "msg": ""
            });
          }
        });
      }
      else {
        UserModel.update({"username":user_name},{$set: {"authority": apply_authority}}, function(err){
          if(err){
            res.json({
              "errno": 1,
              "msg": err.toString()
            });
          }
          else {
            res.json({
              "errno": 0,
              "msg": ""
            });
          }
        });
      }
    });

  });
});

router.get('/eject', function (req, res, next) {

  var user_name = req.query.username;//用户名

  ApplyModel.update({"user_name":user_name},{$set:{"status":"eject"}}, function(err){
    if(err){
      res.json({
        "errno": 1,
        "msg": err.toString()
      });
    }
    else {
      res.json({
        "errno": 0,
        "msg": ""
      });
    }
  });
});

