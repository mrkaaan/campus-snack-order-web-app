const Merchant = require('../models/Merchant');
const db = require('../config/index');

exports.getMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.getAllMerchants();
    const data = merchants.map(merchant => ({
      ...merchant,
      priceRange: [merchant.priceRangeLow, merchant.priceRangeHigh],
      mainDish: merchant.mainDish.split(','),
      hasSpecialPrice: !!merchant.hasSpecialPrice,
      hasDiscountInfo: !!merchant.hasDiscountInfo
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

exports.getMerchantsPaging = async (req, res) => {
  const page = parseInt(req.params.page) || 1; // 获取当前页码，默认为第一页
  const limit = parseInt(req.params.limit) || 10; // 每页条数，默认为10
  const offset = (page - 1) * limit; // 计算跳过的记录数

  try {
    const { merchants, totalItems } = await Merchant.getAllMerchantsPaging(offset, limit);
    const totalPages = Math.ceil(totalItems / limit); // 计算总页数

    const data = merchants.map(merchant => ({
      ...merchant,
      priceRange: [merchant.priceRangeLow, merchant.priceRangeHigh],
      mainDish: merchant.mainDish.split(','),
      hasSpecialPrice: !!merchant.hasSpecialPrice,
      hasDiscountInfo: !!merchant.hasDiscountInfo
    }));

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: {
        merchants: data,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant data",
      data: error
    });
  }
};

exports.getMerchant = async (req, res) => {
  const merchantId = req.params.merchantId;
  try {
    const merchant = await Merchant.getMerchantInfo(merchantId);
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
      data: {
        ...merchant,
        priceRange: [merchant.priceRangeLow, merchant.priceRangeHigh],
        mainDish: merchant.mainDish.split(','),
        hasSpecialPrice: !!merchant.hasSpecialPrice,
        hasDiscountInfo: !!merchant.hasDiscountInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant",
      data: null
    });
  }
};

// 获取商家所有分类商品内容
exports.getMerchantProductsByCate = async (req, res) => {
  const merchantId = req.params.merchantId;
  try {
    const merchantInfo = await Merchant.getMerchantInfo(merchantId); // 商品信息
    const categories = await Merchant.getMerchantCategories(merchantId); // 分类

    for (const category of categories) { // 遍历每一个分类
      if (category.isCondimentCategory) { // 配料分类
        category.items = await Merchant.getCondimentsForCategory(merchantId, category.categoryId); // 所有可以单买的配料
        for (const item of category.items) { // 添加折扣信息
          if (item.salePrice && item.originalPrice) {
            item.discountInfo = (item.salePrice / item.originalPrice).toFixed(2);
          } else {
            item.discountInfo = null;
          }
        }
      } else { // 普通分类
        category.items = await Merchant.getProductsForCategory(merchantId, category.categoryId); // 按分类查询商品数据
        for (const item of category.items) { // 遍历每一个商品
          if (item.type === 'bundle') { // 套餐类型商品
            item.products = await Merchant.getBundleComponents(item.productId, merchantId);
            if (item.salePrice && item.originalPrice) {
              item.discountInfo = (item.salePrice / item.originalPrice).toFixed(2);
            } else {
              item.discountInfo = null;
            }
            for (const product of item.products){
              if(product.type === 'product') {
                product.optionCategories = await Merchant.getProductOptionCategories(product.productId); // 获取当前商品 关联的 所有配菜分类
                for (const optionCategory of product.optionCategories) { // 遍历当前商品的 所有配菜分类
                  optionCategory.options = await Merchant.getOptionsForProductOptionCategory(product.productId, optionCategory.optionTypeId); // 获取当前商品的 当前配菜分类的 所有配菜信息
                  for (const option of optionCategory.options) { // 遍历当前配菜分类的 所有配菜信息
                    if (option.salePrice && option.originalPrice){
                      option.discountInfo = (option.salePrice / option.originalPrice).toFixed(2);
                    } else {
                      option.discountInfo = null;
                    }
                  }
                }
                if (product.salePrice && product.originalPrice){
                  product.discountInfo = (product.salePrice / product.originalPrice).toFixed(2);
                } else {
                  product.discountInfo = null;
                }
              }
            }

          } else { // 普通商品
            item.optionCategories = await Merchant.getProductOptionCategories(item.productId); // 获取当前商品 关联的 所有配菜分类
            for (const optionCategory of item.optionCategories) { // 遍历当前商品的 所有配菜分类
              optionCategory.options = await Merchant.getOptionsForProductOptionCategory(item.productId, optionCategory.optionTypeId); // 获取当前商品的 当前配菜分类的 所有配菜信息
              for (const option of optionCategory.options) { // 遍历当前配菜分类的 所有配菜信息
                if (option.salePrice && option.originalPrice){
                  // 保留两位小数
                  option.discountInfo = (option.salePrice / option.originalPrice).toFixed(2);
                } else {
                  option.discountInfo = null;
                }
              }
            }
            if (item.salePrice && item.originalPrice){
              item.discountInfo = (item.salePrice / item.originalPrice).toFixed(2);
            } else {
              item.discountInfo = null;
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        merchantId: merchantInfo.merchantId,
        merchantName: merchantInfo.storeName,
        productCategories: categories
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      data: null
    });
  }
};

// 获取商家的所有商品
exports.getMerchantProducts = async (req, res) => {
  const merchantId = req.params.merchantId;

  try {
    const query = `
      SELECT p.*, pc.name as categoryName
      FROM Products p
      JOIN ProductCategories pc ON p.merchantId = pc.merchantId AND p.productId = pc.categoryId
      WHERE p.merchantId = ?
      ORDER BY pc.categoryId, p.type
    `;
    const [products] = await db.query(query, [merchantId]);

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant products",
      error: error.message
    });
  }
};

// 更新商品信息
exports.updateProduct = async (req, res) => {
  const { productId, type, name, description, salePrice, originalPrice, imagePath, stock } = req.body;

  try {
    const query = `
      UPDATE Products
      SET type = ?, name = ?, description = ?, salePrice = ?, originalPrice = ?, imagePath = ?, stock = ?
      WHERE productId = ?
    `;
    await db.query(query, [type, name, description, salePrice, originalPrice, imagePath, stock, productId]);

    res.status(200).json({
      success: true,
      message: "Product updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// 添加新商品
exports.addProduct = async (req, res) => {
  const { merchantId, type, name, description, salePrice, originalPrice, imagePath, stock } = req.body;

  try {
    const query = `
      INSERT INTO Products (merchantId, type, name, description, salePrice, originalPrice, imagePath, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [merchantId, type, name, description, salePrice, originalPrice, imagePath, stock]);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};

