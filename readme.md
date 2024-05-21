# Campus Snack Order Web App 项目说明

## 项目启动

### 项目根目录结构

```
admin-frontend/    # 管理员端（尚未开发，忽略）
client-backend/    # 项目后端
client-frontend/   # 项目前端
.gitignore         # 忽略一些不想被版本控制记录的文件和文件夹
database_backup.sql # 使用 HeidiSQL 备份的数据库文件
readme.md          # 当前文档
target.txt         # 待修复或者计划工作
```

### 安装依赖

在项目根目录下，分别进入前端和后端文件夹并安装依赖。

```bash
# 前端
cd client-frontend
npm install

# 后端
cd client-backend
npm install
```

### 启动项目

确保依赖安装完成后，分别启动前端和后端项目。

```bash
# 启动前端
cd client-frontend
npm run serve

# 启动后端
cd client-backend
npm run dev
```
> 前端项目默认端口为 8080，后端项目默认端口为 3000
### 恢复数据库

数据库文件位于项目根目录的 `database_backup.sql` 文件，自行启动 MySQL 数据库并恢复该文件，如有账户密码则都为 `root`，无数据库则项目无法正常运行，若不想使用提供的备份文件，可以按照文档下方的`数据库说明`部分内容自行创建数据库与表

> 注意，当前测试数据中仅有一家商铺有商品数据



### 测试账户

进入系统后，提供一些测试用的商家和用户的账号。

- **用户账户**：用户账户可以自行随意创建。如果不想创建用户，默认的测试用户名是 `demo123`。
- **商家账户**：商家用户虽然也可以随意创建，但是暂时不支持新创建的商家账户新增店铺。现有的商家端的账号名都是店铺首字母加 `123`，例如李大夫小吃的商家账户是 `ldfxc123`。
- **默认密码**：不论是用户还是商家，默认密码都是 `12345678`。



### 环境变量

确保在前端和后端项目的根目录下配置相应的环境变量。

#### 前端环境变量

`client-frontend/.env`

```env
VUE_APP_BASE_API=http://localhost:3000/api
VUE_APP_BASE_URL=http://localhost:3000

JWT_SECRET='my_jwt_secret'

; 以下两个环境变量用于前后端接口传递信息时的AES加密，可不配置
AES_KEY=0123456789abcdef0123456789abcdef
AES_IV=abcdef9876543210
```

> 注意：如果要在手机上进行测试，需将 `VUE_APP_BASE_API` 和 `VUE_APP_BASE_URL` 改为局域网内的IP地址。

#### 后端环境变量 

`client-backend/.env`

```env
JWT_SECRET='my_jwt_secret'

AES_KEY=0123456789abcdef0123456789abcdef
AES_IV=abcdef9876543210

EMAIL_USERNAME=xxx
EMAIL_PASSWORD=xxx
```

> 注意：`EMAIL_USERNAME` 和 `EMAIL_PASSWORD` 是用于邮箱服务的网易邮箱和授权码。若不进行配置则无法使用邮箱相关内容



**如果是需要启动项目，阅读当前这一部分即可，下方的内容只是对项目结构进行简单阐述**

## 前端说明

前端项目使用 Vue 和 ElementUI 构建，主要依赖包括 Axios 用于 HTTP 请求。

### 目录结构

```
src/
├── api/               # 存放所有的接口请求文件
├── assets/            # 存放静态资源
│   ├── initial/       # 初始资源
│   └── logo/          # logo 文件
├── components/        # 存放可复用的 UI 组件
├── fonts/             # 存放字体文件
├── plugins/           # 存放 Vue 插件
├── router/            # 存放路由配置
├── store/             # 存放 Vuex 状态管理相关文件
│   └── modules/       # 模块化的状态管理文件
├── styles/            # 存放全局样式和变量文件
├── utils/             # 存放工具函数和公共的 request.js 文件
└── views/             # 存放路由组件
    └── merchant/      # 商家相关的视图组件

```

### 数据管理

数据基本上都由 Vuex 管理，并开启了命名空间。

### 公共请求封装

在 `utils` 文件夹中封装了公共的 `request.js` 文件，写新的接口请求时，需要在 `api` 文件夹下创建新的 `.js` 文件并导入 `request.js` 文件，直接写函数。例如：

```javascript
// api/auth.js
import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  });
}
```

在组件中发请求时，通常直接使用 `try-catch` 即可，不需要额外手动处理异步，因为在 `request.js` 中已经处理好了。

## 后端说明

后端项目使用 Node.js 和 Express 构建，目录结构如下：

```plaintext
client-backend/
│
├── app.js            # Express 应用的主要配置文件
├── server.js         # 应用的入口文件，负责启动服务器
│
├── routes/           # 路由定义目录
│   └── productRoutes.js # 产品相关路由
│   └── ....
│
├── controllers/      # 控制器目录，处理业务逻辑
│   └── productController.js # 产品相关业务逻辑
│   └── ...
│
├── models/           # 查询数据库语句模型方法
│   └── Merchants.js    # 商家数据查询语句方法
│
└── config/           # 配置文件目录
    ├── db.js         # 使用 mysql 库进行数据库连接
    └── index.js      # 使用 mysql2 库进行数据库连接
```

### 数据库连接

- **config/db.js**：使用 `mysql` 库进行数据库连接。在前期开发中，商家数据的后端接口使用了这个文件。查询语句写在 `models` 文件中，并手动返回异步 `promise`，然后在 `controllers` 中引入并使用。这种做法的好处是 `models` 专注于写查询语句，`controllers` 专注于数据的处理，缺点是异步需要手动处理。
- **config/index.js**：使用 `mysql2` 库进行数据库连接。在后期的开发中，除商家数据外的接口都使用了这个文件。直接在 `controllers` 中编写查询语句和数据处理，不必手动在 `models` 中写异步代码，因为 `mysql2` 库自带异步功能。

### 返回格式

后端接口数据的返回格式必须包含 `success` 和 `message` 字段，`data` 字段视情况而定，可以有也可以没有。例如：

```
res.status(500).json({
  success: false,
  message: "登陆失败 请刷新重试",
  data: error
});
```



## 数据库说明

项目使用的数据库名称为`CampusSnackDB`， 结构如下：

### 用户表 Users

accountId(UID)不是用户自定义的，是注册时后端必定要生成的固定的 8 位 数字

username长度要求6-20位 由英文字符、数字、字母的其二组成，用以区分UID

password用户输入的明文要求 数字、字母、字符，长度8-20位



注册

用户名username有唯一性，注册不用设置昵称，nickname默认为空，用户进入个人界面时不显示nickname，提醒用户设置昵称

- 邮箱注册：使用邮箱注册时只需要输入验证码就可以直接进入系统后端不生成username、password，用户进入个人界面提示设置用户和密码
- 正常注册：输入用户名和密码



登录：可以使用 "用户名/UID/邮箱 + 密码" 、"邮箱 + 验证码"两种方式登录

**有email时则必定有UID**

**有username时则必定有UID**

**有password时则必定有UID**

**反推 有UID时则必定有** **password/username/email 其一**

**有可能存在为"有用户名无密码"的情况，这种情况是用户用邮箱登录后只设置了username没设置password**

- 密码登录，判断输入的用户是三者其中的哪个：

- - 判断输入的是UID(accountId)登录: 输入密码点击登录后，核验：

- - - 数据库表中UID是否存在：

- - - - 是：判断数据库表中有没有密码：

- - - - - 有密码：核验密码
        - 没有密码：提示该用户未设置密码，则引导使用邮箱+验证码登录

- - - - 否，提示没有这个UID的用户，登录失败

- - 判断输入的是username登录： 输入密码点击登录后，核验：

- - - 数据库表中是否存在该用户

- - - - 是：判断数据库表中有没有密码：

- - - - - 有密码：核验密码
        - 没有密码：提示该用户未设置密码，则引导使用邮箱+验证码登录

- - - - 否：提示没有这个username的用户，登陆失败

- - 判断输入的是邮箱

- - - 数据库表中是否有这个邮箱

- - - - 是：判断数据库有没有密码

- - - - - 有密码：核验密码
        - 没有密码：提示该用户未设置密码，则引导使用邮箱+验证码登录

- - - - 否：

- - - - - 提示没有这个email的用户，登陆失败

- 验证码登录，只能使用邮箱才能使用验证码登录，在使用邮箱+验证码登录之前提示用户若不存在该邮箱的用户则自动注册

```sql
CREATE TABLE Users (
    accountId INT PRIMARY KEY,  -- UID
    username VARCHAR(255), -- 用户名 不能有中文 
    nickname VARCHAR(255), -- 昵称 可以有中文
    password VARCHAR(255),  -- 密码
    email VARCHAR(255), -- 邮箱
    phoneNumber VARCHAR(20), -- 电话号
    UNIQUE(username), -- 确保用户名唯一
    UNIQUE(email) -- 确保电子邮件唯一
);
```



### 商家账户表 MerchantUsers

```sql
CREATE TABLE MerchantUsers (
    accountId INT PRIMARY KEY,  -- 商家账户ID
    username VARCHAR(255) NOT NULL, -- 用户名
    password VARCHAR(255),  -- 密码
    email VARCHAR(255), -- 邮箱
    phoneNumber VARCHAR(20), -- 电话号码
    merchantId INT, -- 关联到商家表的商家ID
    UNIQUE(username), -- 确保用户名唯一
    UNIQUE(email), -- 确保电子邮件唯一
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId) -- 外键关联到Merchants表
);
```

### 邮箱验证表 EmailVerifications

```sql
CREATE TABLE EmailVerifications (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    expiry_time DATETIME NOT NULL,
    UNIQUE(email)
);
```



### 商家表 Merchants

```sql
USE CampusSnackDB;
CREATE TABLE Merchants (
    merchantId INT AUTO_INCREMENT PRIMARY KEY, -- 主键，自增
    storeName VARCHAR(255) NOT NULL, -- 商店名称
    image VARCHAR(255), -- 商店图片URL
    priceRangeLow DECIMAL(10,2), -- 价格区间低
    priceRangeHigh DECIMAL(10,2), -- 价格区间高
    mainDish VARCHAR(255), -- 主打菜品
    operatingHours VARCHAR(50), -- 营业时间
    locationDescription VARCHAR(255), -- 地点描述
    rating DECIMAL(3,1), -- 评分
    monthlySales INT, -- 月销量
    description TEXT, -- 商家描述
    hasSpecialPrice BOOLEAN, -- 是否有特价
    hasDiscount BOOLEAN -- 是否有折扣
);
USE CampusSnackDB;
INSERT INTO Merchants (storeName, image, priceRangeLow, priceRangeHigh, mainDish, operatingHours, locationDescription, rating, monthlySales, description, hasSpecialPrice, hasDiscount)
VALUES
('李大夫小吃', 'images/merchants/thumbnails/merchant_1.jpg', 10, 20, '煎饼果子', '09:00-17:00', '图书馆旁边', 4.5, 120, '传统小吃，美味可口', TRUE, TRUE),
('张姐快餐', 'images/merchants/thumbnails/merchant_2.jpg', 15, 25, '盖浇饭, 小炒肉', '10:00-20:00', '体育馆对面', 4.0, 95, '快速便餐，经济实惠', TRUE, FALSE),
('周师傅面馆', 'images/merchants/thumbnails/merchant_3.jpg', 12, 30, '拉面, 牛肉面, 鸡蛋面', '08:00-18:00', '学生活动中心旁', 4.2, 150, '手工面条，地道风味', TRUE, TRUE),
('老李水果店', 'images/merchants/thumbnails/merchant_4.jpg', 5, 15, '新鲜水果, 果汁', '08:00-22:00', '北门外', 3.8, 80, '新鲜健康，多种选择', FALSE, FALSE),
('黄阿姨早餐', 'images/merchants/thumbnails/merchant_5.jpg', 3, 10, '豆浆油条, 煎饼', '05:00-11:00', '东门内', 4.5, 200, '营养早餐，快速方便', TRUE, FALSE),
('刘师傅烧烤', 'images/merchants/thumbnails/merchant_6.jpg', 20, 50, '烧烤, 烤鱼, 羊肉串', '18:00-24:00', '南门外', 4.3, 180, '夜晚美食，烤制精美', TRUE, TRUE),
('香辣虾大王', 'images/merchants/thumbnails/merchant_7.jpg', 25, 45, '香辣虾', '10:00-22:00', '西门外', 3.9, 140, '特色小吃，辣味十足', FALSE, TRUE),
('清心茶铺', 'images/merchants/thumbnails/merchant_8.jpg', 8, 20, '各式茶饮, 点心', '10:00-21:00', '图书馆对面', 4.1, 110, '休闲时光，轻松一刻', FALSE, FALSE),
('甜心蛋糕坊', 'images/merchants/thumbnails/merchant_9.jpg', 15, 50, '蛋糕, 甜点, 咖啡', '09:00-19:00', '艺术学院旁', 4.7, 160, '甜蜜享受，精致生活', TRUE, TRUE),
('韩式料理屋', 'images/merchants/thumbnails/merchant_10.jpg', 18, 40, '韩国料理, 泡菜, 烤肉', '11:00-21:00', '国际学生宿舍旁', 4.4, 190, '地道韩食，异国情调', TRUE, FALSE);
```



### 商品表 Products

存储商品信息，每个商品都关联到一个具体的商家，并可能有一个基础商品ID用于识别产品变体的baseProductId，变体较于正常商品区别在于有些配料是固定选项不可改，通常变体用于套餐。



价格的显示逻辑

- 只有一个价格，不打折 

- - 只显示originalPrice作为现价
  - salePrice空

- 当商品打折时，有两个价格

- - salePrice为打折后的价格
  - originalPrice为原价

- 商品增加时



discountInfo 折扣字段在后端手动计算，取消该字段

```sql
CREATE TABLE Products (
    productId INT AUTO_INCREMENT PRIMARY KEY, -- 商品/套餐ID，自增
    merchantId INT, -- 商家ID，外键关联到Merchants表
    type ENUM('product', 'bundle') NOT NULL DEFAULT 'product', -- 商品类型 是否为套餐
    baseProductId INT DEFAULT NULL, -- 基础商品ID，用于关联商品变体
    name VARCHAR(255) NOT NULL, -- 商品/套餐名
    portions INT DEFAULT 1, -- 几人份
    description TEXT, -- 描述
    monthlySales INT DEFAULT 0, -- 月售量
    salePrice DECIMAL(10,2), -- 售价 为空则代表无优惠
    originalPrice DECIMAL(10,2), -- 原价
    imagePath VARCHAR(255), -- 图片地址
    stock INT DEFAULT 100, -- 库存量
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId),
    FOREIGN KEY (baseProductId) REFERENCES Products(productId)
);
```





### 配料表 Options

配料选项表，包括每个配料的详细信息

配料是依托于商品存在的，若isAloneAvailableSale为真则代表当前配料可以单独售卖

```sql
CREATE TABLE Options (
    merchantId INT NOT NULL,
    optionId INT NOT NULL, -- 选项ID，自增主键
    name VARCHAR(255) NOT NULL, -- 选项名称，如“加鸡蛋”
    description TEXT, -- 选项描述
    price DECIMAL(10,2), -- 价格
    originalPrice DECIMAL(10,2) DEFAULT NULL, -- 原价 默认为空 不为空则比在售价格低
    isAloneAvailableSale BOOLEAN DEFAULT TRUE, -- 是否可单独售卖
    image VARCHAR(255) DEFAULT '',
    monthlySales INT DEFAULT 0, -- 月售量
    stock INT DEFAULT 100, -- 库存量
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId),
    PRIMARY KEY (merchantId, optionId),
    INDEX idx_optionId (optionId)
);
```



### 配料分类表 OptionTypes

定义默认的配料分类，存储标准的选项分类，optionTypeId支持具有相同名称但不同内容的分类

price 字段为单曲分类中的配菜价格，即自定义的价格，独立于options表中的price，默认为空

```sql
CREATE TABLE OptionTypes (
    optionTypeId INT, -- 分类ID
    optionId INT, -- 关联的选项ID
    price DECIMAL(10,2) DEFAULT NULL, -- 价格 可为空 为空则取默认价格
    isFixed BOOLEAN DEFAULT FALSE, -- 是否为固定选项 变体有必选option
    PRIMARY KEY (optionTypeId, optionId),  -- 使用复合主键确保唯一性
    FOREIGN KEY (optionId) REFERENCES Options(id)
);
```



### 商品配料关联表 ProductOptionsMap

price字段若不为，则当前这个配菜分类所有配菜的价格都用这个peice，为空则每个配菜都有自己的价格，默认为空，查表不需要特殊处理，正常返回即可

如果 isMultipleChoice 的值为 0，表示当前商品在选择配菜时不可多选。

如果 isMultipleChoice 的值为 1 或更高的整数，则表示可以选择的最大配菜数量。当值大于或等于该分类中配菜的总数时，用户可以选择所有的配菜。

```sql
CREATE TABLE ProductOptionsMap (
    productId INT, -- 商品ID
    optionTypeId INT, -- 配料分类ID
    optionTypeName VARCHAR(255), -- 分类名称
    price DECIMAL(10,2) DEFAULT NULL, -- 分类价格
    isMultipleChoice INT DEFAULT 1, -- 是否多选
    PRIMARY KEY (productId, optionTypeId), -- 主键，确保商品与配料的唯一性
    FOREIGN KEY (productId) REFERENCES Products(productId), -- 商品ID外键，引用商品表
    FOREIGN KEY (optionTypeId) REFERENCES OptionTypes(optionTypeId) -- 配料ID外键，引用配料表
);
```

### 

### 套餐商品关联表 BundleProductsMap

套餐商品表，存储套餐中的每个商品及其数量等信息。

若有套餐中的商品配菜是固定的，可以利用变体商品

```sql
CREATE TABLE BundleProductsMap (
    merchantId INT, -- 商家ID
    bundleId INT, -- 套餐ID
    category VARCHAR(255), -- 商品在当前套餐中的自定义的分类 比如套餐本身中包含主食和饮品或者汤
    productId INT, -- 商品ID
    quantity INT DEFAULT 1, -- 商品数量
    FOREIGN KEY (bundleId) REFERENCES Products(productId),
    FOREIGN KEY (productId) REFERENCES Products(productId),
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId),
    PRIMARY KEY (merchantId, bundleId, productId)
);
```



### 分类表 ProductCategories

isCondimentCategory 代表是否为配菜分类，如果是的话，在后端处理中单独处理这个字段，因为这个分类是不在BundleProductsMap中关联任何商品的，而是去Options表中去取isAloneAvailableSale为真的字段

```sql
CREATE TABLE ProductCategories (
    merchantId INT, -- 商家ID
    categoryId INT, -- 分类ID，自增主键
    name VARCHAR(255) NOT NULL, -- 分类名称，如“饮料”
    description TEXT, -- 分类描述
    isCondimentCategory BOOLEAN DEFAULT FALSE, -- 表述该分类是否为配菜分类
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId),
    PRIMARY KEY (merchantId, categoryId),
    INDEX idx_categoryId (categoryId)
);
```



### 商家商品分类表 MerchantProductMap

```sql
CREATE TABLE MerchantProductMap(
    merchantId INT, -- 商家ID
    categoryId INT, -- 分类ID
    productId INT,  -- 商品/套餐ID
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId),
    FOREIGN KEY (categoryId) REFERENCES ProductCategories(categoryId),
    FOREIGN KEY (productId) REFERENCES Products(productId),
    PRIMARY KEY (merchantId, categoryId, productId)
);
```

### 

### 订单表 (Orders)

```sql
-- 订单表
CREATE TABLE Orders (
    orderId VARCHAR(255) PRIMARY KEY, -- 订单ID
    userId INT, -- 下单的用户ID
    merchantId INT, -- 商家ID
    storeName VARCHAR(255), -- 商店名称
    payStatus ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending', -- 订单支付状态（未支付，已支付，已取消）
    mealStatus ENUM('preparing', 'readyForPickup', 'pickedUp') DEFAULT 'preparing', -- 订单餐品状态 (备餐中，待取餐，已取餐)
    salePrice DECIMAL(10, 2), -- 订单总金额
    originalPrice DECIMAL(10, 2), -- 订单总原价
    discount DECIMAL(10, 2), -- 订单总优惠
    orderTime DATETIME DEFAULT CURRENT_TIMESTAMP, -- 下单时间
    orderDate DATE DEFAULT CUTTENT_DATE,
    pickupNumber INT,
    UNIQUE (orderDate, pickupNumber),
    FOREIGN KEY (userId) REFERENCES Users(accountId), -- 关联用户表
    FOREIGN KEY (merchantId) REFERENCES Merchants(merchantId) -- 关联商家表
);

-- 订单详细信息表
CREATE TABLE OrderDetails (
    orderId INT, -- 关联订单ID
    productId INT, -- 商品ID
    productName VARCHAR(255), -- 商品/套餐名
    quantity INT, -- 商品数量
    salePrice DECIMAL(10, 2), -- 商品单价 
    originalPrice DECIMAL(10, 2), -- 商品原单价
    discount DECIMAL(10, 2) -- 商品优惠价
    totalSalePrice DECIMAL(10, 2), -- 商品总金额
    totalOriginalPrice DECIMAL(10, 2), -- 商品总原价
    totalDiscount DECIMAL(10, 2), -- 商品总优惠
    PRIMARY KEY (orderId, productId), -- 复合主键
    FOREIGN KEY (orderId) REFERENCES Orders(orderId), -- 关联订单表
    FOREIGN KEY (productId) REFERENCES Products(productId) -- 关联商品表
);
```



