var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
var exec = require('child_process').exec;
var fs = require('fs');
var juicer = require('juicer');
var cheerio = require('cheerio');
var logModel = mongoose.model('Log');
var EventModel = mongoose.model('Event');
var TemplateModel = mongoose.model('Template');
var template_id, sections, event_name;

// 定义当前模块使用的路径'/event/data'
module.exports = function (app) {
  app.use('/event/data', router);
};

router.get('/', function (req, res, next) {

  // 从 query 中找到选中的区块 sections
  sections = JSON.parse(req.query.sections);
  // 从 query 中找到模板id template_id
  template_id =  req.query.template_id;
  // 取出活动名称（暂时作为主键）
  // decodeURIComponent 可以对 encodeURIComponent函数编码的URI进行解码
  event_name = decodeURIComponent(req.query.event_name);
  // 找到 log 的id
  var log_id = req.query.log_id;

  //找到每个页面的表单
  var content = {};
  for(var key in sections) {
    var contentText = "";
    // 找到/template/{?template_id}/page/{?sections_key}/form.html
    var tplDir = process.cwd() + '/template/' + template_id + '/page/';
    tplDir += key;
    //先找common框架的表单
    if(fs.existsSync(tplDir + '/form.html')) {
      // 将form.html文件的内容拼接到contentText上
      contentText += fs.readFileSync(tplDir + '/form.html').toString();
    }
    for(var i = 0; i < sections[key].length; i++) {
      var filePath = tplDir + '/' + sections[key][i] + '/form.html';
      if(fs.existsSync(filePath)) {
        contentText += fs.readFileSync(filePath).toString();
      }
    }
    content[key] = contentText;
  }

  //找到给表单初始化的js文件
  //主要就是一些angularjs变量的定义以及一些方法的定义
  var forminit = " ";
  var tplDir = process.cwd() + '/template/' + template_id + '/page/';
  if(fs.existsSync(tplDir + 'form-init.js')) {
    forminit = fs.readFileSync(tplDir + 'form-init.js', 'utf-8');
  }

  // 从表单html字符串（content.index）中取出带有ng-repeat属性的section，在其尾部追加两个按钮，触发方法需要在对应模板中的form-init添加通用方法
  var $ = cheerio.load(content.index);
  $('section[ng-repeat]').not('[class~=no-adjustable]').each(function(){
    $(this).css('position', 'relative');
    var list = $(this).attr('ng-repeat').match(/in\s\S+\b/ig)[0].split(' ')[1],
        ordersection = '<section class="order-btns">' + 
                          '<button class="btn btn-link btn-xs" ng-click="upRow($index, '+ list +')"><span class="glyphicon glyphicon-chevron-up"></span></button>' + 
                          '<button class="btn btn-link btn-xs" ng-click="downRow($index, '+ list +')"><span class="glyphicon glyphicon-chevron-down"></span></button>' + 
                       '</section>';
    $(this).append(ordersection);
  });
  // 苦恼，这代码写的好丑
  var downRow = function (index, list) {
    if(index == list.length -1) return;
    var item = list[index];
    list.splice(index, 1);
    list.splice(index + 1, 0, item);
  };
  var upRow = function (index, list) {
    if(index == 0) return;
    var item = list[index];
    list.splice(index, 1);
    list.splice(index - 1, 0, item);
  };
  content.index = $.root().html();
  forminit = forminit + '\n$scope.downRow = ' + downRow.toString() + ';' + '$scope.upRow = ' + upRow.toString() + ';';

  //查找log_id，如果能在log表中找到相关的document,说明这个页面是从操作日志页面跳转来的
  if(log_id) {
    logModel.find({'_id': log_id}, function(err, doc){
      if(doc.length > 0) {
        res.render('event/data', {"html":content, "log":doc, "forminit":forminit,userName:req.session.views.userName});
      }
      else {
        res.render('event/data', {"html":content, "forminit":forminit,userName:req.session.views.userName});
      }
    });
  }
  else if(event_name) {
    //这个分支表示从编辑数据进来的
    TemplateModel.find({"template_id": template_id}, {"_id":0},function(err, temp){
      EventModel.find({'event_name':event_name}, {"_id":0, "__v":0}, function(err, event){
        if(event.length > 0) {
          res.render('event/data', {"html":content, "temp":temp[0],"event":event, "forminit":forminit,userName:req.session.views.userName});
        }
        else {
          res.render('event/data', {"html":content, "temp":temp[0],"forminit":forminit,userName:req.session.views.userName});
        }
      });
    });
  }
  else {
    res.render('event/data', {"html":content, "forminit":forminit,userName:req.session.views.userName,userName:req.session.views.userName});
  }
});

//获取所有的活动列表
//这在什么情况下会被用到呢？
router.get('/eventlist', function (req, res) {
  EventModel.find({}, {"_id":0, "__v":0,"data":0,"select_section":0}, function(err, event){
    res.json({
      "errno": 0,
      "msg": '',
      "data":event
    });
  });
});

//导入数据
router.get('/import', function(req, res){
  // 本活动名称
  var event_name =  req.query.event_name;
  // 被复制的活动名称
  var copy_event_name = req.query.copy_event_name;
  // 模板id
  var template_id = req.query.template_id;
  // 被选中的区块
  var select_section = req.query.select_section;
  EventModel.find({'event_name':copy_event_name}, {}, function(err, event){
    var event = event[0];
    var data = JSON.parse(event.data);
    //对数据做一些处理，需要把event_id去掉
    data.common.eventId = null;
    logModel.create({
      '_id': new Date().getTime() + req.session.views.userName,
      "user_id":req.session.views.userName,
      "template_id": template_id,
      "event_name": event_name,
      "type":"导入数据",
      "select_section":select_section,
      "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
      "data":JSON.stringify(data)
    });
    //将数据插入到现在的这个活动中
    EventModel.update({"event_name":event_name},{ $set: { "status":"导入数据","data": JSON.stringify(data)}},function(err){
      if(err) {
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
});

//预览
router.post('/preview', function (req, res){ 

  // data
  var data = req.body.data;
  var dataObj = JSON.parse(data);
  var mode = req.body.mode;
  var select_section = req.body.select_section;
  var template_id = req.body.template_id;
  var event_name = req.body.event_name;

  // 获取到对应模板的目录
  var tplDir = process.cwd() + '/template/' + template_id;
  // 同步读fis配置文件 fis-conf-tpl.js
  var fisConf = fs.readFileSync(tplDir + '/fis-conf-tpl.js', 'utf-8');

  // 将eventName-eventId填入 fis-config.js
  fs.writeFileSync(tplDir + '/fis-conf.js' ,juicer(fisConf, {"eventName":template_id + '-' + dataObj.common.eventId}));

  //把物料数据分别保存在各个区块的data.json文件中
  var pagesDir = fs.readdirSync(tplDir + '/page');
  try {
    pagesDir.forEach(function (page) {
      if (page.indexOf('.js') < 0) {
        //先把page级别的data.json文件写好
        dataObj.common.section = sections[page];
        fs.writeFileSync(tplDir + '/page/' + page + '/data.json', decodeURIComponent(JSON.stringify(dataObj.common)));

        var sectionDir = fs.readdirSync(tplDir + '/page/' + page);
        sectionDir.forEach(function (section) {
          if (dataObj[page] && dataObj[page][section]) {
            //把公共区块的内容也写在各个分区块中
            for (var k in dataObj.common) {
              dataObj[page][section][k] = dataObj.common[k];
            }
            fs.writeFileSync(tplDir + '/page/' + page + '/' + section + '/data.json', (JSON.stringify(dataObj[page][section])).replace(/\\n/g,'<br/>'));
          }
          else {
            if (fs.existsSync(tplDir + '/page/' + page + '/' + section + '/data.json')) {
              fs.writeFileSync(tplDir + '/page/' + page + '/' + section + '/data.json', (JSON.stringify(dataObj.common)).replace(/\\n/g,'<br/>'));
            }
          }
        });
      }
    });
  }
  catch(e) {
    console.log(e)
  }
  console.log(pagesDir);
  //执行fis，本地编译后发送至沙盒机器，在沙盒上进行预览
  //fis编译过程中会在preprocessor过程利用juicer-parser插件将同目录下的html文件和data.json文件juicer一下
  console.log('开始fis编译');
  exec('cd ' + tplDir + ' && fis release -umd remote', function(err, stdout, stderror){
    if(err) {
      console.log('fis编译出现问题');
      res.json({
        "errno": 1,
        "msg": err.toString()
      });
      return;
    }
    else {
      console.log('fis编译结束');
      console.log(stdout);
      // 存库
      // $ne是 非 选择，则这里是指 寻找 status 不为 已上线的活动进行修改成未上线的操作
      EventModel.update({"event_name":event_name, "status":{"$ne":"已上线"}},{$set:{"data":data, "status":"未上线", "event_id":(template_id + '-' + dataObj.common.eventId)}}, function(err){
        if(err) {
          res.json({
            "errno": 1,
            "msg": err.toString()
          });
        }
        else {
          //保存Logs表
          logModel.create({
            '_id': new Date().getTime() + req.session.views.userName,
            "user_id":req.session.views.userName,
            "template_id": template_id,
            "event_name": event_name,
            "type":"预览",
            "select_section":select_section,
            "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
            "data":data
          }, function(err){
            if(err) {
              res.json({
                "errno":1,
                "msg":err.toString()
              });
            }
            // 若保存log成功之后, 则返回json, json里面的url可供跳跃或者生成二维码
            else {
              res.json({
                "errno":0,
                "msg":"",
                "data":{
                  "url":"http://cp01-qa-lvyou-001.cp01.baidu.com:8080/static/event-cms/" + template_id + '-' + dataObj.common.eventId + '/page/index/index.html'
                }
              });
            }
          });
        }
      });
    }
  });
});

router.post('/save', function (req, res){

  var data = req.body.data; 
  var select_section = req.body.select_section;
  var dataObj = JSON.parse(req.body.data);
  var event_name = req.body.event_name;
  var template_id = req.body.template_id;

  //保存数据Events表
  EventModel.update({"event_name":event_name},{ $set: { "data": data, "status":"未上线","event_id":(template_id + '-' + dataObj.common.eventId)}},function(err){
    if(err){
      res.json({
        "errno":1,
        "msg":err.toString()
      });
    }
    else {
      //保存Logs表
      logModel.create({
        '_id': new Date().getTime() + req.session.views.userName,
        "user_id":req.session.views.userName,
        "template_id": template_id,
        "event_name": event_name,
        "type":"修改数据",
        "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
        "data":data,
        "select_section": select_section
      }, function(err){
        if(err) {
          res.json({
            "errno":1,
            "msg":err.toString()
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

