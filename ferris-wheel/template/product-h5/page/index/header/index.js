var Tracker = require('Tracker');

function init(eventId){
  Tracker.init({
    module: 'product-h5',
    page: 'product-h5' + eventId
  });
  Tracker.pvLog();
}

module.exports.init = init;
