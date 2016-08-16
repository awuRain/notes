var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  TemplateModel = mongoose.model('Template'),
  EventModel = mongoose.model('Event'),
  logModel = mongoose.model('Log');
require('date-utils');
var ObjectID = require('mongodb').ObjectID;
var execSync = require('child_process').execSync;
var fs = require('fs');

module.exports = function (app) {
  app.use('/event/section', router);
};

router.get('/', function (req, res, next) {
  var template_id = req.query.template_id;
  var event_name = decodeURIComponent(req.query.event_name);
  //从template表中取到当前template_id所对应的所有page对应的section信息
  if(req.query.event_name) {
    TemplateModel.find({"template_id": template_id}, {"_id":0},function(err, doc){
      EventModel.find({'event_name': event_name}, {"_id":0}, function(err, event){
        res.render('event/section', {"template":doc, "event": event,userName:req.session.views.userName});
      });
    });
  }
  else {
    TemplateModel.find({"template_id": template_id}, {"_id":0},function(err, doc){
      res.render('event/section', {"template":doc,userName:req.session.views.userName});
    });
  }
});

//根据选择的区块生成页面骨架
router.post('/save', function(req, res, next) {
  //捕获post参数
  var template_id = req.body.template_id;
  var event_name = req.body.event_name;
  var sections = JSON.stringify(req.body.sections);
  //创建操作日志
  logModel.create({
    "_id": new Date().getTime() + req.session.views.userName,
    "user_id":req.session.views.userName,
    "template_id": template_id,
    "event_name": event_name,
    "type":"设置区块",
    "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
    "select_section": sections
  });
  EventModel.update({"event_name": event_name,"template_id":template_id}, { $set: { "select_section": sections }}, function(err){
    if(err) {
      res.json({
        "errno":1,
        "msg": err.toString()
      });
    }
    else {
      res.json({
        "errno":1,
        "msg": ""
      });
    }
  });
});


//根据选择的区块生成页面骨架
router.post('/generator-create', function(req, res, next){
  //捕获post参数
  var template_id = req.body.template_id;
  var event_name = req.body.event_name;
  var sections = JSON.stringify(req.body.sections);
  var modeltype = req.body.modeltype;
  //获取当前工程的路径
  var root = process.cwd() + '/template/' + template_id;
  if(!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }
  //初始化代码骨架
  console.log('初始化页面代码骨架');
  try {
    execSync('cd ' + root + ' && rm -rf * && yo mist:' + template_id);
  }
  catch(e) {
    res.json({
      "errno":1,
      "msg":"出错了，请联系闫老湿"
    });
    return;
  }
  console.log('初始化页面代码骨架结束');
  //把新建操作保存到数据库中
  if('new' == modeltype) {
    EventModel.create({
      "event_id": "",
      "event_name": event_name,
      "template_id": template_id,
      "status": "新建",
      "user_id": req.session.views.userName,
      "select_section":sections,
      "data":"{}"
    });
  }
  //如果是编辑，还要更新，shit
  else if('edit' == modeltype) {
    console.log(sections);
    EventModel.update({"event_name": event_name,"template_id":template_id}, { $set: { "select_section": sections }}, function(err){
      if(err) {
        res.json({
          "errno":1,
          "mgs": err.toString()
        });
      }
    });
  }
  //创建操作日志
  logModel.create({
    "_id": new Date().getTime() + req.session.views.userName,
    "user_id":req.session.views.userName,
    "template_id": template_id,
    "event_name": event_name,
    "type":"设置区块",
	  "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
    //"data":sectionLog?sectionLog.data:"{}",
    "select_section": sections
  }, function(err){
    if(err) {
      //返回数据
      res.json({
        "errno":1,
        "msg": err.toString()
      });
    }
    else {
      //返回数据
      res.json({
        "errno":0,
        "msg":""
      });
    }
  });

});
