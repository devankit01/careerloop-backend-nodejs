const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',protect, awardController.createAward);
router.get('/',protect, awardController.getAllAwards);
router.get('/:id',protect, awardController.getAwardById);
router.put('/:id',protect, awardController.updateAward);
router.delete('/:id',protect, awardController.deleteAward);

module.exports = router;