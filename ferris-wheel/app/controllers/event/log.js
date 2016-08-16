var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  LogModel = mongoose.model('Log'),
  EventModel = mongoose.model('Event'),
  TemplateModel = mongoose.model('Template');
var ObjectID = require('mongodb').ObjectID;
module.exports = function (app) {
  app.use('/event/log', router);
};

router.get('/', function (req, res, next) {
  var event_name = decodeURIComponent(req.query.event_name);
  LogModel.find({"event_name": event_name}, {"__v":0},function(err, doc){
    res.render('event/log', {"logs":doc,userName:req.session.views.userName});
  }).sort({"_id": -1});
});


router.get('/editSection', function(req, res){
  var log_id = req.query.log_id;
  var template_id = req.query.template_id;
  //根据logid查询当前log的所有信息
  LogModel.find({"_id":log_id},function(err, log){
    TemplateModel.find({"template_id": template_id}, {"template_id":1,"page_id":1,"section":1,"default":1, "_id":0},function(err, temp){
      res.render('event/section', {"template":temp, sectionLog: log,userName:req.session.views.userName});
    });
  });
});

router.get('/editData', function(req, res){
  var log_id = req.query.log_id;
  var template_id = req.query.template_id;
  //根据logid查询当前log的所有信息
  LogModel.find({"_id":log_id},function(err, log){
    TemplateModel.find({"template_id": template_id}, {"template_id":1,"page_id":1,"section":1,"default":1, "_id":0},function(err, temp){
      res.render('event/data?template_id=' + template_id,{userName:req.session.views.userName});
    });
  });
});

router.get('/restoreData', function(req, res){
  var log_id = req.query.log_id;
  var event_name = decodeURIComponent(req.query.event_name);
  var template_id = req.query.template_id;
  //根据logid查询当前log的所有信息
  LogModel.find({"_id":log_id},function(err, log) {
    var logData = log[0].data;
    //覆盖数据
    EventModel.update({"event_name":event_name},{ $set: { "data": logData, "status":"未上线"}},function(err){
      if(err){
        res.json({
          "errno":1,
          "msg":err.toString()
        });
      }
      else {
        res.json({
          "errno":0,
          "msg":''
        });
      }
    });
  });
});



