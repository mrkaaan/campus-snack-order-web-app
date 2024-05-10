const db = require('../config/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService'); // 调整路径以正确导入
// const jwtSecret = 'my_jwt_secret';

function decryptAES(encryptedText) {
  const key = Buffer.from(process.env.AES_KEY, 'hex'); // 将密钥从十六进制字符串转换为Buffer对象
  console.log(key)
  const iv = Buffer.from(process.env.AES_IV, 'hex'); // 将初始向量从十六进制字符串转换为Buffer对象
  console.log(iv)
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

// 注册新用户
exports.register = async (req, res) => {

  const { data, registerType } = req.body;
  console.log(data)
  console.log(registerType)
  // 解密数据
  // let userData;
  // try {
  //   userData = JSON.parse(decryptAES(data));
  // } catch (error) {
  //   console.error('Error decrypting data:', error);
  //   return res.status(500).json({ success: false, message: "注册失败 验证码已过期", data: null });
  // }
  const userData = data
  try {
    if (registerType === 'normal') {
      // 检查用户名是否已存在
      const { username, password } = userData;

      // 判空
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "用户名或密码为空",
          data: null
        });
      }

      // 检查用户名是否已存在
      const [userExists] = await db.query("SELECT accountId FROM Users WHERE username = ?", [username]);
      if (userExists.length > 0) {
        return res.status(409).json({ success: false, message: "用户名已存在" });
      }

      // 注册用户
      const hashedPassword = await bcrypt.hash(password, 10); // 验证密码
      let accountId = generateAccountId(username); // 生成accountId
      let exists = true;
      let attempts = 0;
      while (exists && attempts < 10) { // 限制尝试次数以避免无限循环
        const [rows] = await db.query("SELECT accountId FROM Users WHERE accountId = ?", [accountId]);
        if (rows.length === 0) {
          exists = false;
        } else {
          accountId = generateAccountId(username + attempts); // 生成新的accountId
          attempts++;
        }
      }

      await db.query("INSERT INTO Users (accountId, username, password) VALUES (?, ?, ?)", [accountId, username, hashedPassword]);

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
      const [userExists] = await db.query("SELECT accountId FROM Users WHERE email = ?", [email]);
      if (userExists.length > 0) {
        return res.status(409).json({ success: false, message: "邮箱已被注册" });
      }

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

      // 生成八位随机数作为UID
      const uid = Math.floor(10000000 + Math.random() * 90000000).toString();

      // 生成随机accountId
      let accountId = generateAccountId(email);
      let exists = true;
      let attempts = 0;
      while (exists && attempts < 10) { // 限制尝试次数以避免无限循环
        const [rows] = await db.query("SELECT accountId FROM Users WHERE accountId = ?", [accountId]);
        if (rows.length === 0) {
          exists = false;
        } else {
          accountId = generateAccountId(email + attempts); // 生成新的accountId
          attempts++;
        }
      }

      // 注册用户
      await db.query("INSERT INTO Users (accountId, email) VALUES (?, ?)", [accountId, email]);

    } else {
      return res.status(400).json({ success: false, message: "无效的注册类型" });
    }

    res.status(201).json({ success: true, message: "注册成功" });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: "注册失败", data: null });
  }
};

exports.registerDemo = async (req, res) => {
  try {
    console.log('registerDemo')
    // 检查邮箱是否已存在
    const [rows] = await db.query("SELECT accountId FROM Users WHERE email = ?", ['196022210@qq.com']);
    console.log('rows:', rows)
    const user = rows ? rows[0] : null;
    if (user) {
      console.log('User already exists')
    } else {
      console.log('User does not exist')
    }

    const [verifications, _f] = await db.query(`
              SELECT verification_code, expiry_time FROM EmailVerifications
              WHERE email = ?`, ['1960222170@qq.com']);
    console.log('verifications:', verifications)
    vercc = verifications[0]
    console.log('vercc:', vercc)
    if (!vercc) {
      console.log('No verification code found')
    } else {
      console.log('Verification code found')
    }

    if (!verifications){
      console.log('No verification code found')
    } else {
      console.log('Verification code found')
    }

    const [existingUser] = await db.query("SELECT * FROM Users WHERE username = ?", ['demo123']);
    console.log('Existing user check:', existingUser);
    res.status(200).json({
      success: true,
      message: "successfully connected",
      data: existingUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
      data: null
    });
  }
}

// 判断用户身份并查遍检查该用户在数据库中是否存在
function queryDatabaseForLogin(userinfo) {
  // 这里需要根据userinfo判断是email、username还是UID
  let userType = null;
  const queryAccountId = 'SELECT * FROM Users WHERE accountId = ?';
  const queryUsername = 'SELECT * FROM Users WHERE username = ?';
  const queryEmail = 'SELECT * FROM Users WHERE email = ?';

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
  const { userData, loginType } = req.body;
  console.log('req.body:',  req.body)
  console.log('userData:', userData)
  console.log('loginType:', loginType)
  try {
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

      const [query, userType] =  queryDatabaseForLogin(userinfo)
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
        console.log('该用户未设置密码，请使用邮箱验证码登录')
        return res.status(401).json({
          success: false,
          message: "该用户未设置密码，请使用邮箱验证码登录"
        });
      }

      let passwordMatch = false
      // 验证密码
      if (user.role === 'user') {
        passwordMatch = await bcrypt.compare(password, user.password);
      } else {
        passwordMatch = password === user.password;
      }
      if (passwordMatch) {
        const expiresIn = userData.remember ? '7d' : '1d';
        const token = jwt.sign({ userinfo: userinfo, mode: 'normal' }, process.env.JWT_SECRET, { expiresIn }); // 使用JWT生成token
        res.status(200).json({
          success: true,
          message: "登录成功",
          data: {
            user: {
              accountId: user.accountId || null,
              username: user.username || null,
              email: user.email || null,
              hasPassword: !!user.password
            },
            mode:'normal', // 登录模式 normal 或者 guest
            token,
            isAdmin: user.role === 'admin',
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
      const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
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
        const token = jwt.sign({ email: user.email, mode:'normal' }, process.env.JWT_SECRET, { expiresIn }); // 使用JWT生成token
        res.status(200).json({
          success: true,
          message: "登录成功",
          data: {
            user: {
              accountId: user.accountId || null,
              username: user.username || null,
              email: user.email || null,
              hasPassword: !!user.password
            },
            mode:'normal', // 登录模式 normal 或者 guest
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
  res.status(200).json({ message: "Logged out successfully" });
};

exports.loginAsGuest = async (req, res) => {
  try {
    // 生成一个游客JWT
    const token = jwt.sign({
      mode: 'guest',
    }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // 返回生成的游客JWT
    res.status(200).json({
      success: true,
      message: "Guest login successful",
      data: {
        token,
        mode: 'guest'
      }
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

// 发送验证码
exports.sendEmailVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received email:", email)
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '请填写邮箱'
      });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 生成6位随机数作为验证码
    console.log("Generated verification code:", verificationCode)
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
