const Document = require('../models/Document');
const { Op } = require('sequelize');

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll();
    return res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
};

// Get documents by jobseeker_id
exports.getDocumentsByJobseekerId = async (req, res) => {
  try {
    const { jobseekerId } = req.params;
    
    const documents = await Document.findAll({
      where: { jobseeker_id: jobseekerId }
    });
    
    return res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents by jobseeker ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch document',
      error: error.message
    });
  }
};

// Create a new document
exports.createDocument = async (req, res) => {
  try {
    const { 
      file_url, 
      document_category, 
      description, 
      title, 
      jobseeker_id, 
      imported_job_id 
    } = req.body;
    
    if (!file_url || !jobseeker_id) {
      return res.status(400).json({
        success: false,
        message: 'file_url and jobseeker_id are required fields'
      });
    }
    
    const newDocument = await Document.create({
      file_url,
      document_category,
      description,
      title,
      jobseeker_id,
      imported_job_id
    });
    
    return res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: newDocument
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create document',
      error: error.message
    });
  }
};

// Update a document
exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      file_url, 
      document_category, 
      description, 
      title, 
      jobseeker_id, 
      imported_job_id 
    } = req.body;
    
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    await document.update({
      file_url,
      document_category,
      description,
      title,
      jobseeker_id,
      imported_job_id
    });
    
    return res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update document',
      error: error.message
    });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findByPk(id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    await document.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
}; 