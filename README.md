# campus-snack-order-web-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# 项目命名规范

在本项目中，我们遵循以下命名规范来确保代码的一致性和可读性。

## 组件文件

- **PascalCase（大驼峰式）**：所有 Vue 组件文件均采用 PascalCase 命名。
    - 例：`MyComponent.vue`

## JavaScript 和 Vue 文件

- **camelCase（小驼峰式）**：JavaScript 文件内的变量和函数使用 camelCase 命名。
    - 例：`export const myFunction = () => {...};`

## CSS/SCSS 文件

- **Kebab-case（短横线分隔）**：样式文件和 CSS 类名使用 kebab-case 命名。
    - 例：`global-styles.scss`

## 素材和静态文件

- **小写，短横线分隔**：图片、字体等静态资源文件名称全部使用小写，单词之间使用短横线分隔。
    - 例：`logo.png`, `background-image.jpg`

## 目录名

- **小写，短横线分隔**：目录名称使用小写，单词之间可以使用短横线分隔。
    - 例：`assets/`, `components/`

## Vue 组件内部

### Data 属性变量

- **camelCase（小驼峰式）**：在 `data` 函数返回的对象中，所有属性名使用 camelCase 命名。
  - 例：`data() { return { itemCount: 0, userName: '' }; }`

### 方法（函数）名

- **camelCase（小驼峰式）**：组件的方法名应使用 camelCase 命名，这包括组件的生命周期钩子和自定义方法。
  - 例：`methods: { fetchData() {...}, calculateTotal() {...} }`
  
以上规范旨在提高项目的整体可维护性和协作效率。请所有贡献者遵守这些规范。

