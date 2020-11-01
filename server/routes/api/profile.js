// will containe routes that have anuthing to do with routes
// fetching them, adding them, updating them

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
/************************************************************/
/**
 * @route    #reqtype: GET | #endpoint: api/profile/me
 * @desc     Get current user profile
 * @access   Private (token needed)
 * use async await because mongoose return a promise
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Their is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    POST api/profile
 * @desc     Create or update user profile
 * @access   Private (token needed)
 */
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status field is required').not().isEmpty(),
      check('skills', 'Skills field is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // Build socail object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update (profile exists)
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create profile if it does not exists
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('500 Internal server error');
    }
  }
);
/************************************************************/
/**
 * @route    GET api/profile
 * @desc     Get all profiles
 * @access   PUBLIC
 */
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    GET api/profile/user/:user_id
 * @desc     Get profile by user ID
 * @access   PUBLIC
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    DELETE api/profile
 * @desc     Delete profile, user & posts
 * @access   PRIVATE
 */
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User was deleted successfuly!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    PUT api/profile/experience
 * @desc     Add profile experience
 * @access   PRIVATE
 */
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
        .not()
        .isEmpty()
        .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    // Create an object with the data that the user submits
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
/************************************************************/
module.exports = router;
