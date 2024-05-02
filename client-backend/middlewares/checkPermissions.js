const jwt = require('jsonwebtoken');

const checkGuestPermissions = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
      // 如果没有token，视为游客处理，可以根据具体情况修改
      return res.status(200).json({
        success: true,
        data: {}, // 返回空的数据结构或者特定的游客数据
        message: "Access as guest, limited data available."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.role === 'guest') {
      // 如果是游客，返回游客的数据
      return res.status(200).json({
        success: true,
        data: {}, // 返回空的数据结构或者特定的游客数据
        message: "Access as guest, limited data available."
      });
    } else {
      // 如果是注册用户，正常处理
      next();
    }
  } catch (error) {
    // Token解析失败或过期，也视为游客
    return res.status(200).json({
      success: true,
      data: {}, // 返回空的数据结构或者特定的游客数据
      message: "Invalid or expired token, access as guest, limited data available."
    });
  }
};

module.exports = checkGuestPermissions;
