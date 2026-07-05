const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Invoice = require('../models/Invoice');
const Task = require('../models/Task');
const Meeting = require('../models/Meeting');
const Activity = require('../models/Activity');

const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalCustomers,
      newCustomersThisMonth,
      totalLeads,
      activeLeads,
      totalInvoices,
      paidInvoices,
      totalRevenue,
      monthlyRevenue,
      pendingTasks,
      upcomingMeetings,
      recentActivities,
      customerGrowthData,
      revenueData,
      leadsByStatus,
      customersByStatus,
    ] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ createdAt: { $gte: thisMonth } }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: { $nin: ['won', 'lost'] } }),
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'paid' }),
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid', paidDate: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Task.countDocuments({ status: { $ne: 'done' } }),
      Meeting.countDocuments({ startTime: { $gte: now }, status: 'scheduled' }).sort('startTime').limit(5),
      Activity.find().populate('performedBy', 'name avatar').sort('-createdAt').limit(10),
      Customer.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$paidDate' } }, total: { $sum: '$total' } } },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Customer.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const conversionRate = totalLeads > 0
      ? ((await Lead.countDocuments({ status: 'won' })) / totalLeads * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      stats: {
        totalCustomers,
        newCustomersThisMonth,
        totalLeads,
        activeLeads,
        totalInvoices,
        paidInvoices,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingTasks,
        upcomingMeetings,
        conversionRate: Number(conversionRate),
      },
      recentActivities,
      customerGrowth: customerGrowthData,
      revenueTrend: revenueData,
      leadsByStatus,
      customersByStatus,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
