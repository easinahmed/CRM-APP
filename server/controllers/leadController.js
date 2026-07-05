const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

const getLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, priority, pipelineStage, sort = '-createdAt' } = req.query;
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
    if (priority) query.priority = priority;
    if (pipelineStage) query.pipelineStage = pipelineStage;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, leads, pagination: { total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) } });
  } catch (error) {
    next(error);
  }
};

const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user._id });

    await Activity.create({
      type: 'lead_created',
      description: `Lead ${lead.firstName} ${lead.lastName} was created`,
      relatedTo: { type: 'lead', id: lead._id },
      performedBy: req.user._id,
    });

    res.status(201).json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('assignedTo', 'name email avatar');

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    await Activity.create({
      type: 'status_change',
      description: `Lead ${lead.firstName} ${lead.lastName} was updated`,
      relatedTo: { type: 'lead', id: lead._id },
      performedBy: req.user._id,
    });

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};

const convertToCustomer = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const customer = await Customer.create({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      title: lead.title,
      source: lead.source,
      notes: lead.notes,
      tags: lead.tags,
      assignedTo: lead.assignedTo,
      createdBy: req.user._id,
    });

    lead.status = 'won';
    lead.convertedToCustomer = customer._id;
    await lead.save();

    await Activity.create({
      type: 'lead_conversion',
      description: `Lead ${lead.firstName} ${lead.lastName} converted to customer`,
      relatedTo: { type: 'customer', id: customer._id },
      performedBy: req.user._id,
    });

    res.json({ success: true, customer, lead });
  } catch (error) {
    next(error);
  }
};

const updatePipelinePosition = async (req, res, next) => {
  try {
    const { stage, position } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { pipelineStage: stage, pipelinePosition: position },
      { new: true }
    );

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    await Activity.create({
      type: 'deal_moved',
      description: `Lead moved to ${stage} in pipeline`,
      relatedTo: { type: 'lead', id: lead._id },
      performedBy: req.user._id,
    });

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead, convertToCustomer, updatePipelinePosition };
