const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  tags: [{
    type: String,
  }],
  authorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',                           //
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);