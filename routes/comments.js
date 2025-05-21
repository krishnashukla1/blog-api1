const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {  // Create a new comment
  try {
    const { text, postId } = req.body;                  //  Extract text and postId from request body
    const post = await Post.findById(postId);           // Find the post by postId
    if (!post) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Post not found',
      });
    }
    const comment = new Comment({                      // Create a new comment
      text,
      authorId: req.user.id,                           // Set authorId to authenticated user's ID
      postId,                                          // Set postId to the ID of the post being commented on 
    });
    await comment.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Comment created successfully',
      comment,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error creating comment',
      error: error.message,
    });
  }
});

// router.post('/:postId', authMiddleware, async (req, res) => {
//   try {
//     const { text, authorId } = req.body;
//     const { postId } = req.params;

//     // Validate postId
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         status: 404,
//         success: false,
//         message: 'Post not found',
//       });
//     }

//     // Validate authorId matches authenticated user
//     if (authorId !== req.user.id) {
//       return res.status(403).json({
//         status: 403,
//         success: false,
//         message: 'authorId does not match authenticated user',
//       });
//     }

//     const comment = new Comment({
//       text,
//       authorId: req.user.id,
//       postId,
//     });
//     await comment.save();

//     res.status(201).json({
//       status: 201,
//       success: true,
//       message: 'Comment created successfully',
//       comment,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: 'Error creating comment',
//       error: error.message,
//     });
//   }
// });


router.get('/', async (req, res) => {            // Fetch all comments for a post
  try {
    const { postId } = req.query;                 // Extract postId from query parameters
    if (!postId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Post ID is required',
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ postId });  // Count total comments for the post
    const comments = await Comment.find({ postId }).populate('authorId', 'name').skip(skip).limit(limit); // Fetch comments with pagination
                                                                   // Populate authorId with name field

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Comments fetched successfully',
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error fetching comments',
      error: error.message,
    });
  }
});

router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);  // Find comment by ID
    if (!comment) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Comment not found',
      });
    }
    const post = await Post.findById(comment.postId);
    if (comment.authorId.toString() !== req.user.id && post.authorId.toString() !== req.user.id) {  // Check if the authenticated user is the author of the comment or the post
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }
    await comment.remove();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error deleting comment',
      error: error.message,
    });
  }
});

module.exports = router;