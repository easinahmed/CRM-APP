const express = require('express');
const router = express.Router();
const { getMeetings, getMeeting, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getMeetings)
  .post(protect, createMeeting);

router.route('/:id')
  .get(protect, getMeeting)
  .put(protect, updateMeeting)
  .delete(protect, deleteMeeting);

module.exports = router;
