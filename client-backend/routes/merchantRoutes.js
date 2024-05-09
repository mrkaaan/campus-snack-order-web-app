const express = require('express');
const merchants = require('../controllers/merchantsController');
const jwtAuth = require('../middlewares/jwtAuth');

const router = express.Router();

router.get('/', merchants.getMerchants);
router.get('/page', merchants.getMerchantsPaging);
router.get('/:merchantId', merchants.getMerchant); // 获取特定商家的信息
router.get('/:merchantId/products', merchants.getMerchantProducts); // 获取特定商家的所有商品

module.exports = router;
