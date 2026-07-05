const express = require('express');
const router = express.Router();
const { getActivities, createActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getActivities)
  .post(protect, createActivity);

module.exports = router;
