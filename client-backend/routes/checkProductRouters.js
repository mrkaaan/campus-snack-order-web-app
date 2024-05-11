const express = require('express');
const check = require('../controllers/checkProductController');

const router = express.Router();

router.route('/getProducts').get(check.getMerchantProducts);
router.route('/saveProduct').post(check.saveProduct);

module.exports = router;
