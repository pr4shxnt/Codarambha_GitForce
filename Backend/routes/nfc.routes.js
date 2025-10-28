const express = require('express');
const router = express.Router();
const nfcController = require('../controllers/nfc.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Test NFC read endpoint - no auth required for testing
router.post('/read-test', nfcController.testNfcRead);

// NFC authentication endpoint
router.post('/authenticate', nfcController.nfcAuthenticate);

module.exports = router;