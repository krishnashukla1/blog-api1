

const express = require('express');
const router = express.Router(); // Import express router
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => { // Create a new post
  try {
    const { title, content, tags, authorId } = req.body;  

    if (authorId && authorId !== req.user.id) { // Validate authorId matches authenticated user
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'authorId does not match authenticated user',
      });
    }

    const post = new Post({               // Create a new post
      title,
      content,
      tags,
      authorId: req.user.id,              // Use authenticated user ID
    });
    await post.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error creating post',
      error: error.message,
    });
  }
});

router.get('/', async (req, res) => {                  // Get all posts
  try {
    const page = parseInt(req.query.page) || 1;        // Default to page 1
    const limit = parseInt(req.query.limit) || 10;     // Default to 10 posts per page
    const skip = (page - 1) * limit;                   // Calculate the number of posts to skip

    const total = await Post.countDocuments();         // Count total posts
    const posts = await Post.find().populate('authorId', 'name').skip(skip).limit(limit);   // Fetch posts with pagination
                                                                                            // Populate authorId with name field

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Posts fetched successfully',
      currentPage: page,                        // Current page number
      totalPages: Math.ceil(total / limit),    // Calculate total pages
      totalPosts: total,                       // Total number of posts
      posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error fetching posts',
      error: error.message,
    });
  }
});

// Moved search route before :postId
router.get('/search', async (req, res) => {         // Search posts by keyword
  try {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = keyword                     // Check if keyword is provided
      ? {
          $or: [                                                  // Search in title or content
            { title: { $regex: keyword, $options: 'i' } },        // Case insensitive search
            { content: { $regex: keyword, $options: 'i' } },      // Case insensitive search
          ],
        }
      : {};                                                        // No keyword, return all posts

    const total = await Post.countDocuments(query);               // Count total posts matching the query
    const posts = await Post.find(query).populate('authorId', 'name').skip(skip).limit(limit); // Fetch posts with pagination

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Posts fetched successfully',
      currentPage: page,
      totalPages: Math.ceil(total / limit),           // Calculate total pages
      totalPosts: total,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error searching posts',
      error: error.message,
    });
  }
});

// Moved filter route before :postId
router.get('/filter', async (req, res) => {         // Filter posts by tag
  try {
    const { tag } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = tag ? { tags: tag } : {};

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query).populate('authorId', 'name').skip(skip).limit(limit);// Fetch posts with pagination

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Posts fetched successfully',
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error filtering posts',
      error: error.message,
    });
  }
});

router.get('/:postId', async (req, res) => {              // Get a single post by ID
  try {
    const post = await Post.findById(req.params.postId).populate('authorId', 'name');  // Fetch post by ID and populate authorId with name field
    if (!post) {                                              //  Check if post exists
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Post not found',
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Post fetched successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error fetching post',
      error: error.message,
    });
  }
});

router.put('/:postId', authMiddleware, async (req, res) => {        // Update a post by ID
  try {
    const post = await Post.findById(req.params.postId);              // Fetch post by ID
    if (!post) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Post not found',
      });
    }
    if (post.authorId.toString() !== req.user.id) {              // Check if authenticated user is the author
      return res.status(403).json({                             // Not authorized to update the post
        status: 403,
        success: false,
        message: 'Not authorized to update this post',
      });
    }
    const { title, content, tags } = req.body;                       // Get updated data from request body
    post.title = title || post.title;                               // Update title if provided
    post.content = content || post.content;                         // Update content if provided
    post.tags = tags || post.tags;                                 // Update tags if provided
    await post.save();                                             // Save updated post

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error updating post',
      error: error.message,
    });
  }
});

router.delete('/:postId', authMiddleware, async (req, res) => {         // Delete a post by ID
  try {
    const post = await Post.findById(req.params.postId);          // Fetch post by ID
    if (!post) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Post not found',
      });
    }
    if (post.authorId.toString() !== req.user.id) {                 // Check if authenticated user is the author
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'Not authorized to delete this post',
      });
    }
    await post.remove();

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error deleting post',
      error: error.message,
    });
  }
});

module.exports = router;