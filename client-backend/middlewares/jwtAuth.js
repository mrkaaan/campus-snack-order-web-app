const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  console.log('Token:', token)
  if (!token) {
    console.log('No token')
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    req.user = decoded; // 将解码后的用户信息添加到请求对象
    console.log('User:', req.user)
    console.log('req.cookies.rememberMe', req.cookies)
    next(); // 继续下一个中间件或请求处理器
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = jwtAuth;
