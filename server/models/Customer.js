const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 100,
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
    enum: ['active', 'inactive', 'lead', 'churned'],
    default: 'active',
  },
  source: {
    type: String,
    enum: ['referral', 'website', 'social', 'email', 'phone', 'other'],
    default: 'other',
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    default: '',
  },
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
  lastContacted: {
    type: Date,
    default: null,
  },
  leadScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  lifetimeValue: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

customerSchema.index({ firstName: 'text', lastName: 'text', email: 'text', company: 'text' });
customerSchema.index({ status: 1, assignedTo: 1, createdAt: -1 });

customerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);
