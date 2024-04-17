const express = require('express');
const { getMerchants } = require('../controllers/merchantController');

const router = express.Router();

router.route('/').get(getMerchants);

module.exports = router;
