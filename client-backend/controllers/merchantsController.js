// Mock data
const Merchant = require('../models/Merchant');

exports.getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.getAllMerchants();
    const data = merchants.map(merchant => ({
      ...merchant,
      priceRange: [merchant.priceRangeLow, merchant.priceRangeHigh],
      mainDish: merchant.mainDish.split(','),
      hasSpecialPrice: !!merchant.hasSpecialPrice,
      hasDiscount: !!merchant.hasDiscount
    }));
    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant data",
      data: null
    });
  }
};

exports.getMerchant = async (req, res) => {
  const merchantId = req.params.merchantId;
  try {
    const merchant = await Merchant.getMerchant(merchantId);
    if (!merchant) {
      res.status(404).json({
        success: false,
        message: "Merchant not found",
        data: null
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Merchant retrieved successfully",
      data: merchant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant",
      data: null
    });
  }
};


exports.getMerchantProducts = async (req, res) => {
  const merchantId = req.params.merchantId;
  try {
    const products = await Merchant.getMerchantProducts(merchantId);
    const categorizedProducts = products.reduce((acc, product) => {
      const category = acc.find(c => c.categoryName === product.categoryName);
      if (category) {
        category.products.push(product);
      } else {
        acc.push({ categoryName: product.categoryName, products: [product] });
      }
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: categorizedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      data: null
    });
  }
};
