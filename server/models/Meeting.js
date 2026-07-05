const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['call', 'video', 'in_person', 'other'],
    default: 'video',
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required'],
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  location: {
    type: String,
    default: '',
  },
  meetingLink: {
    type: String,
    default: '',
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['customer', 'lead', 'deal', 'none'],
      default: 'none',
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null,
  },
}, {
  timestamps: true,
});

meetingSchema.index({ startTime: 1, status: 1, createdBy: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);
