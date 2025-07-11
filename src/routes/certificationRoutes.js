const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',protect, certificationController.createCertification);
router.get('/',protect, certificationController.getAllCertifications);
router.get('/:id',protect, certificationController.getCertificationById);
router.put('/:id',protect, certificationController.updateCertification);
router.delete('/:id',protect, certificationController.deleteCertification);

module.exports = router;