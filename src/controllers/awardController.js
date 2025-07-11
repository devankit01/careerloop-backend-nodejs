const AwardAchievement = require('../models/AwardAchievement');

// Create
exports.createAward = async (req, res) => {
  try {
    const jobseeker_id = req.query.jobseeker_id;
    const { title, issuer, description, date } = req.body;

    if (!jobseeker_id) {
      return res.status(400).json({ success: false, message: 'Missing jobseeker_id in query', data: null });
    }

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required', data: null });
    }

    const award = await AwardAchievement.create({
      title,
      issuer,
      description,
      date,
      jobseeker_id,
    });

    res.status(201).json({
      success: true,
      message: 'Award created successfully',
      data: award,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create award',
      error: error.message,
      data: null,
    });
  }
};

// Get All (with optional id filter)
exports.getAllAwards = async (req, res) => {
  try {
    const jobseeker_id = req.query.jobseeker_id;
    if (!jobseeker_id) {
      return res.status(400).json({ success: false, message: 'Missing jobseeker_id in query', data: null });
    }

    const where = { jobseeker_id };
    if (req.query.id) where.id = req.query.id;

    const awards = await AwardAchievement.findAll({ where });

    res.status(200).json({
      success: true,
      message: 'Awards fetched successfully',
      data: awards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch awards',
      error: error.message,
      data: null,
    });
  }
};

// Get One
exports.getAwardById = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobseeker_id } = req.query;

    if (!jobseeker_id) {
      return res.status(400).json({ success: false, message: 'Missing jobseeker_id in query', data: null });
    }

    const award = await AwardAchievement.findOne({
      where: {
        id,
        jobseeker_id,
      },
    });

    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found', data: null });
    }

    res.status(200).json({
      success: true,
      message: 'Award fetched successfully',
      data: award,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch award',
      error: error.message,
      data: null,
    });
  }
};

// Update
exports.updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobseeker_id } = req.query;

    if (!jobseeker_id) {
      return res.status(400).json({ success: false, message: 'Missing jobseeker_id in query', data: null });
    }

    const award = await AwardAchievement.findOne({
      where: {
        id,
        jobseeker_id,
      },
    });

    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found for the provided jobseeker', data: null });
    }

    await award.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Award updated successfully',
      data: award,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update award',
      error: error.message,
      data: null,
    });
  }
};

// Delete
exports.deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobseeker_id } = req.query;

    if (!jobseeker_id) {
      return res.status(400).json({ success: false, message: 'Missing jobseeker_id in query', data: null });
    }

    const award = await AwardAchievement.findOne({
      where: {
        id,
        jobseeker_id,
      },
    });

    if (!award) {
      return res.status(404).json({ success: false, message: 'Award not found for the provided jobseeker', data: null });
    }

    await award.destroy();

    res.status(200).json({
      success: true,
      message: 'Award deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete award',
      error: error.message,
      data: null,
    });
  }
};
