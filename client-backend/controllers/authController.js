const db = require('../config/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// const jwtSecret = 'my_jwt_secret';

// 注册新用户
exports.register = async (req, res) => {
  const { username, password } = req.body;
  console.log('username:', username, 'password:',password)
  try {
    // 检查用户名是否已存在
    const [rows, fields] = await db.query("SELECT id FROM Users WHERE username = ?", [username]);
    console.log('Existing user check:', rows);

    if (rows.length === 1) {
      // 如果用户已存在，返回错误
      res.status(409).json({
        success: false,
        message: "用户名已存在",
        data: null
      });
      return;
    } else if (rows.length > 1) {
      // 如果出现多个重复用户，返回错误
      res.status(500).json({
        success: false,
        message: "数据库错误",
        data: null
      });
      return;
    }

    // 如果用户不存在，进行注册
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO Users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    console.log('User registered successfully');
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: null
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

exports.registerDemo = async (req, res) => {
  console.log('registerDemo')
  const existingUser = await db.query("SELECT id FROM Users WHERE username = ?", ['username']);
  console.log('Existing user check:', existingUser.length);
  try {
    res.status(200).json({
      success: true,
      message: "successfully connected",
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      data: null
    });
  }
}
// 用户登录
exports.login = async (req, res) => {
  const { username, password, rememberMe, mode  } = req.body;
  // 如果是游客模式登录，处理游客登录逻辑
  if (mode === 'guest') {
    try {
      const token = jwt.sign({ role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({
        success: true,
        message: "Guest login successful",
        data: { token, mode:'guest' }
      });
    } catch (error) {
      console.error("Error during guest login process:", error);
      return res.status(500).json({
        success: false,
        message: "Error logging in as guest",
        data: null
      });
    }
  }

  // 处理普通登录逻辑
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
      data: null
    });
  }

  try {
    const [rows, fields]  = await db.query("SELECT * FROM Users WHERE username = ?", [username]);
    console.log("User fetch result:", rows);
    const user = rows ? rows[0] : null;
    if (user) {
      console.log("User found, verifying password...");
      const passwordValid = await bcrypt.compare(password, user.password)

      if ( passwordValid ) {
        console.log("Password verification successful.");
        const expiresIn = rememberMe ? '7d' : '1d';
        const token = jwt.sign({ id: user.id, role: 'normal' }, process.env.JWT_SECRET, { expiresIn }); // 使用JWT生成token

        res.status(200).json({
          success: true,
          message: "Login successful",
          data: { token,
            user: { username:user.username },
            mode:'normal'  }
        });
      } else {
        console.log("Password verification failed.");
        res.status(401).json({
          success: false,
          message: "Password verification failed",
          data: null
        });
      }
    } else {
      console.log("No user found with the username:", username);
      res.status(401).json({
        success: false,
        message: `No user found with the username ${username}`,
        data: { username }
      });
    }
  } catch (error) {
    console.error("Error during login process:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      data: null
    });
  }
};


// 用户注销
exports.logout = async (req, res) => {
  const { id } = jwt.verify(req.cookies.token, 'your_jwt_secret');
  await db.query("UPDATE Users SET token = NULL WHERE id = ?", [id]);
  res.clearCookie('rememberMe');
  res.status(200).json({ message: "Logged out successfully" });
};


exports.loginAsGuest = async (req, res) => {
  try {
    // 生成一个游客JWT
    const token = jwt.sign({
      role: 'guest',
    }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // 返回生成的游客JWT
    res.status(200).json({
      success: true,
      message: "Guest login successful",
      data: { token }
    });
  } catch (error) {
    console.error("Error during guest login process:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in as guest",
      data: null
    });
  }
};
