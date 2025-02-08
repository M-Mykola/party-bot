const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  topic: String,
  creator: String,
  isActive: {
    type: Boolean,
    default: false,
}  
});

module.exports = mongoose.model('Event', EventSchema);
