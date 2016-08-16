var express = require('express'),
  router = express.Router();
var mongoose = require('mongoose');
var EventModel = mongoose.model('Event');

module.exports = function (app) {
  app.use('/util', router);
};

router.get('/index', function (req, res, next) {
  //选择所有的活动列表
  EventModel.find({}, {"_id":0, "__v":0,"data":0,"select_section":0}, function(err, event){
    console.log(event);
    res.render('util/index', {userName:req.session.views.userName, 'event_list': event});
  });

});



