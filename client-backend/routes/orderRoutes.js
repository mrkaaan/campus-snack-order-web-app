const express = require('express');
const orderController= require('../controllers/orderController');

const router = express.Router();

router.route('/insert').post(orderController.createOrder);
router.route('/search').get(orderController.searchOrders);
router.route('/updateOrder').post(orderController.updateOrder);
router.route('/deleteOrder').post(orderController.deleteOrder);
router.route('/getMerchantOrder/:merchantId').get(orderController.getMerchantOrders);
router.route('/getUserOrder/:userId').get(orderController.getUserOrders);

module.exports = router;
