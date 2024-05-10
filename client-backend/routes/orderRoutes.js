const express = require('express');
const orderController= require('../controllers/orderController');

const router = express.Router();

router.route('/insert').post(orderController.createOrder);
router.route('/:merchantId/getOrder').get(orderController.getMerchantOrders);

module.exports = router;
