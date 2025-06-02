const express = require('express');
const router = express.Router();
const linkedDocumentController = require('../controllers/linkedDocumentController');

router.post('/', linkedDocumentController.linkDocument);

module.exports = router;
