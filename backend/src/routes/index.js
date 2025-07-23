const express = require('express');
const router = express.Router();

// Import route modules
const apiRoutes = require('./api');

// Mount API routes
router.use('/', apiRoutes);

module.exports = router; 