const fs = require('fs')

// 配置项
const config = {
  // filePath: '../views/MainLayout.vue', // 指定需要转换的文件路径
  filePath: '../components/BottomNav.vue', // 指定需要转换的文件路径
  baseFontSize: 16 // 基础字体大小，用于计算rem
}

// px到rem的转换函数
function pxToRem (pxValue) {
  return `${pxValue / config.baseFontSize}rem`
}

// 读取并转换文件内容
function convertPxToRem (filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err)
      return
    }

    // 使用正则表达式匹配并替换所有的px单位
    const result = data.replace(/(\d+)px/g, (match, p1) => pxToRem(parseFloat(p1)))

    // 将转换后的内容写回文件
    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err)
        return
      }
      console.log(`Conversion completed and saved to ${filePath}`)
    })
  })
}

// 运行转换函数
convertPxToRem(config.filePath)
