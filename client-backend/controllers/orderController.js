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
  const { order } = req.body; // 从请求体中获取订单数据
  if (!order) {
    return res.status(400).json({
      success:false,
      message: "请传入订单数据",
    })
  }
  const { userId,  merchantId,  storeName,  payStatus, salePrice, originalPrice, discount, items } = order
  try {
    const orderTime = new Date(); // 假设订单时间为当前时间
    const orderId = generateOrderNumber(38295818, merchantId, orderTime);

    // 获取当天的订单数量，用于确定取餐号
    const today = moment().format('YYYY-MM-DD');
    console.log(today)
    const [result] = await db.query('SELECT COUNT(*) AS count FROM Orders WHERE orderDate = ?', [today]);
    const pickupNumber = result[0].count + 1; // 当天的订单数量加1作为取餐号
    console.log(pickupNumber)

    await db.query('INSERT INTO Orders (orderId, userId, merchantId, storeName, payStatus, orderTime, salePrice, originalPrice, discount, pickupNumber, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, 38295818, merchantId, storeName, payStatus, orderTime, salePrice, originalPrice, discount, pickupNumber, today]);
    // 批量插入订单详细信息
    const details = items.map(item => [orderId, item.productId, item.name, item.quantity, item.salePrice, item.originalPrice, item.discount, item.totalSalePrice, item.totalOriginalPrice, item.totalDiscount]);
    await db.query('INSERT INTO OrderDetails (orderId, productId, productName, quantity, salePrice, originalPrice, discount, totalSalePrice, totalOriginalPrice, totalDiscount) VALUES ?', [details]);

    res.status(201).json({
      success: true,
      message: "已成功创建订单",
      orderId: orderId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "创建订单时出错",
      error: error.message
    });
  }
};

// 读取指定商家的所有订单
exports.getMerchantOrders = async (req, res) => {
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
    console.log('商品数据读取失败 orderIds', orderIds)
    if (orderIds.length > 0) {
      const detailsQuery = `
        SELECT orderId, productId, productName, quantity, salePrice, originalPrice, discount, totalSalePrice, totalOriginalPrice, totalDiscount
        FROM OrderDetails
        WHERE orderId IN (?)
      `;
      [orderDetails] = await db.query(detailsQuery, [orderIds]);
    }
    console.log('商品数据读取失败 orderDetails', orderDetails)
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


// 搜索符合条件的订单
exports.searchOrders = async (req, res) => {
  // 从查询参数中获取各种搜索条件
  const {
    merchantId, userId, orderId, productId, productType,
    minPrice, maxPrice, minOriginalPrice, maxOriginalPrice,
    startTime, endTime
  } = req.query;

  // 用于构建动态查询的数组
  let whereClauses = [`merchantId = ?`]; // 初始化查询条件为商家ID
  let params = [merchantId]; // 参数数组

  // 检查各个参数，如果存在则加入查询条件和参数列表中
  if (userId) {
    whereClauses.push(`userId = ?`); // 用户ID
    params.push(userId);
  }
  if (orderId) {
    whereClauses.push(`orderId = ?`); // 订单ID
    params.push(orderId);
  }
  if (productId) {
    // 使用 EXISTS 子查询来判断订单中是否包含指定商品或套餐
    whereClauses.push(`EXISTS (SELECT 1 FROM OrderDetails WHERE OrderDetails.orderId = Orders.orderId AND productId = ?)`);
    params.push(productId);
  }
  if (productType) {
    // 使用 EXISTS 子查询来判断订单中是否包含指定类型的商品或套餐
    whereClauses.push(`EXISTS (SELECT 1 FROM OrderDetails WHERE OrderDetails.orderId = Orders.orderId AND productType = ?)`);
    params.push(productType);
  }
  if (minPrice) {
    whereClauses.push(`salePrice >= ?`); // 最小总售价
    params.push(minPrice);
  }
  if (maxPrice) {
    whereClauses.push(`salePrice <= ?`); // 最大总售价
    params.push(maxPrice);
  }
  if (minOriginalPrice) {
    whereClauses.push(`originalPrice >= ?`); // 最小原价
    params.push(minOriginalPrice);
  }
  if (maxOriginalPrice) {
    whereClauses.push(`originalPrice <= ?`); // 最大原价
    params.push(maxOriginalPrice);
  }
  if (startTime && endTime) {
    // 使用时间范围筛选订单
    whereClauses.push(`orderTime BETWEEN ? AND ?`);
    params.push(new Date(startTime), new Date(endTime));
  }

  // 动态构建SQL查询
  const query = `
    SELECT * FROM Orders
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY orderTime DESC
  `;

  try {
    // 执行查询并获取符合条件的订单
    const [orders] = await db.query(query, params);
    if (!orders.length) {
      // 如果没有找到任何订单，返回 404 错误
      return res.status(404).json({ success: false, message: "未找到符合条件的订单" });
    }

    // 提取订单ID列表用于获取详细信息
    const orderIds = orders.map(order => order.orderId);
    const [orderDetails] = await db.query(`SELECT * FROM OrderDetails WHERE orderId IN (?)`, [orderIds]);

    // 构建分层结构的订单数据，将订单详细信息合并到每个订单中
    const detailedOrders = orders.map(order => ({
      ...order,
      details: orderDetails.filter(detail => detail.orderId === order.orderId)
    }));

    // 返回成功响应，包含符合条件的订单数据
    res.status(200).json({ success: true, data: detailedOrders });
  } catch (error) {
    // 如果查询过程中发生错误，返回500错误
    res.status(500).json({ success: false, message: "检索订单时发生错误", error: error.message });
  }
};
