const db = require('../config/index');

const Merchant = {
  getAllMerchants: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM Merchants", (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

  getMerchant: (merchantId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Merchants WHERE id = ?";
      db.query(query, [merchantId], (error, results) => {
        if (error) reject(error);
        else {
          const merchant = results[0] || null; // 如果结果为空数组，则返回空对象
          resolve(merchant);
        }
      });
    });
  },

  getMerchantProducts: (merchantId) => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT c.name AS categoryName, p.*
      FROM Products p
      JOIN MerchantProductCategories mpc ON p.id = mpc.productId
      JOIN Categories c ON mpc.categoryId = c.id
      WHERE p.merchantId = ?
      ORDER BY c.name, p.name;
    `;
      db.query(query, [merchantId], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },
};

module.exports = Merchant;
