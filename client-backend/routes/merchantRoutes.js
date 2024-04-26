const express = require('express');
const { getMerchants, getMerchantProducts  } = require('../controllers/merchantsController');

const router = express.Router();

router.route('/').get(getMerchants);
router.get('/:merchantId/products', getMerchantProducts);  // 获取特定商家的所有商品

module.exports = router;
