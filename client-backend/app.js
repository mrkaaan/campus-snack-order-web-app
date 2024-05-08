const express = require('express');
const cors = require('cors');
const merchantRoutes = require('./routes/merchantRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json()); // 拓展express 请求前、响应前执行特定操作
app.use(express.static('public'));

// Routes 注册
app.use('/api/merchants', merchantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);

module.exports = app;
