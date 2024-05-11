const db = require('../config/index');

// 获取商家的所有商品，按分类排序
exports.getMerchantProducts = async (req, res) => {
  const merchantId = req.query.merchantId;

  try {
    const query = `
      SELECT p.*, pc.name as categoryName
      FROM Products p
      JOIN MerchantProductMap mpm ON p.productId = mpm.productId
      JOIN ProductCategories pc ON mpm.categoryId = pc.categoryId
      WHERE p.merchantId = ? AND mpm.merchantId = ?
      ORDER BY pc.categoryId, p.type
    `;
    const [products] = await db.query(query, [merchantId, merchantId]);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "找不到该商家的产品"
      });
    }

    res.status(200).json({
      success: true,
      message: "查找商品成功",
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "找不到该商家商品",
      error: error.message
    });
  }
};

// 添加或更新商品
exports.saveProduct = async (req, res) => {
  const {
    isNew, productId, merchantId, type, name, description,
    salePrice, originalPrice, imagePath, stock, categoryName, categoryDescription
  } = req.body;

  try {
    // 检查分类是否存在，如果不存在则创建新的分类
    const [category] = await db.query(`
      SELECT categoryId FROM ProductCategories WHERE name = ? AND merchantId = ?`,
      [categoryName, merchantId]
    );
    let categoryId;
    if (category.length === 0) {
      // 插入新分类
      const [result] = await db.query(`
        INSERT INTO ProductCategories (name, merchantId, description) VALUES (?, ?, ?)`,
        [categoryName, merchantId, categoryDescription]
      );
      categoryId = result.insertId;
    } else {
      categoryId = category[0].categoryId;
    }

    if (isNew) {
      // 插入新商品
      const [insertResult] = await db.query(`
        INSERT INTO Products (merchantId, type, name, description, salePrice, originalPrice, imagePath, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [merchantId, type, name, description, salePrice, originalPrice, imagePath, stock]
      );
      const newProductId = insertResult.insertId;

      // 关联新商品与分类
      await db.query(`
        INSERT INTO MerchantProductMap (merchantId, categoryId, productId)
        VALUES (?, ?, ?)`,
        [merchantId, categoryId, newProductId]
      );

      res.status(201).json({
        success: true,
        message: "商品添加成功",
        productId: newProductId
      });
    } else {
      // 更新现有商品信息
      await db.query(`
        UPDATE Products
        SET type = ?, name = ?, description = ?, salePrice = ?, originalPrice = ?, imagePath = ?, stock = ?
        WHERE productId = ?`,
        [type, name, description, salePrice, originalPrice, imagePath, stock, productId]
      );

      // 检查现有的商品与分类的关联
      const [existingMap] = await db.query(`
        SELECT * FROM MerchantProductMap WHERE productId = ? AND merchantId = ?`,
        [productId, merchantId]
      );
      if (existingMap.length === 0) {
        // 创建新的关联（商品与分类）
        await db.query(`
          INSERT INTO MerchantProductMap (merchantId, categoryId, productId)
          VALUES (?, ?, ?)`,
          [merchantId, categoryId, productId]
        );
      } else {
        // 更新已有的关联
        await db.query(`
          UPDATE MerchantProductMap SET categoryId = ?
          WHERE productId = ? AND merchantId = ?`,
          [categoryId, productId, merchantId]
        );
      }

      res.status(200).json({
        success: true,
        message: "商品更新成功"
      });
    }
  } catch (error) {
    console.error('保存商品时发生错误:', error);
    res.status(500).json({
      success: false,
      message: "保存商品失败",
      error: error.message
    });
  }
};


