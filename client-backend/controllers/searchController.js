const db = require('../config/index');

// 搜索商品
exports.searchProducts = async (req, res) => {
  console.log(req)
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: "请输入搜索内容",
      data: null
    });
  }

  try {
    // 首先按关键字搜索商品，按月销量排序
    const productsQuery = `
            SELECT p.productId, p.name, p.description, p.salePrice, p.originalPrice, p.imagePath, p.monthlySales, p.merchantId
            FROM Products p
            WHERE p.name LIKE CONCAT('%', ?, '%') OR p.description LIKE CONCAT('%', ?, '%')
            ORDER BY p.monthlySales DESC; 
        `;
    const [products] = await db.query(productsQuery, [keyword, keyword]);

    // 为每个商品查询商家信息
    const results = await Promise.all(products.map(async (product) => {
      const merchantQuery = `
                SELECT m.merchantId, m.storeName, m.image, m.rating, m.description, m.mainDish
                FROM Merchants m
                WHERE m.merchantId = ?;
            `;
      const [merchants] = await db.query(merchantQuery, [product.merchantId]);
      return {
        product,
        merchant: merchants[0]  // 假设每个商品只对应一个商家
      };
    }));

    res.status(200).json({
      success: true,
      data: results,
      message: '搜索成功'
    });
  }  catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '搜索失败',
      data: null
    });
  }
};

exports.searchMerchants = async (req, res) => {
  const keyword = req.query.keyword || '';
  try {
    // 第一步：搜索商家
    const merchantSearchQuery = `
            SELECT merchantId, storeName, image, locationDescription, rating, description, mainDish
            FROM Merchants
            WHERE description LIKE CONCAT('%', ?, '%') OR mainDish LIKE CONCAT('%', ?, '%') OR storeName LIKE CONCAT('%', ?, '%');
        `;
    const [merchants] = await db.query(merchantSearchQuery, [keyword, keyword, keyword]);
    let merchantIds = merchants.map(merchant => merchant.merchantId);

    // 为每个商家查找最多五个销量最高的商品
    const merchantResults = await Promise.all(merchants.map(async (merchant) => {
      const productsQuery = `
                SELECT productId, name, description, imagePath, salePrice, originalPrice
                FROM Products
                WHERE merchantId = ?
                ORDER BY monthlySales DESC
                LIMIT 5;
            `;
      const [products] = await db.query(productsQuery, [merchant.merchantId]);
      return {
        ...merchant,
        products
      };
    }));

    // 第二步：搜索商品，排除已找到的商家
    const productSearchQuery = `
            SELECT productId, name, description, imagePath, salePrice, originalPrice, merchantId
            FROM Products
            WHERE (name LIKE CONCAT('%', ?, '%') OR description LIKE CONCAT('%', ?, '%'))
            AND merchantId NOT IN (?);
        `;
    const [additionalProducts] = await db.query(productSearchQuery, [keyword, keyword, merchantIds.length > 0 ? merchantIds : [0]]);

    // 按商家分类商品
    const additionalMerchants = {};
    additionalProducts.forEach(product => {
      if (!additionalMerchants[product.merchantId]) {
        additionalMerchants[product.merchantId] = {
          products: []
        };
      }
      additionalMerchants[product.merchantId].products.push(product);
      if (additionalMerchants[product.merchantId].products.length > 5) {
        additionalMerchants[product.merchantId].products.length = 5; // 确保不超过5个产品
      }
    });

    // 为新增商品的商家查询商家信息 (商家信息不符 但商品信息符合)
    const additionalMerchantIds = Object.keys(additionalMerchants);
    await Promise.all(additionalMerchantIds.map(async (merchantId) => {
      if (additionalMerchants[merchantId].products.length < 5) {
        // 如果商品不足5个，查询更多商品补足
        const fillProductsQuery = `
                    SELECT productId, name, description, imagePath, salePrice, originalPrice
                    FROM Products
                    WHERE merchantId = ? AND productId NOT IN (?)
                    ORDER BY monthlySales DESC
                    LIMIT ?;
                `;
        const needed = 5 - additionalMerchants[merchantId].products.length; // 还需要多少个商品
        const existingProductIds = additionalMerchants[merchantId].products.map(p => p.productId); // 已有的商品ID
        const [fillProducts] = await db.query(fillProductsQuery, [merchantId, existingProductIds, needed]); // 查询排除已有的商品 指定数量
        additionalMerchants[merchantId].products = additionalMerchants[merchantId].products.concat(fillProducts); // 添加商品数据到“新增商品商家”
      }
      // 查询商家信息
      const merchantInfoQuery = `
                SELECT merchantId, storeName, image, locationDescription, rating, description, mainDish
                FROM Merchants
                WHERE merchantId = ?;
            `;
      const [merchantInfo] = await db.query(merchantInfoQuery, [merchantId]);
      additionalMerchants[merchantId] = {...merchantInfo[0], products: additionalMerchants[merchantId].products}; // 整理“新增商品商家”
    }));

    // 组合所有结果并返回
    const results = merchantResults.concat(Object.values(additionalMerchants));

    res.status(200).json({
      success: true,
      data: results,
      message: '搜索成功'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '搜索失败',
      data: null
    });
  }
};

