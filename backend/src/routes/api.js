const express = require('express');
const router = express.Router();

// Sample API endpoint
router.get('/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Aurora Backend!',
    timestamp: new Date().toISOString()
  });
});

// Sample POST endpoint
router.post('/data', (req, res) => {
  const { data } = req.body;
  res.json({ 
    message: 'Data received successfully',
    receivedData: data,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 