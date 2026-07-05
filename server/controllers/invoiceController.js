const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const { generateInvoiceNumber } = require('../utils/helpers');

const getInvoices = async (req, res, next) => {
  try {
    const { status, customer, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const query = {};
    if (status) query.status = status;
    if (customer) query.customer = customer;

    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .populate('customer', 'firstName lastName email company')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, invoices, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'firstName lastName email company phone address')
      .populate('createdBy', 'name');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const payments = await Payment.find({ invoice: invoice._id }).sort('-paymentDate');
    res.json({ success: true, invoice, payments });
  } catch (error) {
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber: generateInvoiceNumber(),
      createdBy: req.user._id,
    });
    const populated = await Invoice.findById(invoice._id).populate('customer', 'firstName lastName email company');
    res.status(201).json({ success: true, invoice: populated });
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('customer', 'firstName lastName email company');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice };
