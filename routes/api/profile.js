// will containe routes that have anuthing to do with routes
// fetching them, adding them, updating them

const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
//const checkObjectId = require('../../middleware/checkObjectId');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
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
      //check if profile exists
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
//checkObjectId('user_id'),
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
    // Remove users posts
    await Post.deleteMany({ user: req.user.id });
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
/**
 * @route    DELETE api/profile/experience/:exp_id
 * @desc     Delete user profile experience
 * @access   PRIVATE
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // getting profile of the logged in user
    const profile = await Profile.findOne({ user: req.user.id });

    // Getting the index of the exp which will be deleted
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    PUT api/profile/education
 * @desc     Add profile education
 * @access   PRIVATE
 */
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
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
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    // Create an object with the data that the user submits (school: school)
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
/************************************************************/
/**
 * @route    DELETE api/profile/education/:edu_id
 * @desc     Delete user profile education
 * @access   PRIVATE
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // getting profile of the logged in user
    const profile = await Profile.findOne({ user: req.user.id });

    // Getting the index of the education which will be deleted
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('500 Internal server error');
  }
});
/************************************************************/
/**
 * @route    GET api/profile/github/:username
 * @desc     Get user repos from Github
 * @access   Public
 */
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});
module.exports = router;
