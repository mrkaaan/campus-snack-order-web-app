// Mock data
const merchants = require('../models/MerchantModel');

exports.getMerchants = (req, res) => {
  if (merchants.length > 0) {
    res.status(200).json({
      success: true,
      data: merchants
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'No products found'
    });
  }
};

