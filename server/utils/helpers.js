const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const paginateQuery = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

const buildFilterQuery = (filters, allowedFields) => {
  const query = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '' && allowedFields.includes(key)) {
      if (key === 'search') {
        query.$or = [
          { firstName: { $regex: value, $options: 'i' } },
          { lastName: { $regex: value, $options: 'i' } },
          { email: { $regex: value, $options: 'i' } },
          { company: { $regex: value, $options: 'i' } },
        ];
      } else if (key === 'minValue') {
        query.estimatedValue = { ...query.estimatedValue, $gte: Number(value) };
      } else if (key === 'maxValue') {
        query.estimatedValue = { ...query.estimatedValue, $lte: Number(value) };
      } else if (key === 'startDate') {
        query.createdAt = { ...query.createdAt, $gte: new Date(value) };
      } else if (key === 'endDate') {
        query.createdAt = { ...query.createdAt, $lte: new Date(value) };
      } else {
        query[key] = value;
      }
    }
  }
  return query;
};

module.exports = { generateInvoiceNumber, paginateQuery, buildFilterQuery };
