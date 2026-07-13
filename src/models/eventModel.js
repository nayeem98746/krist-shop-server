const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    default: ''
  },
  discount: {
    type: String,
    required: true,
    default: '0'
  },
  eventImage: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Event', eventSchema);