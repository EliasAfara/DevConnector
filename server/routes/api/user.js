// handle registering users and adding users

const express = require('express');
const router = express.Router();

/**
 * @route    #reqtype: GET | #endpoint: api/users
 * @desc     test route
 * @access   Public (No token needed)
 */
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
