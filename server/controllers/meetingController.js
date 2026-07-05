const Meeting = require('../models/Meeting');

const getMeetings = async (req, res, next) => {
  try {
    const { startDate, endDate, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    if (status) query.status = status;

    const total = await Meeting.countDocuments(query);
    const meetings = await Meeting.find(query)
      .populate('attendees', 'name email avatar')
      .populate('createdBy', 'name')
      .sort('startTime')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, meetings, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('attendees', 'name email avatar')
      .populate('createdBy', 'name');
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, meeting });
  } catch (error) {
    next(error);
  }
};

const createMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.create({ ...req.body, createdBy: req.user._id });
    const populated = await Meeting.findById(meeting._id)
      .populate('attendees', 'name email avatar')
      .populate('createdBy', 'name');
    res.status(201).json({ success: true, meeting: populated });
  } catch (error) {
    next(error);
  }
};

const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('attendees', 'name email avatar');
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, meeting });
  } catch (error) {
    next(error);
  }
};

const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    res.json({ success: true, message: 'Meeting deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMeetings, getMeeting, createMeeting, updateMeeting, deleteMeeting };
