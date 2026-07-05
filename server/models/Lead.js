const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'new',
  },
  source: {
    type: String,
    enum: ['referral', 'website', 'social', 'email', 'phone', 'event', 'other'],
    default: 'other',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  pipelineStage: {
    type: String,
    default: 'New Lead',
  },
  pipelinePosition: {
    type: Number,
    default: 0,
  },
  estimatedValue: {
    type: Number,
    default: 0,
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 10,
  },
  notes: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
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
  convertedToCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  lastContacted: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

leadSchema.index({ firstName: 'text', lastName: 'text', email: 'text', company: 'text' });
leadSchema.index({ status: 1, pipelineStage: 1, assignedTo: 1 });

leadSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

leadSchema.set('toJSON', { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Lead', leadSchema);
