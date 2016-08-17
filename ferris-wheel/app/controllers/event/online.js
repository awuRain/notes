var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  request = require('request');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var fs = require('fs');
var juicer = require('juicer');
var LogModel = mongoose.model('Log');
var EventModel = mongoose.model('Event');
var TemplateModel = mongoose.model('Template');
var template_id, sections, event_name;

module.exports = function (app) {
  app.use('/event/online', router);
};

function () {
  var promise = function () {
    console.log(1);
  }
}

//发布上线
router.post('/', function (req, res, next) {
  var template_id = req.body.template_id;
  var event_name = req.body.event_name;
  var event_id = req.body.event_id;
  var data = req.body.data;
  var release = req.body.release;
  var dest = req.body.dest || 'lv';
  var dataObj = JSON.parse(req.body.data);
  var sections = JSON.parse(req.body.select_section);

  //保存文件至各个section目录
  var tplDir = process.cwd() + '/template/' + template_id;
  //渲染fis配置文件
  var fisConf;
  if(dest == 'map') {
    fisConf = fs.readFileSync(tplDir + '/fis-conf-map-tpl.js', 'utf-8');
  }
  else {
    fisConf = fs.readFileSync(tplDir + '/fis-conf-tpl.js', 'utf-8');
  }

  fs.writeFileSync(tplDir + '/fis-conf.js' ,juicer(fisConf, {"eventName":template_id + '-' + dataObj.common.eventId}));

  //把物料数据分别保存在各个区块的data.json文件中
  var pagesDir = fs.readdirSync(tplDir + '/page');
  pagesDir.forEach(function(page) {
    if(page.indexOf('.js') < 0) {
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
  console.log(pagesDir);

  //执行fis，把代码编译好，放在output目录下
  var tplDir = process.cwd() + '/template/' + template_id + '/page/';
  console.log('开始fis编译');
  try {
    execSync('cd ' + tplDir + ' && fis release -' + (release||'ud') + ' output');
  }
  catch(e) {
    res.json({
      "errno":1,
      "msg":"编译出错了，请联系闫老湿"
    });
    return;
  }
  console.log('fis编译结束');
  //判断output目录是否存在
  var tplDir = process.cwd() + '/template/' + template_id;
  if(fs.existsSync(tplDir + '/output')) {
    console.log('开始压缩代码为zip包');
    execSync('cd ' + tplDir + '/output' + ' && zip -r event-cms.zip ./page ./static')
    console.log('压缩成功');
    //把这个zip包推送到cms平台
    console.log('开始推送zip包');
    var tplCmd;
    if(dest == 'lv') {
      tplCmd = "curl -F 'user_name=lv' -F 'password=lvapptest' -F'top_ch_spell=lv'  -F'app_id=cms_r' -F'type=0' -F'group_id=55' -F'url=http://lvyou.baidu.com/static/event-cms/${event_id}/' -F 'commonfile=@${f}' 'http://icms.baidu.com:8080/service/app_action/?action=upload'";
    }
    else {
      tplCmd = "curl -F 'user_name=map-lv' -F 'password=map-lvapptest' -F'top_ch_spell=map'  -F'app_id=cms_r' -F'type=0' -F'group_id=1' -F'url=http://map.baidu.com/fwmap/upload/lv-event-cms/${event_id}/' -F 'commonfile=@${f}' 'http://icms.baidu.com:8080/service/app_action/?action=upload'";
    }
    console.log(tplCmd);
    var _cmd = juicer(tplCmd, {
      "event_id":template_id + '-' + event_id,
      "f": tplDir + '/output/event-cms.zip'
    });
    console.log(_cmd);
    exec(_cmd, function(error, stdout, stedrr){
      console.log(stedrr);
      if(error) {
        console.log(error);
        LogModel.create({
          '_id': new Date().getTime() + req.session.views.userName,
          "user_id": req.session.views.userName,
          "template_id": template_id,
          "event_name": event_name,
          "type":"上线失败",
          "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
          "data":data,
          "select_section": req.body.select_section
        });
        EventModel.update({"event_name":event_name}, {$set:{'status':'上线失败'}}, function(){});
      }
      else {
        console.log(stdout);
        LogModel.create({
          '_id': new Date().getTime() + req.session.views.userName,
          "user_id":req.session.views.userName,
          "template_id": template_id,
          "event_name": event_name,
          "type":"上线成功",
          "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
          "data":data,
          "select_section": req.body.select_section
        });
        EventModel.update({"event_name":event_name}, {$set:{'status':"已上线"}}, function(){});
      }
    });
    //保存Logs表
    LogModel.create({
      '_id': new Date().getTime() + req.session.views.userName,
      "user_id":req.session.views.userName,
      "template_id": template_id,
      "event_name": event_name,
      "type":"发起上线",
      "date":(new Date()).toFormat('YYYY-MM-D HH24:MI'),
      "data":data,
      "select_section": req.body.select_section
    });
    EventModel.update({"event_name":event_name}, {$set:{'status':'发起上线', 'online':dest, 'data':data,"event_id":(template_id + '-' + dataObj.common.eventId)}}, function(err){
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
  }
});



