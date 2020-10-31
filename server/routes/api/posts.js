// add posts, like, comment

const express = require('express');
const router = express.Router();

/**
 * @route    #reqtype: GET | #endpoint: api/posts
 * @desc     test route
 * @access   Public (No token needed)
 */
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
