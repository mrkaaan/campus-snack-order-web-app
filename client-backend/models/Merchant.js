const db = require('../config/index');

const Merchant = {
  getMerchants: function(callback) {
    db.query("SELECT * FROM Merchants", callback);
  },

  getMerchantProducts: (merchantId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Products WHERE merchantId = ?";
      db.query(query, [merchantId], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  }
};

module.exports = Merchant;
