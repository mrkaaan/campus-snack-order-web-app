const db = require('../config/index');
const crypto = require('crypto');
const moment = require('moment');

function generateOrderNumber(userId, merchantId, orderTime) {
  // 将 userId 和 merchantId 格式化为固定长度的字符串
  const formattedUserId = userId.toString().padStart(8, '0'); // 假设用户ID最长为6位，不足位数的在左侧补0
  const formattedMerchantId = merchantId.toString().padStart(8, '0'); // 假设商家ID最长为6位，不足位数的在左侧补0
  // 将 orderTime 格式化为时间戳的字符串
  const timestamp = Math.floor(new Date(orderTime).getTime() / 1000).toString(); // 将 orderTime 转换为时间戳，以秒为单位
  // 组合成订单编号，假设订单编号总长度为16位
  const orderNumber = formattedMerchantId + formattedUserId +  timestamp;

  return orderNumber;
}

// 创建订单
exports.createOrder = async (req, res) => {
  const { orders  } = req.body; // 从请求体中获取订单数据
  console.log(orders)
  if (!orders || orders.length === 0) {
    return res.status(400).json({
      success: false,
      message: "请传入订单数据"
    });
  }
  try {

    const today = moment().format('YYYY-MM-DD');
    const pickupNumbers = {}; // 存储每个商家的起始取餐号
    const orderIds = []; // 存储生成的订单号

    for (const order of orders) {
      const orderTime = new Date();
      const { userId,  merchantId,  storeName,  payStatus, salePrice, originalPrice, discount, items } = order

      // 为每个商家计算取餐号
      if (!pickupNumbers[merchantId]) {
        const [countResult] = await db.query('SELECT COUNT(*) AS count FROM Orders WHERE merchantId = ? AND orderDate = ?', [merchantId, today]);
        pickupNumbers[merchantId] = countResult[0].count + 1; // 当天该商家的订单数量加1作为起始取餐号
      }

      const orderId = generateOrderNumber(userId, merchantId, orderTime);
      orderIds.push(orderId);
      const pickupNumber = pickupNumbers[merchantId]; // 获取当前商家的取餐号

      await db.query('INSERT INTO Orders (orderId, userId, merchantId, storeName, payStatus, orderTime, salePrice, originalPrice, discount, pickupNumber, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, userId, merchantId, storeName, payStatus, orderTime, salePrice, originalPrice, discount, pickupNumber, today]);

      // 批量插入订单详细信息
      const details = items.map(item => [orderId, item.productId, item.name, item.quantity, item.salePrice, item.originalPrice, item.discount, item.totalSalePrice, item.totalOriginalPrice, item.totalDiscount]);
      await db.query('INSERT INTO OrderDetails (orderId, productId, productName, quantity, salePrice, originalPrice, discount, totalSalePrice, totalOriginalPrice, totalDiscount) VALUES ?', [details]);
    }
    res.status(201).json({
      success: true,
      message: "成功创建订单",
      data: { orders:orderIds }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "创建订单出错",
      error: error.message
    });
  }
};

// 分页读取指定商家的所有订单
exports.getMerchantOrdersPaging = async (req, res) => {
  const merchantId = parseInt(req.params.merchantId, 10); // 从请求参数中获取商家ID
  const page = parseInt(req.query.page) || 1; // 获取当前页码
  const limit = parseInt(req.query.limit) || 10; // 每页显示的订单数量
  const offset = (page - 1) * limit; // 计算跳过的记录数

  try {
    console.log('merchantId', merchantId)
    // 获取指定商家所有订单，按时间排序
    const ordersQuery = `
      SELECT orderId, orderTime, userId, payStatus, mealStatus, salePrice, originalPrice, discount, pickupNumber
      FROM Orders
      WHERE merchantId = ?
      ORDER BY orderTime DESC
      LIMIT ? OFFSET ?
    `;
    const [orders] = await db.query(ordersQuery, [merchantId, limit, offset]);
    console.log('orders', orders)
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定商家的订单"
      });
    }

    const storeName = orders[0].storeName

    // 获取指定订单的所有详细信息
    const orderIds = orders.map(order => order.orderId);
    let orderDetails = [];
    if (orderIds.length > 0) {
      const detailsQuery = `
        SELECT orderId, productId, productName, quantity, salePrice, originalPrice, discount, totalSalePrice, totalOriginalPrice, totalDiscount
        FROM OrderDetails
        WHERE orderId IN (?)
      `;
      [orderDetails] = await db.query(detailsQuery, [orderIds]);
    }
    // 构建分层结构的订单信息
    const orderMap = orders.map(order => ({
      ...order,
      details: orderDetails.filter(detail => detail.orderId === order.orderId)
    }));
    console.log(merchantId)

    // 获取订单总数以计算总页数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Orders
      WHERE merchantId = ?
    `;

    const [countResult] = await db.query(countQuery, [merchantId]);
    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      message: "Merchant orders retrieved successfully",
      data: {
        merchantId: merchantId,
        storeName: storeName,
        orders: orderMap,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant orders",
      error: error.message
    });
  }
};

// 读取指定商家的所有订单
exports.getMerchantOrders = async (req, res) => {
  const merchantId = parseInt(req.params.merchantId, 10); // 从请求参数中获取商家ID

  try {
    // 获取指定商家所有订单，按时间排序
    const ordersQuery = `
      SELECT orderId, orderTime, userId, payStatus, mealStatus, salePrice, originalPrice, discount, pickupNumber
      FROM Orders
      WHERE merchantId = ?
      ORDER BY orderTime DESC
    `;
    const [orders] = await db.query(ordersQuery, [merchantId]);
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定商家的订单"
      });
    }

    const storeName = orders[0].storeName

    // 获取指定订单的所有详细信息
    const orderIds = orders.map(order => order.orderId);
    let orderDetails = [];
    if (orderIds.length > 0) {
      const detailsQuery = `
        SELECT orderId, productId, productName, quantity, salePrice, originalPrice, discount, totalSalePrice, totalOriginalPrice, totalDiscount
        FROM OrderDetails
        WHERE orderId IN (?)
      `;
      [orderDetails] = await db.query(detailsQuery, [orderIds]);
    }
    // 构建分层结构的订单信息
    const orderMap = orders.map(order => ({
      ...order,
      details: orderDetails.filter(detail => detail.orderId === order.orderId)
    }));

    // 获取订单总数以计算总页数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Orders
      WHERE merchantId = ?
    `;

    const [countResult] = await db.query(countQuery, [merchantId]);
    const totalItems = countResult[0].total;

    res.status(200).json({
      success: true,
      message: "Merchant orders retrieved successfully",
      data: {
        merchantId: merchantId,
        storeName: storeName,
        orders: orderMap,
        totalItems: totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant orders",
      error: error.message
    });
  }
};

// 读取指定用户的所有订单
exports.getUserOrders = async (req, res) => {
  const userId = parseInt(req.params.userId, 10); // 从请求参数中获取商家ID

  try {
    // 获取指定用户所有订单，按时间排序
    const ordersQuery = `
      SELECT orderId, orderTime, userId, payStatus, mealStatus, salePrice, originalPrice, discount, pickupNumber, storeName
      FROM Orders
      WHERE userId = ?
      ORDER BY orderTime DESC
    `;
    const [orders] = await db.query(ordersQuery, [userId]);
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定用户的订单"
      });
    }

    // 获取指定订单的所有详细信息
    const orderIds = orders.map(order => order.orderId);
    let orderDetails = [];
    if (orderIds.length > 0) {
      const detailsQuery = `
        SELECT orderId, productId, productName, quantity, salePrice, originalPrice, discount, totalSalePrice, totalOriginalPrice, totalDiscount
        FROM OrderDetails
        WHERE orderId IN (?)
      `;
      [orderDetails] = await db.query(detailsQuery, [orderIds]);
    }
    // 构建分层结构的订单信息
    const orderMap = orders.map(order => ({
      ...order,
      details: orderDetails.filter(detail => detail.orderId === order.orderId)
    }));

    // 获取订单总数以计算总页数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Orders
      WHERE userId = ?
    `;

    const [countResult] = await db.query(countQuery, [userId]);
    const totalItems = countResult[0].total;

    res.status(200).json({
      success: true,
      message: "Merchant orders retrieved successfully",
      data: {
        userId: userId,
        orders: orderMap,
        totalItems: totalItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving merchant orders",
      error: error.message
    });
  }
};

// 搜索符合条件的订单
exports.searchOrders = async (req, res) => {
  // 从查询参数中获取各种搜索条件
  const {
    merchantId, userId, orderId, productId, productType,
    minSalePrice, maxSalePrice, minOriginalPrice, maxOriginalPrice,
    startTime, endTime, pickupNumber
  } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  console.log('req.query', req.query)
  // 用于构建动态查询的数组
  let conditions  = []; // 初始化查询条件
  let params = []; // 参数数组

  if (merchantId) {
    conditions .push("merchantId = ?");
    params.push(merchantId);
  }

  // 检查各个参数，如果存在则加入查询条件和参数列表中
  if (userId) {
    conditions .push(`userId = ?`); // 用户ID
    params.push(userId);
  }
  if (orderId) {
    conditions .push("orderId LIKE ?"); // 订单ID
    params.push(`%${orderId}%`);
  }
  if (productId) {
    conditions .push("orderId IN (SELECT orderId FROM OrderDetails WHERE productId = ?)");
    params.push(productId);
  }
  if (productType) {
    conditions .push("orderId IN (SELECT orderId FROM OrderDetails WHERE productType = ?)");
    params.push(productType);
  }
  // if (minSalePrice) {
  //   conditions .push(`salePrice >= ?`); // 最小总售价
  //   params.push(minSalePrice);
  // }
  // if (maxSalePrice) {
  //   conditions .push(`salePrice <= ?`); // 最大总售价
  //   params.push(maxSalePrice);
  // }
  // if (minOriginalPrice) {
  //   conditions .push(`originalPrice >= ?`); // 最小原价
  //   params.push(minOriginalPrice);
  // }
  // if (maxOriginalPrice) {
  //   conditions .push(`originalPrice <= ?`); // 最大原价
  //   params.push(maxOriginalPrice);
  // }
  if (minSalePrice && maxSalePrice) {
    conditions .push("salePrice BETWEEN ? AND ?");
    params.push(minSalePrice, maxSalePrice);
  }
  if (minOriginalPrice && maxOriginalPrice) {
    conditions .push("originalPrice BETWEEN ? AND ?");
    params.push(minOriginalPrice, maxOriginalPrice);
  }
  if (startTime && endTime) {
    // 使用时间范围筛选订单
    conditions .push(`orderTime BETWEEN ? AND ?`);
    params.push(new Date(startTime), new Date(endTime));
  }
  if (pickupNumber) {
    conditions .push("pickupNumber = ?");
    params.push(pickupNumber);
  }
  // 动态构建SQL查询
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit; // 计算分页偏移
  console.log('offset', offset)
  console.log('limit', limit)

  // 查询符合条件的订单，包括分页处理
  const query = `
    SELECT orderId, userId, merchantId, orderTime, payStatus, mealStatus, salePrice, originalPrice, discount, pickupNumber
    FROM Orders
    ${whereClause}
    ORDER BY orderTime DESC
    LIMIT ? OFFSET ?
  `;

  // 查询总数的SQL
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM Orders
    ${whereClause}
  `;

  try {
    // 执行分页查询
    const [orders] = await db.query(query, [...params, limit, offset]);
    // 判断数量
    if (!orders.length) {
      return res.status(200).json({
        success: true,
        data: {
          orders: [],
          total: 0,
          page,
          totalPages: 0
        },
        message: "未找到符合条件的订单"
      });
    }

    // 获取总数
    const [totalResult] = await db.query(countQuery, params);
    const total = totalResult[0].total;

    // 获取订单详情
    const orderIds = orders.map(order => order.orderId);
    const [orderDetails] = await db.query(`SELECT * FROM OrderDetails WHERE orderId IN (?)`, [orderIds]);

    // 构建订单详细信息
    const detailedOrders = orders.map(order => ({
      ...order,
      details: orderDetails.filter(detail => detail.orderId === order.orderId)
    }));

    // 返回带分页信息的响应
    res.status(200).json({
      success: true,
      data: {
        orders:detailedOrders,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      },
      message: '检索订单成功'
    });
  } catch (error) {
    // 如果查询过程中发生错误，返回500错误
    res.status(500).json({ success: false, message: "检索订单时发生错误", error: error.message });
  }
};

// 修改订单
exports.updateOrder = async (req, res) => {
  const { orderId } = req.body;
  const { payStatus, mealStatus, salePrice, originalPrice, discount } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "缺少订单ID" });
  }

  // 准备动态SQL查询语句
  let updates = [];
  let params = [];

  if (payStatus) {
    updates.push('payStatus = ?');
    params.push(payStatus);
  }

  if (mealStatus) {
    updates.push('mealStatus = ?');
    params.push(mealStatus);
  }

  if (salePrice) {
    updates.push('salePrice = ?');
    params.push(salePrice);
  }

  if (originalPrice) {
    updates.push('originalPrice = ?');
    params.push(originalPrice);
  }

  if (discount) {
    updates.push('discount = ?');
    params.push(discount);
  }

  // 确保至少有一个字段需要更新
  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: "没有需要更新的字段" });
  }

  // 追加订单ID到参数
  params.push(orderId);

  const query = `UPDATE Orders SET ${updates.join(', ')} WHERE orderId = ?`;

  try {
    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "未找到该订单" });
    }

    res.status(200).json({ success: true, message: "订单更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: "更新订单时发生错误", error: error });
  }
};

// 删除订单
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "缺少订单ID" });
  }

  const deleteOrderDetailsQuery = `DELETE FROM OrderDetails WHERE orderId = ?`;
  const deleteOrderQuery = `DELETE FROM Orders WHERE orderId = ?`;

  // 开启事务
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 删除订单详细信息
    await connection.query(deleteOrderDetailsQuery, [orderId]);

    // 删除订单
    const [result] = await connection.query(deleteOrderQuery, [orderId]);

    // 确保订单存在
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "未找到该订单" });
    }

    // 提交事务
    await connection.commit();

    res.status(200).json({ success: true, message: "订单删除成功" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: "删除订单时发生错误", error: error.message });
  } finally {
    connection.release();
  }
};
