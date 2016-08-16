var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SectionSchema = new Schema({
  "event_id": String
});

mongoose.model('Section', SectionSchema);

