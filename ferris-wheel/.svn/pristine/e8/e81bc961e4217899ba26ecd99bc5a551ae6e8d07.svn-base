var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  EventModel = mongoose.model('Event'),
  LogModel = mongoose.model('Log');

module.exports = function (app) {
  app.use('/event/list', router);
};

router.get('/', function (req, res, next) {
  var template_id = req.query.template_id;
  EventModel.find({"template_id": template_id}, {"_id":0},function(err, doc){
    res.render('event/list', {"events":doc,userName:req.session.views.userName});
  });
});

router.post('/removeEvent', function(req, res, next){
  var event_name = req.body.event_name;
  //删除events表
  EventModel.remove({'event_name': event_name}, function(){
    //删除logs表
    LogModel.remove({'event_name': event_name}, function(){
      res.json({
        "errno":0,
        "msg":""
      });
    });
  });
});


router.get('/editData', function(req, res){
  var event_name = decodeURIComponent(req.query.event_name);
  var template_id = req.query.template_id;
  //根据logid查询当前log的所有信息
  EventModel.find({"event_name":event_name},function(err, log){
    TemplateModel.find({"template_id": template_id}, {"template_id":1,"page_id":1,"section":1,"default":1, "_id":0},function(err, temp){
      res.render('event/data?template_id=' + template_id, {userName:req.session.views.userName});
    });
  });
});


