const LinkedDocument = require('../models/LinkedDocument');

// Link a document
exports.linkDocument = async (req, res) => {
  try {
    const { document_id, job_id } = req.body;
    if (!document_id || !job_id) {
      return res.status(400).json({ success: false, message: 'document_id and job_id are required' });
    }
    const linkedDoc = await LinkedDocument.create({ document_id, job_id });
    return res.status(201).json({ success: true, data: linkedDoc });
  } catch (error) {
    console.error('Error linking document:', error);
    return res.status(500).json({ success: false, message: 'Failed to link document', error: error.message });
  }
};
