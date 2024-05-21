-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        8.0.33 - MySQL Community Server - GPL
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- 导出 campussnackdb 的数据库结构
CREATE DATABASE IF NOT EXISTS `campussnackdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `campussnackdb`;

-- 导出  表 campussnackdb.bundleproductsmap 结构
CREATE TABLE IF NOT EXISTS `bundleproductsmap` (
  `merchantId` int NOT NULL,
  `bundleId` int NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `productId` int NOT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`merchantId`,`bundleId`,`productId`),
  KEY `bundleproductsmap_ibfk_1` (`bundleId`),
  KEY `bundleproductsmap_ibfk_2` (`productId`),
  CONSTRAINT `bundleproductsmap_ibfk_1` FOREIGN KEY (`bundleId`) REFERENCES `products` (`productId`),
  CONSTRAINT `bundleproductsmap_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`),
  CONSTRAINT `bundleproductsmap_ibfk_3` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.bundleproductsmap 的数据：~10 rows (大约)
DELETE FROM `bundleproductsmap`;
INSERT INTO `bundleproductsmap` (`merchantId`, `bundleId`, `category`, `productId`, `quantity`) VALUES
	(1, 11, '饮品', 2, 1),
	(1, 11, '主食', 3, 1),
	(1, 12, '主食', 1, 1),
	(1, 12, '饮品', 2, 1),
	(1, 13, '主食', 9, 1),
	(1, 13, '主食', 10, 1),
	(1, 14, '主食', 4, 1),
	(1, 14, '饮品', 7, 1),
	(1, 15, '主食', 5, 1),
	(1, 15, '饮品', 8, 1);

-- 导出  表 campussnackdb.emailverifications 结构
CREATE TABLE IF NOT EXISTS `emailverifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `verification_code` varchar(6) NOT NULL,
  `expiry_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.emailverifications 的数据：~2 rows (大约)
DELETE FROM `emailverifications`;

-- 导出  表 campussnackdb.merchantproductmap 结构
CREATE TABLE IF NOT EXISTS `merchantproductmap` (
  `merchantId` int NOT NULL,
  `categoryId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`merchantId`,`categoryId`,`productId`),
  KEY `categoryId` (`categoryId`),
  KEY `productId` (`productId`),
  CONSTRAINT `merchantproductmap_ibfk_1` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`),
  CONSTRAINT `merchantproductmap_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `productcategories` (`categoryId`),
  CONSTRAINT `merchantproductmap_ibfk_3` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.merchantproductmap 的数据：~14 rows (大约)
DELETE FROM `merchantproductmap`;
INSERT INTO `merchantproductmap` (`merchantId`, `categoryId`, `productId`) VALUES
	(1, 1, 2),
	(1, 1, 7),
	(1, 1, 8),
	(1, 2, 9),
	(1, 2, 10),
	(1, 3, 1),
	(1, 3, 3),
	(1, 3, 4),
	(1, 3, 5),
	(1, 4, 11),
	(1, 4, 12),
	(1, 4, 13),
	(1, 4, 14),
	(1, 4, 15);

-- 导出  表 campussnackdb.merchants 结构
CREATE TABLE IF NOT EXISTS `merchants` (
  `merchantId` int NOT NULL AUTO_INCREMENT,
  `storeName` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `priceRangeLow` decimal(10,2) DEFAULT NULL,
  `priceRangeHigh` decimal(10,2) DEFAULT NULL,
  `mainDish` varchar(255) DEFAULT NULL,
  `operatingHours` varchar(50) DEFAULT NULL,
  `locationDescription` varchar(255) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `monthlySales` int DEFAULT NULL,
  `description` text,
  `hasSpecialPrice` tinyint(1) DEFAULT NULL,
  `hasDiscount` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`merchantId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.merchants 的数据：~10 rows (大约)
DELETE FROM `merchants`;
INSERT INTO `merchants` (`merchantId`, `storeName`, `image`, `priceRangeLow`, `priceRangeHigh`, `mainDish`, `operatingHours`, `locationDescription`, `rating`, `monthlySales`, `description`, `hasSpecialPrice`, `hasDiscount`) VALUES
	(1, '李大夫小吃', 'images/merchants/thumbnails/merchant_1.jpg', 10.00, 20.00, '煎饼果子', '09:00-17:00', '图书馆旁边', 4.5, 120, '传统小吃，美味可口', 1, 1),
	(2, '张姐快餐', 'images/merchants/thumbnails/merchant_2.jpg', 15.00, 25.00, '盖浇饭, 小炒肉', '10:00-20:00', '体育馆对面', 4.0, 95, '快速便餐，经济实惠', 1, 0),
	(3, '周师傅面馆', 'images/merchants/thumbnails/merchant_3.jpg', 12.00, 30.00, '拉面, 牛肉面, 鸡蛋面', '08:00-18:00', '学生活动中心旁', 4.2, 150, '手工面条，地道风味', 1, 1),
	(4, '老李水果店', 'images/merchants/thumbnails/merchant_4.jpg', 5.00, 15.00, '新鲜水果, 果汁', '08:00-22:00', '北门外', 3.8, 80, '新鲜健康，多种选择', 0, 0),
	(5, '黄阿姨早餐', 'images/merchants/thumbnails/merchant_5.jpg', 3.00, 10.00, '豆浆油条, 煎饼', '05:00-11:00', '东门内', 4.5, 200, '营养早餐，快速方便', 1, 0),
	(6, '刘师傅烧烤', 'images/merchants/thumbnails/merchant_6.jpg', 20.00, 50.00, '烧烤, 烤鱼, 羊肉串', '18:00-24:00', '南门外', 4.3, 180, '夜晚美食，烤制精美', 1, 1),
	(7, '香辣虾大王', 'images/merchants/thumbnails/merchant_7.jpg', 25.00, 45.00, '香辣虾', '10:00-22:00', '西门外', 3.9, 140, '特色小吃，辣味十足', 0, 1),
	(8, '清心茶铺', 'images/merchants/thumbnails/merchant_8.jpg', 8.00, 20.00, '各式茶饮, 点心', '10:00-21:00', '图书馆对面', 4.1, 110, '休闲时光，轻松一刻', 0, 0),
	(9, '甜心蛋糕坊', 'images/merchants/thumbnails/merchant_9.jpg', 15.00, 50.00, '蛋糕, 甜点, 咖啡', '09:00-19:00', '艺术学院旁', 4.7, 160, '甜蜜享受，精致生活', 1, 1),
	(10, '韩式料理屋', 'images/merchants/thumbnails/merchant_10.jpg', 18.00, 40.00, '韩国料理, 泡菜, 烤肉', '11:00-21:00', '国际学生宿舍旁', 4.4, 190, '地道韩食，异国情调', 1, 0),
	(11, '商户名称1', 'images/merchants/thumbnails/merchant_1.jpg', 10.00, 30.00, '主要菜品1', '08:00-22:00', '地点描述1', 4.8, 150000, '商户描述1', 1, 1),
	(12, '商户名称2', 'images/merchants/thumbnails/merchant_2.jpg', 15.00, 40.00, '主要菜品2', '09:00-23:00', '地点描述2', 4.6, 200000, '商户描述2', 0, 1);

-- 导出  表 campussnackdb.merchantusers 结构
CREATE TABLE IF NOT EXISTS `merchantusers` (
  `accountId` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `merchantId` int DEFAULT NULL,
  PRIMARY KEY (`accountId`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `merchantId` (`merchantId`),
  CONSTRAINT `merchantusers_ibfk_1` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.merchantusers 的数据：~10 rows (大约)
DELETE FROM `merchantusers`;
INSERT INTO `merchantusers` (`accountId`, `username`, `password`, `email`, `phoneNumber`, `merchantId`) VALUES
	(10601490, 'zjkc123', '12345678', NULL, NULL, 2),
	(10816614, 'xlxdw123', '12345678', NULL, NULL, 7),
	(11993256, 'txdgf123', '12345678', NULL, NULL, 9),
	(32285212, 'cssj123', '12345678', NULL, NULL, NULL),
	(35508273, 'llsgd123', '12345678', NULL, NULL, 4),
	(57212547, 'lsfsk123', '12345678', NULL, NULL, 6),
	(76540338, 'zsfmg123', '12345678', NULL, NULL, 3),
	(77998385, 'hsllw123', '12345678', NULL, NULL, 10),
	(78788546, 'ldfxc123', '12345678', NULL, NULL, 1),
	(86483189, 'qxcp123', '12345678', NULL, NULL, 8),
	(87114714, 'hayzc123', '12345678', NULL, NULL, 8);

-- 导出  表 campussnackdb.options 结构
CREATE TABLE IF NOT EXISTS `options` (
  `merchantId` int NOT NULL,
  `optionId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT '',
  `monthlySales` int DEFAULT '0',
  `stock` int DEFAULT '100',
  `isAloneAvailableSale` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`merchantId`,`optionId`),
  KEY `idx_optionId` (`optionId`),
  CONSTRAINT `options_ibfk_1` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.options 的数据：~7 rows (大约)
DELETE FROM `options`;
INSERT INTO `options` (`merchantId`, `optionId`, `name`, `description`, `price`, `originalPrice`, `image`, `monthlySales`, `stock`, `isAloneAvailableSale`) VALUES
	(1, 1, '加鸡蛋', '鲜嫩煎蛋', 2.00, 2.00, '', 0, 100, 1),
	(1, 2, '加香肠', '美味香肠', 3.00, 3.00, '', 0, 100, 1),
	(1, 3, '加辣椒酱', '自制辣椒酱', 1.00, 0.00, '', 0, 100, 0),
	(1, 4, '加番茄酱', '甜美番茄酱', 1.00, 1.00, '', 0, 100, 0),
	(1, 5, '加酸奶酱', '清爽酸奶酱', 1.50, 1.50, '', 0, 100, 0),
	(1, 6, '加紫薯面皮', '健康紫薯', 2.50, 2.50, '', 0, 100, 0),
	(1, 7, '加原味面皮', '传统风味', 2.00, 2.00, '', 0, 100, 1);

-- 导出  表 campussnackdb.optiontypes 结构
CREATE TABLE IF NOT EXISTS `optiontypes` (
  `optionTypeId` int NOT NULL,
  `optionId` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `isFixed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`optionTypeId`,`optionId`),
  KEY `optionId` (`optionId`),
  CONSTRAINT `optiontypes_ibfk_1` FOREIGN KEY (`optionId`) REFERENCES `options` (`optionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.optiontypes 的数据：~7 rows (大约)
DELETE FROM `optiontypes`;
INSERT INTO `optiontypes` (`optionTypeId`, `optionId`, `price`, `isFixed`) VALUES
	(1, 1, NULL, 0),
	(1, 2, NULL, 0),
	(2, 3, NULL, 0),
	(2, 4, NULL, 0),
	(2, 5, NULL, 0),
	(3, 6, NULL, 0),
	(3, 7, NULL, 0);

-- 导出  表 campussnackdb.orderdetails 结构
CREATE TABLE IF NOT EXISTS `orderdetails` (
  `orderId` varchar(255) NOT NULL DEFAULT '',
  `productId` int NOT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `salePrice` decimal(10,2) DEFAULT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `totalSalePrice` decimal(10,2) DEFAULT NULL,
  `totalOriginalPrice` decimal(10,2) DEFAULT NULL,
  `totalDiscount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`orderId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.orderdetails 的数据：~61 rows (大约)
DELETE FROM `orderdetails`;
INSERT INTO `orderdetails` (`orderId`, `productId`, `productName`, `quantity`, `salePrice`, `originalPrice`, `discount`, `totalSalePrice`, `totalOriginalPrice`, `totalDiscount`) VALUES
	('00000001281200021715615377', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001281200021715615377', 10, '凉皮', 2, 0.00, 6.00, NULL, 0.00, 12.00, 0.00),
	('00000001281200021715615493', 8, '绿豆汤', 1, 4.00, 5.00, NULL, 4.00, 5.00, 1.00),
	('00000001281200021715615493', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001281200021716211206', 12, '午餐套餐A', 1, 0.00, 9.00, NULL, 0.00, 9.00, 0.00),
	('00000001281200021716211206', 13, '午餐套餐B', 4, 0.00, 10.00, NULL, 0.00, 40.00, 0.00),
	('00000001382958181715328828', 1, '煎饼果子-基础款', 2, 0.00, 10.00, NULL, 0.00, 20.00, 0.00),
	('00000001382958181715328828', 9, '肉夹馍', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001382958181715328828', 10, '凉皮', 1, 0.00, 6.00, NULL, 0.00, 6.00, 0.00),
	('00000001382958181715356281', 2, '豆浆', 3, 3.60, 4.00, NULL, 10.80, 12.00, 1.20),
	('00000001382958181715356281', 4, '煎饼果子-加蛋', 1, 0.00, 12.00, NULL, 0.00, 12.00, 0.00),
	('00000001382958181715356281', 7, '冰红茶', 4, 0.00, 3.00, NULL, 0.00, 12.00, 0.00),
	('00000001382958181715356281', 8, '绿豆汤', 5, 4.00, 5.00, NULL, 20.00, 25.00, 5.00),
	('00000001382958181715356281', 9, '肉夹馍', 2, 8.10, 9.00, NULL, 16.20, 18.00, 1.80),
	('00000001382958181715356281', 10, '凉皮', 3, 0.00, 6.00, NULL, 0.00, 18.00, 0.00),
	('00000001382958181715356282', 2, '豆浆', 3, 3.60, 4.00, NULL, 10.80, 12.00, 1.20),
	('00000001382958181715356282', 4, '煎饼果子-加蛋', 1, 0.00, 12.00, NULL, 0.00, 12.00, 0.00),
	('00000001382958181715356282', 7, '冰红茶', 4, 0.00, 3.00, NULL, 0.00, 12.00, 0.00),
	('00000001382958181715356282', 8, '绿豆汤', 5, 4.00, 5.00, NULL, 20.00, 25.00, 5.00),
	('00000001382958181715356282', 9, '肉夹馍', 2, 8.10, 9.00, NULL, 16.20, 18.00, 1.80),
	('00000001382958181715356282', 10, '凉皮', 3, 0.00, 6.00, NULL, 0.00, 18.00, 0.00),
	('00000001513679571715389947', 2, '豆浆', 6, 3.60, 4.00, NULL, 21.60, 24.00, 2.40),
	('00000001513679571715389971', 2, '豆浆', 6, 3.60, 4.00, NULL, 21.60, 24.00, 2.40),
	('00000001513679571715390861', 2, '豆浆', 1, 3.60, 4.00, NULL, 3.60, 4.00, 0.40),
	('00000001513679571715390864', 2, '豆浆', 1, 3.60, 4.00, NULL, 3.60, 4.00, 0.40),
	('00000001513679571715390869', 2, '豆浆', 1, 3.60, 4.00, NULL, 3.60, 4.00, 0.40),
	('00000001513679571715400104', 2, '豆浆', 3, 3.60, 4.00, NULL, 10.80, 12.00, 1.20),
	('00000001513679571715450062', 7, '冰红茶', 5, 0.00, 3.00, NULL, 0.00, 15.00, 0.00),
	('00000001513679571715454306', 2, '豆浆11', 3, 3.60, 4.00, NULL, 10.80, 12.00, 1.20),
	('00000001513679571715454484', 9, '肉夹馍111', 2, 8.10, 9.00, NULL, 16.20, 18.00, 1.80),
	('00000001513679571715454582', 10, '凉皮', 4, 0.00, 6.00, NULL, 0.00, 24.00, 0.00),
	('00000001513679571715454606', 9, '肉夹馍111', 2, 8.10, 9.00, NULL, 16.20, 18.00, 1.80),
	('00000001513679571715454651', 8, '绿豆汤', 5, 4.00, 5.00, NULL, 20.00, 25.00, 5.00),
	('00000001513679571715455199', 12, '午餐套餐A', 3, 0.00, 9.00, NULL, 0.00, 27.00, 0.00),
	('00000001513679571715455240', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715455298', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715455314', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715455337', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715455403', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715455411', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715455418', 8, '绿豆汤', 1, 4.00, 5.00, NULL, 4.00, 5.00, 1.00),
	('00000001513679571715455510', 8, '绿豆汤', 1, 4.00, 5.00, NULL, 4.00, 5.00, 1.00),
	('00000001513679571715456824', 8, '绿豆汤', 1, 4.00, 5.00, NULL, 4.00, 5.00, 1.00),
	('00000001513679571715456960', 8, '绿豆汤', 1, 4.00, 5.00, NULL, 4.00, 5.00, 1.00),
	('00000001513679571715457070', 7, '冰红茶', 1, 0.00, 3.00, NULL, 0.00, 3.00, 0.00),
	('00000001513679571715457134', 9, '肉夹馍111', 2, 8.10, 9.00, NULL, 16.20, 18.00, 1.80),
	('00000001513679571715457157', 9, '肉夹馍111', 2, 8.10, 9.00, NULL, 16.20, 18.00, 1.80),
	('00000001513679571715457157', 10, '凉皮', 1, 0.00, 6.00, NULL, 0.00, 6.00, 0.00),
	('00000001513679571715457225', 8, '绿豆汤', 3, 4.00, 5.00, NULL, 12.00, 15.00, 3.00),
	('00000001513679571715581256', 2, '豆浆11', 1, 3.60, 4.00, NULL, 3.60, 4.00, 0.40),
	('00000001513679571715581284', 7, '冰红茶', 4, 0.00, 3.00, NULL, 0.00, 12.00, 0.00),
	('00000001513679571715581471', 10, '凉皮', 1, 0.00, 6.00, NULL, 0.00, 6.00, 0.00),
	('00000001513679571715584287', 2, '豆浆', 2, 3.60, 4.00, NULL, 7.20, 8.00, 0.80),
	('00000001513679571715584287', 3, '油条', 3, 0.00, 2.00, NULL, 0.00, 6.00, 0.00),
	('00000001513679571715614007', 2, '豆浆', 3, 3.60, 4.00, NULL, 10.80, 12.00, 1.20),
	('00000001513679571715614113', 9, '肉夹馍111', 4, 8.10, 9.00, NULL, 32.40, 36.00, 3.60),
	('00000001513679571715614752', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001513679571715622424', 2, '豆浆111', 2, 3.60, 4.00, NULL, 7.20, 8.00, 0.80),
	('00000001513679571715645029', 2, '豆浆111', 4, 3.60, 4.00, NULL, 14.40, 16.00, 1.60),
	('00000001513679571715646465', 7, '冰红茶', 1, 0.00, 3.00, NULL, 0.00, 3.00, 0.00),
	('00000001513679571715646465', 8, '绿豆汤', 2, 4.00, 5.00, NULL, 8.00, 10.00, 2.00),
	('00000001513679571715646491', 7, '冰红茶', 1, 0.00, 3.00, NULL, 0.00, 3.00, 0.00),
	('00000001513679571715646491', 8, '绿豆汤', 1, 4.00, 5.00, NULL, 4.00, 5.00, 1.00),
	('00000001513679571715650631', 9, '肉夹馍111', 1, 8.10, 9.00, NULL, 8.10, 9.00, 0.90),
	('00000001731859551715438153', 2, '豆浆', 2, 3.60, 4.00, NULL, 7.20, 8.00, 0.80),
	('00000001731859551715438153', 5, '煎饼果子-加肠', 2, 0.00, 15.00, NULL, 0.00, 30.00, 0.00),
	('00000001731859551715438153', 7, '冰红茶', 1, 0.00, 3.00, NULL, 0.00, 3.00, 0.00),
	('00000002513679571715621731', 1, '煎饼果子-基础款', 2, 0.00, 10.00, NULL, 0.00, 20.00, 0.00),
	('00000002513679571715621731', 2, '豆浆111', 1, 3.60, 4.00, NULL, 3.60, 4.00, 0.40);

-- 导出  表 campussnackdb.orders 结构
CREATE TABLE IF NOT EXISTS `orders` (
  `orderId` varchar(255) NOT NULL DEFAULT '0',
  `userId` int DEFAULT NULL,
  `merchantId` int DEFAULT NULL,
  `storeName` varchar(255) DEFAULT NULL,
  `payStatus` enum('pending','paid','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `mealStatus` enum('preparing','readyForPickup','pickedUp') DEFAULT 'preparing',
  `orderTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `orderDate` date DEFAULT NULL,
  `pickupNumber` int DEFAULT NULL,
  `salePrice` decimal(10,2) DEFAULT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`orderId`),
  UNIQUE KEY `orderDate_pickupNumber` (`orderDate`,`pickupNumber`),
  KEY `userId` (`userId`),
  KEY `merchantId` (`merchantId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`accountId`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.orders 的数据：~41 rows (大约)
DELETE FROM `orders`;
INSERT INTO `orders` (`orderId`, `userId`, `merchantId`, `storeName`, `payStatus`, `mealStatus`, `orderTime`, `orderDate`, `pickupNumber`, `salePrice`, `originalPrice`, `discount`) VALUES
	('00000001281200021715615377', 28120002, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-13 23:49:38', '2024-05-13', 8, 20.10, 9.00, 0.90),
	('00000001281200021715615493', 28120002, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-13 23:51:33', '2024-05-13', 9, 12.10, 14.00, 1.90),
	('00000001281200021716211206', 28120002, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-20 21:20:07', '2024-05-20', 1, 49.00, 49.00, 0.00),
	('00000001382958181715328828', 38295818, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-10 16:13:49', '2024-05-10', 1, 34.10, 35.00, 0.90),
	('00000001382958181715356281', 38295818, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-10 23:51:22', '2024-05-10', 2, NULL, NULL, NULL),
	('00000001382958181715356282', 38295818, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-10 23:51:23', '2024-05-10', 3, NULL, NULL, NULL),
	('00000001513679571715389947', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-11 09:12:28', '2024-05-11', 1, 21.60, 24.00, 2.40),
	('00000001513679571715389971', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-11 09:12:52', '2024-05-11', 2, 21.60, 24.00, 2.40),
	('00000001513679571715390861', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-11 09:27:41', '2024-05-11', 3, 3.60, 4.00, 0.40),
	('00000001513679571715390864', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-11 09:27:45', '2024-05-11', 4, 3.60, 4.00, 0.40),
	('00000001513679571715390869', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-11 09:27:50', '2024-05-11', 5, NULL, NULL, NULL),
	('00000001513679571715400104', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-11 12:01:45', '2024-05-11', 6, 10.80, 12.00, 1.20),
	('00000001513679571715450062', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 01:54:23', '2024-05-12', 1, 15.00, 15.00, 0.00),
	('00000001513679571715454306', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:05:07', '2024-05-12', 2, 10.80, 12.00, 1.20),
	('00000001513679571715454484', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:08:05', '2024-05-12', 3, 16.20, 18.00, 1.80),
	('00000001513679571715454582', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:09:42', '2024-05-12', 4, 24.00, 24.00, 0.00),
	('00000001513679571715454606', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:10:06', '2024-05-12', 5, 16.20, 18.00, 1.80),
	('00000001513679571715454651', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:10:52', '2024-05-12', 6, 20.00, 25.00, 5.00),
	('00000001513679571715455196', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:19:57', '2024-05-12', 7, 0.00, 0.00, 0.00),
	('00000001513679571715455199', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:20:00', '2024-05-12', 8, 27.00, 27.00, 0.00),
	('00000001513679571715455240', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:20:40', '2024-05-12', 9, NULL, NULL, NULL),
	('00000001513679571715455298', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:21:39', '2024-05-12', 10, 8.10, 9.00, 0.90),
	('00000001513679571715455314', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:21:55', '2024-05-12', 11, NULL, NULL, NULL),
	('00000001513679571715455337', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:22:17', '2024-05-12', 12, NULL, NULL, NULL),
	('00000001513679571715455403', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:23:23', '2024-05-12', 13, NULL, NULL, NULL),
	('00000001513679571715455411', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:23:32', '2024-05-12', 14, 8.10, 9.00, 0.90),
	('00000001513679571715455418', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:23:39', '2024-05-12', 15, NULL, NULL, NULL),
	('00000001513679571715455510', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:25:11', '2024-05-12', 16, 4.00, 5.00, 1.00),
	('00000001513679571715456824', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:47:05', '2024-05-12', 17, NULL, NULL, NULL),
	('00000001513679571715456960', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:49:21', '2024-05-12', 18, 4.00, 5.00, 1.00),
	('00000001513679571715457070', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:51:10', '2024-05-12', 19, 3.00, 0.00, 0.00),
	('00000001513679571715457134', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:52:14', '2024-05-12', 20, 16.20, 18.00, 1.80),
	('00000001513679571715457157', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-12 03:52:37', '2024-05-12', 21, 22.20, 18.00, 1.80),
	('00000001513679571715457225', 51367957, 1, '李大夫小吃', 'paid', 'preparing', '2024-05-12 03:53:46', '2024-05-12', 22, 12.00, 15.00, 3.00),
	('00000001513679571715581256', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-13 14:20:57', '2024-05-13', 1, 3.60, 4.00, 0.40),
	('00000001513679571715581284', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-13 14:21:25', '2024-05-13', 2, 12.00, 12.00, 0.00),
	('00000001513679571715581471', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-13 14:24:31', '2024-05-13', 3, 6.00, 6.00, 0.00),
	('00000001513679571715584287', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-13 15:11:28', '2024-05-13', 4, 13.20, 14.00, 0.80),
	('00000001513679571715614007', 51367957, 1, '李大夫小吃', 'paid', 'readyForPickup', '2024-05-13 23:26:48', '2024-05-13', 5, 10.80, 12.00, 1.20),
	('00000001513679571715614113', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-13 23:28:33', '2024-05-13', 6, 32.40, 36.00, 3.60),
	('00000001513679571715614752', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-13 23:39:13', '2024-05-13', 7, 8.10, 9.00, 0.90),
	('00000001513679571715622424', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-14 01:47:05', '2024-05-14', 1, 7.20, 8.00, 0.80),
	('00000001513679571715645029', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-14 08:03:50', '2024-05-14', 2, 14.40, 16.00, 1.60),
	('00000001513679571715646465', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-14 08:27:46', '2024-05-14', 3, 11.00, 10.00, 2.00),
	('00000001513679571715646491', 51367957, 1, '李大夫小吃', 'paid', 'pickedUp', '2024-05-14 08:28:12', '2024-05-14', 4, 7.00, 8.00, 1.00),
	('00000001513679571715650631', 51367957, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-14 09:37:12', '2024-05-14', 5, 8.10, 9.00, 0.90),
	('00000001731859551715438153', 73185955, 1, '李大夫小吃', 'pending', 'preparing', '2024-05-11 22:35:53', '2024-05-11', 7, 40.20, 41.00, 0.80);

-- 导出  表 campussnackdb.productcategories 结构
CREATE TABLE IF NOT EXISTS `productcategories` (
  `merchantId` int NOT NULL,
  `categoryId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `isCondimentCategory` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`merchantId`,`categoryId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `productcategories_ibfk_1` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.productcategories 的数据：~5 rows (大约)
DELETE FROM `productcategories`;
INSERT INTO `productcategories` (`merchantId`, `categoryId`, `name`, `description`, `isCondimentCategory`) VALUES
	(1, 1, '饮料', '包括各种软饮料、果汁等', 0),
	(1, 2, '主食', '包括各种主食类商品，如汉堡、鸡肉卷等', 0),
	(1, 3, '小吃', '包括煎饼果子、油条等传统小吃', 0),
	(1, 4, '套餐', '包括不同组合的套餐商品，如早餐套餐、午餐套餐等', 0),
	(1, 5, '配料', '各种额外的可选配料', 1);

-- 导出  表 campussnackdb.productoptionsmap 结构
CREATE TABLE IF NOT EXISTS `productoptionsmap` (
  `productId` int NOT NULL,
  `optionTypeId` int NOT NULL,
  `optionTypeName` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `isMultipleChoice` int DEFAULT '1',
  PRIMARY KEY (`productId`,`optionTypeId`),
  KEY `productoptionsmap_ibfk_2` (`optionTypeId`),
  CONSTRAINT `productoptionsmap_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`),
  CONSTRAINT `productoptionsmap_ibfk_2` FOREIGN KEY (`optionTypeId`) REFERENCES `optiontypes` (`optionTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.productoptionsmap 的数据：~14 rows (大约)
DELETE FROM `productoptionsmap`;
INSERT INTO `productoptionsmap` (`productId`, `optionTypeId`, `optionTypeName`, `price`, `isMultipleChoice`) VALUES
	(1, 1, '基础配料', 2.00, 1),
	(1, 2, '特色酱料', 3.00, 1),
	(1, 3, '面皮', 1.00, 0),
	(2, 1, '基础配料', NULL, 1),
	(2, 2, '特色酱料', NULL, 1),
	(2, 3, '面皮', 2.00, 0),
	(3, 1, '基础配料', NULL, 1),
	(3, 2, '特色酱料', NULL, 1),
	(4, 1, '基础配料', NULL, 1),
	(4, 2, '特色酱料', 3.00, 1),
	(4, 3, '面皮', NULL, 0),
	(5, 1, '基础配料', NULL, 1),
	(5, 2, '特色酱料', 1.00, 1),
	(5, 3, '面皮', NULL, 0);

-- 导出  表 campussnackdb.products 结构
CREATE TABLE IF NOT EXISTS `products` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `merchantId` int DEFAULT NULL,
  `type` enum('product','bundle') NOT NULL DEFAULT 'product',
  `baseProductId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `portions` int DEFAULT '1',
  `description` text,
  `monthlySales` int DEFAULT '0',
  `salePrice` decimal(10,2) DEFAULT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT '100',
  PRIMARY KEY (`productId`),
  KEY `merchantId` (`merchantId`),
  KEY `baseProductId` (`baseProductId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`merchantId`) REFERENCES `merchants` (`merchantId`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`baseProductId`) REFERENCES `products` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.products 的数据：~15 rows (大约)
DELETE FROM `products`;
INSERT INTO `products` (`productId`, `merchantId`, `type`, `baseProductId`, `name`, `portions`, `description`, `monthlySales`, `salePrice`, `originalPrice`, `imagePath`, `stock`) VALUES
	(1, 1, 'product', NULL, '煎饼果子-基础款', 1, '经典的煎饼果子，美味传统', 30, 10.00, 10.00, 'images/products/pancake_basic.jpg', 100),
	(2, 1, 'product', NULL, '豆333', 1, '新鲜自制豆浆', 40, 3.60, 4.00, 'images/products/soy_milk.jpg', 100),
	(3, 1, 'product', NULL, '油条', 1, '外酥内软，金黄可口的油条', 25, 2.00, 2.00, 'images/products/youtiao.jpg', 100),
	(4, 1, 'product', NULL, '煎饼果子-加蛋', 1, '煎饼果子加上一层鸡蛋', 35, 12.00, 12.00, 'images/products/pancake_egg.jpg', 100),
	(5, 1, 'product', NULL, '煎饼果子-加肠', 1, '煎饼果子加香肠', 20, 15.00, 15.00, 'images/products/pancake_sausage.jpg', 100),
	(6, 1, 'product', NULL, '米饭', 1, '白米饭', 50, 1.00, 1.00, 'images/products/rice.jpg', 100),
	(7, 1, 'product', NULL, '冰红茶', 1, '清凉解渴的冰红茶', 50, 3.00, 3.00, 'images/products/iced_tea.jpg', 100),
	(8, 1, 'product', NULL, '绿豆汤', 1, '凉爽的绿豆汤，消暑佳品', 30, 4.00, 5.00, 'images/products/mung_bean_soup.jpg', 100),
	(9, 1, 'product', NULL, '肉夹馍111', 1, '陕西风味肉夹馍', 40, 8.10, 9.00, 'images/products/roujiamo.jpg', 100),
	(10, 1, 'product', NULL, '凉皮', 1, '西北风味小吃凉皮', 35, 6.00, 6.00, 'images/products/liangpi.jpg', 100),
	(11, 1, 'bundle', NULL, '早餐套餐A', 1, '豆浆+油条', 15, 5.00, 5.00, 'images/products/breakfast_set_a.jpg', 100),
	(12, 1, 'bundle', NULL, '午餐套餐A', 1, '米饭+肉夹馍', 20, 9.00, 9.00, 'images/products/lunch_set_a.jpg', 100),
	(13, 1, 'bundle', NULL, '午餐套餐B', 1, '凉皮+绿豆汤', 15, 10.00, 10.00, 'images/products/lunch_set_b.jpg', 100),
	(14, 1, 'bundle', NULL, '晚餐套餐', 1, '煎饼果子加肠+冰红茶', 10, 17.10, 19.00, 'images/products/dinner_set.jpg', 100),
	(15, 1, 'bundle', NULL, '下午茶套餐', 1, '绿豆汤+油条', 15, 5.10, 6.00, 'images/products/afternoon_tea_set.jpg', 100);

-- 导出  表 campussnackdb.users 结构
CREATE TABLE IF NOT EXISTS `users` (
  `accountId` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`accountId`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 正在导出表  campussnackdb.users 的数据：~16 rows (大约)
DELETE FROM `users`;
INSERT INTO `users` (`accountId`, `username`, `nickname`, `password`, `email`, `phoneNumber`) VALUES
	(9456699, 'wolaiceshiyixia', NULL, '$2b$10$IQ7FFeU2/7N3U4au38/4SOrNI263U3C55yUAHlkSGso/vDatNtiEO', NULL, NULL),
	(12101249, 'pQYc2nWB', NULL, 'HLfNMNfZ', NULL, NULL),
	(25010773, '4RHy5LR2', NULL, 'Ioa072Zy', NULL, NULL),
	(28120002, NULL, NULL, '12345678', '1960222170@qq.com', NULL),
	(34879811, '7G4TbO9q', NULL, 'AykiRKAZ', NULL, NULL),
	(35757247, 'XqwjYpD5', NULL, '5uxIsKdb', NULL, NULL),
	(38295818, '123123dd', NULL, '$2b$10$LRN2FT0dsn1b6EE2zCTv5.Wxmn.vs/YBzg4UV2KRtT5RiiuBN7rVO', NULL, NULL),
	(39585918, 'K1TnsOr3', NULL, 'SAR4g9ci', NULL, NULL),
	(51367957, 'demo123', NULL, '12345678', NULL, NULL),
	(56777861, 'TbSe80q2', NULL, 'h_beaAOA', NULL, NULL),
	(65740930, '111111', NULL, '$2b$10$cDHHIlNsq4rysjtpDkDAmukWFOgpXwyWpAx1F4bi9Vi7hqNPpWtm.', NULL, NULL),
	(69277847, 'demo789', NULL, '12345678', NULL, NULL),
	(73185955, 'demo456', NULL, '12345678', NULL, NULL),
	(80788980, 'BdyXGqpl', NULL, 'oJfWu8Bj', NULL, NULL),
	(82597439, 'ayjsVEO7', NULL, '5L3ckvqd', NULL, NULL),
	(84852879, 'efdWaoB0', NULL, 'US_vC8tN', NULL, NULL),
	(91627388, 'EYxhnmsz', NULL, 'hyd3AKWS', NULL, NULL),
	(96583141, NULL, NULL, NULL, '327957519@qq.com', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
