const nodemailer = require('nodemailer');

// 创建 nodemailer 传输对象
function createTransporter(config) {
  return nodemailer.createTransport(config);
}

// 封装发送邮件的函数，接受自定义的邮件内容和接收者地址
async function sendCustomEmail(transporter, to, subject, htmlContent) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // 使用环境变量中的邮箱用户名
    to: to, // 收件人地址，通过参数传入
    subject: subject, // 邮件主题，通过参数传入
    html: htmlContent // HTML邮件正文，通过参数传入
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('消息发送成功，消息ID: %s', info.messageId);
}

// 高层次的封装，用于外部调用，只需提供接收者和内容
async function sendVerificationEmail(to, code) {
  const transporterConfig = {
    host: 'smtp.yeah.net', // SMTP服务器地址
    port: 465, // SMTP端口号
    secure: true, // 使用SSL
    auth: {
      user: process.env.EMAIL_USERNAME, // 从环境变量获取邮箱用户名
      pass: process.env.EMAIL_PASSWORD // 从环境变量获取邮箱密码
    }
  };
  const transporter = createTransporter(transporterConfig);

  const subject = 'Your Verification Code'; // 定义邮件主题
  const htmlContent = `<b>Your verification code is: ${code}</b>`; // 定义邮件正文，插入验证码

  await sendCustomEmail(transporter, to, subject, htmlContent).catch(console.error);
}

module.exports = {
  sendVerificationEmail
};
