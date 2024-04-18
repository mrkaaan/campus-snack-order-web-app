const express = require('express');
const { getMerchants } = require('../controllers/homePageController');

const router = express.Router();

router.route('/').get(getMerchants);

module.exports = router;
