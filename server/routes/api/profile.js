// will containe routes that have anuthing to do with routes
// fetching them, adding them, updating them

const express = require('express');
const router = express.Router();

/**
 * @route    #reqtype: GET | #endpoint: api/profile
 * @desc     test route
 * @access   Private (token needed)
 */
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
