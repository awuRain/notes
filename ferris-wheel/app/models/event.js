var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  "event_id": String,
  "event_name" : String,
  "template_id" : String,
  "status" : String,
  "user_id" : String,
  "data": String,
  "select_section": String,
  "online":""
});

mongoose.model('Event', EventSchema);

