const db = require('../config/db');

const Merchant = {
  getAllMerchants: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM Merchants", (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

  getMerchantInfo: (merchantId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Merchants WHERE merchantId = ?";
      db.query(query, [merchantId], (error, results) => {
        if (error) reject(error);
        else {
          const merchant = results[0] || null; // 如果结果为空数组，则返回空对象
          resolve(merchant);
        }
      });
    });
  },

  // getMerchantProducts: (merchantId) => {
  //   return new Promise((resolve, reject) => {
  //     const query = `
  //     SELECT c.name AS categoryName, p.*
  //     FROM Products p
  //     JOIN MerchantProductCategories mpc ON p.productId = mpc.productId
  //     JOIN ProductCategories c ON mpc.ProductCategoryId = c.ProductCategoryId
  //     WHERE p.merchantId = ?
  //     ORDER BY c.name, p.name;
  //   `;
  //     db.query(query, [merchantId], (error, results) => {
  //       if (error) reject(error);
  //       else resolve(results);
  //     });
  //   });
  // },


  getMerchantCategories(merchantId) {
    // 执行SQL查询获取商品分类
    return new Promise((resolve, reject) => {
      const query = `
        SELECT pc.categoryId, pc.name, pc.isCondimentCategory, pc.description
        FROM ProductCategories pc
        WHERE pc.merchantId = ?;
      `;
      db.query(query,[merchantId], (error, results) => {
        if (error) reject(error)
        else resolve(results)
      })
    })
  },

  getProductsForCategory(merchantId, categoryId) {
    // 执行SQL查询获取分类下的所有商品和套餐
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.productId,p.type,p.baseProductId,p.name,p.portions,p.description,p.monthlySales,p.salePrice,p.originalPrice,p.imagePath,p.stock
        FROM Products p
        JOIN MerchantProductMap mpm ON p.productId = mpm.productId
        WHERE mpm.merchantId = ? AND mpm.categoryId = ?;
      `;
      db.query(query,[merchantId, categoryId], (error, results) => {
        if (error) reject(error)
        else resolve(results)
      })
    })
  },

  getCondimentsForCategory(merchantId, categoryId) {
    // 执行SQL查询获取配料分类下的所有可单卖的配料
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.optionId, o.name, o.description, o.price AS salePrice, o.originalPrice, o.image, o.stock, o.monthlySales
        FROM Options o
        WHERE o.merchantId = ? AND EXISTS (
          SELECT 1 FROM ProductCategories pc
          WHERE pc.merchantId = o.merchantId AND pc.categoryId = ? AND  pc.isCondimentCategory = TRUE AND pc.isCondimentCategory = o.isAloneAvailableSale
        );
      `;
      db.query(query,[merchantId, categoryId], (error, results) => {
        if (error) reject(error)
        else resolve(results)
      })
    })
  },

  getBundleComponents(bundleId, merchantId) {
    // 执行SQL查询获取套餐内的商品
    return new Promise((resolve, reject) => {
      const query = `
        SELECT bp.category, p.*
        FROM BundleProductsMap bp
        JOIN Products p ON bp.productId = p.productId
        WHERE bp.bundleId = ? AND bp.merchantId = ?;
      `;
      db.query(query,[bundleId, merchantId], (error, results) => {
        if (error) reject(error)
        else resolve(results)
      })
    })
  },

  getProductOptionCategories(productId) {
    // 执行SQL查询获取商品的所有配料分类
    return new Promise((resolve, reject) => {
      const query = `
        SELECT po.optionTypeId, po.optionTypeName AS name, po.isMultipleChoice, po.price
        FROM productoptionsmap po
        JOIN products p ON p.productId = po.productId
        WHERE p.productId = ?
      `;
      db.query(query,[productId], (error, results) => {
        if (error) reject(error)
        else resolve(results)
      })
    })
  },

  getOptionsForProductOptionCategory(productId, optionTypeId) {
    // 执行SQL查询获取配料分类下的具体配料
    return new Promise((resolve, reject) => {
      const query = `
        SELECT o.name, o.description, o.price, ot.isFixed, ot.price AS customPrice
        FROM ProductOptionsMap pom
        JOIN OptionTypes ot ON pom.optionTypeId = ot.optionTypeId
        JOIN Options o ON ot.optionId = o.optionId
        WHERE pom.productId = ? AND pom.optionTypeId = ?;
      `;
      db.query(query,[productId, optionTypeId], (error, results) => {
        if (error) reject(error)
        else resolve(results)
      })
    })
  },

};

module.exports = Merchant;
