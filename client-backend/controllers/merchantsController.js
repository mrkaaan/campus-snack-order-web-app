// Mock data
const Merchant = require('../models/Merchant');

exports.getMerchants = (req, res) => {
  Merchant.getMerchants((error, results) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving merchant data",
        data: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Data retrieved successfully",
        data: results.map(merchant => ({
          ...merchant,
          priceRange: [merchant.priceRangeLow, merchant.priceRangeHigh],
          mainDish: merchant.mainDish.split(','),
          hasSpecialPrice: !!merchant.hasSpecialPrice,
          hasDiscount: !!merchant.hasDiscount
        }))
      });
    }
  });
};

exports.getMerchantProducts = async (req, res) => {
  const merchantId = req.params.merchantId;
  try {
    const products = await Merchant.getMerchantProducts(merchantId);
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      data: null
    });
  }
};
