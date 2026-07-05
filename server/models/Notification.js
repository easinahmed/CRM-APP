const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'task_assigned', 'task_due', 'meeting_invite',
      'lead_assigned', 'status_change', 'invoice_created',
      'payment_received', 'comment', 'system',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['customer', 'lead', 'deal', 'invoice', 'task', 'meeting', 'none'],
      default: 'none',
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
}, {
  timestamps: true,
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
