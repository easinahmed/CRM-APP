const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

const getPayments = async (req, res, next) => {
  try {
    const { status, customer, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (customer) query.customer = customer;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('invoice', 'invoiceNumber total')
      .populate('customer', 'firstName lastName email')
      .populate('createdBy', 'name')
      .sort('-paymentDate')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, payments, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create({ ...req.body, createdBy: req.user._id });
    const populated = await Payment.findById(payment._id)
      .populate('invoice', 'invoiceNumber total')
      .populate('customer', 'firstName lastName email');

    // Update invoice status if payment completes
    if (payment.status === 'completed') {
      await Invoice.findByIdAndUpdate(payment.invoice, { status: 'paid', paidDate: new Date() });
    }

    res.status(201).json({ success: true, payment: populated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPayments, createPayment };
