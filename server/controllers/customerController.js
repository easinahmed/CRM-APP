const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sort = '-createdAt', ...filters } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.source) query.source = filters.source;
    if (filters.tags) query.tags = { $in: filters.tags.split(',') };

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      customers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const activities = await Activity.find({ 'relatedTo.id': customer._id })
      .populate('performedBy', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    res.json({ success: true, customer, activities });
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user._id,
    });

    await Activity.create({
      type: 'customer_created',
      description: `Customer ${customer.firstName} ${customer.lastName} was created`,
      relatedTo: { type: 'customer', id: customer._id },
      performedBy: req.user._id,
    });

    res.status(201).json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email avatar');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await Activity.create({
      type: 'status_change',
      description: `Customer ${customer.firstName} ${customer.lastName} was updated`,
      relatedTo: { type: 'customer', id: customer._id },
      performedBy: req.user._id,
    });

    res.json({ success: true, customer });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
