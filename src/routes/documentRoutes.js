const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// GET all documents
router.get('/', protect, documentController.getAllDocuments);

// GET documents by jobseeker ID
router.get('/jobseeker/:jobseekerId', protect, documentController.getDocumentsByJobseekerId);

// GET document by ID
router.get('/:id', protect, documentController.getDocumentById);

// POST create a new document
router.post('/', protect, documentController.createDocument);

// PUT update a document
router.put('/:id', protect, documentController.updateDocument);

// DELETE a document
router.delete('/:id', protect, documentController.deleteDocument);

module.exports = router; 