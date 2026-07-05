const Activity = require('../models/Activity');

const getActivities = async (req, res, next) => {
  try {
    const { relatedType, relatedId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (relatedType && relatedId) {
      query['relatedTo.type'] = relatedType;
      query['relatedTo.id'] = relatedId;
    }

    const total = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .populate('performedBy', 'name email avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, activities, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const activity = await Activity.create({ ...req.body, performedBy: req.user._id });
    res.status(201).json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivities, createActivity };
