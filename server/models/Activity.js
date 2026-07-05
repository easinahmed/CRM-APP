const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'note', 'call', 'email', 'meeting', 'task', 'invoice',
      'payment', 'status_change', 'lead_conversion', 'file_upload',
      'login', 'customer_created', 'lead_created', 'deal_moved',
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
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
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

activitySchema.index({ relatedTo: 1, createdAt: -1 });
activitySchema.index({ performedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
