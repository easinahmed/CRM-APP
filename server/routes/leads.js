const express = require('express');
const router = express.Router();
const {
  getLeads, getLead, createLead, updateLead, deleteLead,
  convertToCustomer, updatePipelinePosition,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router.route('/:id')
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

router.put('/:id/convert', protect, convertToCustomer);
router.put('/:id/pipeline', protect, updatePipelinePosition);

module.exports = router;
