const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'check', 'online', 'other'],
    default: 'credit_card',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed',
  },
  transactionId: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
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
}, {
  timestamps: true,
});

paymentSchema.index({ invoice: 1, customer: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
