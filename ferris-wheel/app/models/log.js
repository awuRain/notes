var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogSchema = new Schema({
  "_id": String,
  "event_id": String,
  "event_name": String,
  "user_id": String,
  "type": String,
  "date": String,
  "data": Object,
  "select_section": Object,
  "template_id": String
});

mongoose.model('Log', LogSchema);

