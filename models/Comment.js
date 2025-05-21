const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to Post model
    ref: 'Post',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);