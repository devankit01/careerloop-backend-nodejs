const Certification = require('../models/Certification');

exports.createCertification = async (req, res) => {
  try {
    const { name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, description } = req.body;
    const student_id = req.query.student_id;

    //  validation
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing student_id in query parameters',
        data: null,
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Missing certification name in request body',
        data: null,
      });
    }

    //  Create certification
    const cert = await Certification.create({
      student_id,
      name,
      issuing_organization,
      issue_date,
      expiration_date,
      credential_id,
      credential_url,
      description,
    });
    res.status(201).json({
      success: true,
      message: 'Certification created successfully',
      data: cert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create certification',
      error: error.message,
      data: null,
    });
  }
};

// Read All
exports.getAllCertifications = async (req, res) => {
  try {
    const student_id = req.query.student_id;
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing student_id in query parameters',
        data: null,
      });
    }

    const where = { student_id };
    if (req.query.id) {
        where.id = req.query.id; }

    const certs = await Certification.findAll({ where });

    res.status(200).json({
      success: true,
      message: 'Certifications fetched successfully',
      data: certs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certifications',
      error: error.message,
      data: null,
    });
  }
};


// Read One
exports.getCertificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing student_id in query parameters',
        data: null,
      });
    }

    const cert = await Certification.findOne({
      where: {
        id,
        student_id,
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found for the provided student',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certification fetched successfully',
      data: cert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certification',
      error: error.message,
      data: null,
    });
  }
};


// Update
exports.updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing student_id in query parameters',
        data: null,
      });
    }

    const cert = await Certification.findOne({
      where: {
        id,
        student_id,
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found for the provided student',
        data: null,
      });
    }

    await cert.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      data: cert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update certification',
      error: error.message,
      data: null,
    });
  }
};


// Delete
exports.deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing student_id in query parameters',
        data: null,
      });
    }

    const cert = await Certification.findOne({
      where: {
        id,
        student_id,
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found for the provided student',
        data: null,
      });
    }

    await cert.destroy();

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete certification',
      error: error.message,
      data: null,
    });
  }
};


