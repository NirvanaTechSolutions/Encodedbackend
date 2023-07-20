const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchId: {
    type: Number,
    required: true
  },
  studentList: {
    type: [String],
    required: true
  },

  news: [
    {
      type: String
    }
  ],
  nextClass: {
    type: {
      topic: String,
      date: Date,
      timing:String,
      joinLink: String
    }
  },
  link: [
    {
      type: String
    }
  ]
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;