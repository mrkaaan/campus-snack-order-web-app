const db = require('../config/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService'); // 调整路径以正确导入

function decryptAES(encryptedText) {
  const key = Buffer.from(process.env.AES_KEY, 'hex'); // 将密钥从十六进制字符串转换为Buffer对象
  const iv = Buffer.from(process.env.AES_IV, 'hex'); // 将初始向量从十六进制字符串转换为Buffer对象
  let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv); // 创建解密器实例，设置为AES-256-CBC
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8'); // 解密过程，将加密文本从base64转为utf8
  decrypted += decipher.final('utf8'); // 完成解密过程
  return decrypted; // 返回解密后的字符串
}

// 生成UID
function generateAccountId(text) {
  let seed = crypto.createHash('sha256').update(text).digest('hex');
  let hash = parseInt(seed.substring(0, 8), 16); // 取哈希值的前8位作为数字
  return Math.abs(hash % 100000000); // 返回8位随机数
}

// 注册新用户 暂不支持注册商家新增店铺
exports.register = async (req, res) => {

  const { data, registerType, isMerchant  } = req.body;
  // 解密数据
  // let userData;
  // try {
  //   userData = JSON.parse(decryptAES(data));
  // } catch (error) {
  //   console.error('Error decrypting data:', error);
  //   return res.status(500).json({ success: false, message: "注册失败 验证码已过期", data: null });
  // }
  const userData = data
  const table = isMerchant ? 'MerchantUsers' : 'Users'; // 定义查询和插入的表格
  try {
    if (registerType === 'normal') {
      const { username, password } = userData;

      // 检查输入字段是否为空
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "必要信息不能为空",
          data: null
        });
      }

      // 检查用户名是否已存在
      const userCheckQuery = `SELECT accountId FROM ${table} WHERE username = ?`;
      const [userExists] = await db.query(userCheckQuery, [username]);
      if (userExists.length > 0) {
        return res.status(409).json({ success: false, message: "用户名已存在" });
      }

      // 注册用户
      // const hashedPassword = await bcrypt.hash(password, 10); // 密码加密
      const hashedPassword = password
      let accountId = generateAccountId(username); // 生成accountId
      let exists = true; // 判断accountId是否存在
      let attempts = 0;
      while (exists && attempts < 10) { // 限制尝试次数以避免无限循环
        const idCheckQuery = `SELECT accountId FROM ${table} WHERE accountId = ?`;
        const [rows] = await db.query(idCheckQuery, [accountId]);
        if (rows.length === 0) {
          exists = false;
        } else {
          accountId = generateAccountId(username + attempts); // 生成新的accountId
          attempts++;
        }
      }
      const insertUsersQuery = `INSERT INTO ${table} (accountId, username, password) VALUES (?, ?, ?)`;
      await db.query(insertUsersQuery, [accountId, username, hashedPassword]);

    } else if (registerType === 'email') {
      const { email, verCode } = userData;
      // 判空
      if (!email || !verCode) {
        return res.status(400).json({
          success: false,
          message: "邮箱或验证码为空",
          data: null
        });
      }
      // 检查邮箱是否已存在
      const checkEmailQuery = `SELECT accountId FROM ${table} WHERE email = ?`;
      const [userExists] = await db.query(checkEmailQuery, [email]);
      if (userExists.length > 0) {
        return res.status(409).json({ success: false, message: "邮箱已被注册" });
      }

      // 检查验证码是否存在
      const checkVerificationQuery = `SELECT verification_code, expiry_time FROM EmailVerifications WHERE email = ?`;
      const [verifications] = await db.query(checkVerificationQuery, [email]);
      const verification = verifications ? verifications[0] : null;
      if (!verification) {
        return res.status(400).json({ success: false, message: "请发送验证码" });
      }
      if (verification.verification_code !== verCode) {
        // 若存在 则验证验证码是否正确
        return res.status(400).json({ success: false, message: "验证码错误" });
      } else if (new Date() > new Date(verification.expiry_time)) {
        // 若存在 继续检验 验证验证码是否过期
        return res.status(400).json({ success: false, message: "验证码已过期" });
      }

      // 验证码验证通过后，删除验证码记录
      const deleteVerificationQuery = `DELETE FROM EmailVerifications WHERE email = ?`;
      await db.query(deleteVerificationQuery, [email]);

      // 生成随机accountId
      let accountId = generateAccountId(email);
      let exists = true;
      let attempts = 0;
      while (exists && attempts < 10) { // 限制尝试次数以避免无限循环
        const idCheckQuery = `SELECT accountId FROM ${table} WHERE accountId = ?`;
        const [rows] = await db.query(idCheckQuery, [accountId]);
        if (rows.length === 0) {
          exists = false;
        } else {
          accountId = generateAccountId(email + attempts); // 生成新的accountId
          attempts++;
        }
      }

      // 注册用户
      const insertUsersQuery = `INSERT INTO ${table} (accountId, email) VALUES (?, ?)`;
      await db.query(insertUsersQuery, [accountId, email]);

    } else {
      return res.status(400).json({ success: false, message: "无效的注册类型" });
    }

    res.status(201).json({ success: true, message: "注册成功" });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: "注册失败", data: null });
  }
};

// 判断用户身份并查遍检查该用户在数据库中是否存在
function queryDatabaseForLogin(userinfo, table) {
  // 这里需要根据userinfo判断是email、username还是UID
  let userType = null;
  const queryAccountId = `SELECT * FROM ${table} WHERE accountId = ?`
  const queryUsername = `SELECT * FROM ${table} WHERE username = ?`
  const queryEmail = `SELECT * FROM ${table} WHERE email = ?`

  // 简单的正则判断
  if (/^\d{8}$/.test(userinfo)) { // 假设UID是8位数字
    userType = 'accountId';
    return [queryAccountId, userType];
  } else if (userinfo.includes('@')) { // 简单的判断是否包含@，认为是邮箱
    userType = 'email';
    return [queryEmail, userType];
  } else { // 其余情况认为是用户名
    userType = 'username';
    return[queryUsername, userType];
  }
}

// 用户登录
exports.login = async (req, res) => {
  const { userData, loginType, isMerchant } = req.body;
  try {
    const table = isMerchant ? 'MerchantUsers' : 'Users'; // 定义查询和插入的表格

    if (loginType === 'normal') {
      const { userinfo, password } = userData

      // 判空
      if (!userinfo || !password) {
        return res.status(400).json({
          success: false,
          message: "用户名或密码为空",
          data: null
        });
      }

      // 检查用户名是否已存在
      const [query, userType] =  queryDatabaseForLogin(userinfo, table)
      const [rows] = await db.query(query, [userinfo])
      const user = rows ? rows[0] : null;
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "用户不存在",
          data: null
        });
      }
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: "该用户未设置密码，请使用邮箱验证码登录"
        });
      }

      // 验证密码
      // const passwordMatch = await bcrypt.compare(password, user.password);
      const passwordMatch = password === user.password
      if (passwordMatch) {
        const expiresIn = userData.remember ? '7d' : '1d';
        const token = jwt.sign({ userinfo: userinfo }, process.env.JWT_SECRET, { expiresIn }); // 使用JWT生成token
        const mode = isMerchant ? 'merchant' : 'user';
        res.status(200).json({
          success: true,
          message: "登录成功",
          data: {
            user: {
              accountId: user.accountId || null,
              username: user.username || null,
              email: user.email || null,
              hasPassword: !!user.password,
              merchantId: user.merchantId || null
            },
            mode: mode,
            token,
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: "密码错误"
        });
      }
    } else {
      // 邮箱验证码登录
      const { email, verCode } = userData;

      // 判空
      if (!email || !verCode) {
        return res.status(400).json({
          success: false,
          message: "邮箱或验证码为空",
          data: null
        });
      }

      // 检查邮箱是否已存在
      const checkEmail = `SELECT * FROM ${table} WHERE email = ?`;
      const [rows] = await db.query(checkEmail, [email]);
      const user = rows ? rows[0] : null;
      if (!user) {
        // 邮箱未注册 自动注册
        await exports.register({ userData, loginType });
      } else {
        // 检查验证码是否存在
        const [verifications] = await db.query(`
              SELECT verification_code, expiry_time FROM EmailVerifications
              WHERE email = ?`, [email]);
        const verification = verifications ? verifications[0] : null;
        if (!verification) {
          return res.status(400).json({ success: false, message: "请发送验证码" });
        }
        if (verification.verification_code !== verCode) {
          // 若存在 则验证验证码是否正确
          return res.status(400).json({ success: false, message: "验证码错误" });
        } else if (new Date() > new Date(verification.expiry_time)) {
          // 若存在 继续检验 验证验证码是否过期
          return res.status(400).json({ success: false, message: "验证码已过期" });
        }
        // 验证码验证通过后，删除验证码记录
        await db.query("DELETE FROM EmailVerifications WHERE email = ?", [email]);
        const expiresIn = userData.remember ? '7d' : '1d';
        const token = jwt.sign({ userinfo: user.email }, process.env.JWT_SECRET, { expiresIn }); // 使用JWT生成token
        const mode = isMerchant ? 'merchant' : 'user';
        res.status(200).json({
          success: true,
          message: "登录成功",
          data: {
            user: {
              accountId: user.accountId || null,
              username: user.username || null,
              email: user.email || null,
              hasPassword: !!user.password,
              merchantId: user.merchantId || null,
            },
            mode: mode, // 登录模式 normal 或者 guest
            token
          }
        });
      }
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "登陆失败 请刷新重试",
      data: error
    });
  }
};

// 用户注销
exports.logout = async (req, res) => {
  const { id } = jwt.verify(req.cookies.token, 'your_jwt_secret');
  await db.query("UPDATE Users SET token = NULL WHERE id = ?", [id]);
  res.clearCookie('rememberMe');
  res.status(200).json({ message: "注销成功" });
};

// 游客登录
exports.loginAsGuest = async (req, res) => {
  try {
    // 生成一个游客JWT
    const token = jwt.sign({ userinfo: 'guest' }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // 返回生成的游客JWT
    res.status(200).json({
      success: true,
      message: "游客登录成功",
      data: {
        user: null,
        mode: 'user',
        token,
        isGuest: true
      }
    });
  } catch (error) {
    console.error("Error during guest login process:", error);
    res.status(500).json({
      success: false,
      message: "游客登录失败",
      data: null
    });
  }
};

// 发送验证码
exports.sendEmailVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '请填写邮箱'
      });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 生成6位随机数作为验证码
    console.log("Sending verification email to:", email, verificationCode)
    console.log("Sending...")
    await emailService.sendVerificationEmail(email, verificationCode.toString());

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 设置验证码5分钟后过期

    // 插入或更新验证码记录
    await db.query(`
            INSERT INTO EmailVerifications (email, verification_code, expiry_time)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE verification_code = ?, expiry_time = ?`,
      [email, verificationCode, expiryTime, verificationCode, expiryTime]);

    // 返回生成的游客JWT
    res.status(200).json({
      success: true,
      message: "验证码已发送",
      data: null
    });
    console.log("Verification email sent successfully")
  } catch (error) {
    console.error("Failed to send verification email:", error);
    res.status(500).json({
      success: false,
      message: "验证码发送失败 请确保邮箱真实存在",
      data: error.message
    });
  }
};



function handlePassword(password, method) {
  switch (method) {
    case 'plain':
      return password; // 返回明文密码

    case 'reversible':
      // AES 加密（可逆加密）
      const aesKey = crypto.randomBytes(32); // 生成密钥
      const aesIv = crypto.randomBytes(16); // 生成初始向量

      const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
      let encrypted = cipher.update(password, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      return {
        encryptedPassword: encrypted,
        key: aesKey.toString('base64'),
        iv: aesIv.toString('base64')
      };

    case 'irreversible':
      // SHA-256 哈希（不可逆加密）
      const hash = crypto.createHash('sha256');
      hash.update(password);
      return hash.digest('hex');

    default:
      throw new Error('Invalid encryption method');
  }
}
