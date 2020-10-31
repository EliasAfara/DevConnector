// Handle getting JSON web token for authentication

const express = require('express');
const router = express.Router();

/**
 * @route    #reqtype: GET | #endpoint: api/auth
 * @desc     test route
 * @access   Public (No token needed)
 */
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;
