const express = require('express');
const { getMerchants, getMerchant, getMerchantProducts  } = require('../controllers/merchantsController');
const jwtAuth = require('../middlewares/jwtAuth');

const router = express.Router();

router.get('/', jwtAuth, getMerchants);
router.get('/:merchantId', jwtAuth, getMerchant); // 获取特定商家的信息
router.get('/:merchantId/products', jwtAuth, getMerchantProducts); // 获取特定商家的所有商品

module.exports = router;
