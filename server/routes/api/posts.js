// add posts, like, comment

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
/**
 * @route    #reqtype: POST | #endpoint: api/posts
 * @desc     Add a post
 * @access   Private
 */
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name, // comes from user
        avatar: user.avatar,
        user: req.user.id, // we want user id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('500 Internal server error');
    }
  }
);

/************************************************************/
/**
 * @route    #reqtype: GET | #endpoint: api/posts
 * @desc     Get all Posts
 * @access   Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // Display most recent post first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    #reqtype: GET | #endpoint: api/posts/:id
 * @desc     get post by ID
 * @access   Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Handle post does not exists
    if (!post) {
      // Check if a posts exists with the provided ID
      return res.status(404).json({ msg: 'Post was not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      // Not formatedd Post ID, random id gives this error
      // Without this if statement, we will get a server error for random ID's which is wrong
      return res.status(404).json({ msg: 'Post was not found' });
    }
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    #reqtype: DELETE | #endpoint: api/posts/;id
 * @desc     Delete a post by ID
 * @access   Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Handle post does not exists
    if (!post) {
      // Check if a posts exists with the provided ID
      return res.status(404).json({ msg: 'Post was not found' });
    }

    // Check user (post.user is an object whule req.user.id is a string)
    if (post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'User not authorized' });
    } else {
      await post.remove();
    }
    res.json({ msg: 'Post was removed successfuly!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      // Not formatedd Post ID, random id gives this error
      // Without this if statement, we will get a server error for random ID's which is wrong
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('500 Internal server error');
  }
});

/************************************************************/
/** NOT DONE
 * @route    #reqtype: PUT | #endpoint: api/posts/like/:id
 * @desc     Like a post
 * @access   Private
 */
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Handle post does not exists
    if (!post) {
      // Check if a posts exists with the provided ID
      return res.status(404).json({ msg: 'Post was not found' });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      post.likes.splice(
        post.likes.findIndex((like) => like.user.toString() === req.user.id),
        1
      );
      await post.save();
      return res.json(post.likes);
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/** NOT DONE
 * @route    #reqtype: PUT | #endpoint: api/posts/unlike/:id
 * @desc     UnLike a post
 * @access   Private
 */
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Handle post does not exists
    if (!post) {
      // Check if a posts exists with the provided ID
      return res.status(404).json({ msg: 'Post was not found' });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(404).json({ msg: 'Post has not been liked yet!' });
    }

    // Get the index of the like to remove
    const removeIndex = post.likes.map((like) =>
      like.user.toString().indexOf(req.user.id)
    );

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});

module.exports = router;
