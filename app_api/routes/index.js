const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

router.get('/trips/:tripCode', tripsController.tripByCode);

module.exports = router;
