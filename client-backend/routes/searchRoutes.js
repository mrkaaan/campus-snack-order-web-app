const express = require('express');
const searchController= require('../controllers/searchController');

const router = express.Router();

router.route('/products').get(searchController.searchProducts);
router.route('/merchants').get(searchController.searchMerchants);

module.exports = router;
