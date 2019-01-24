# 那些花儿，从零开始构建Vue工程（webpack4+vue-loader）

> 从零搭建Vue开发环境：webpack4 + vue-loader + koa2 + babel-loader v8 + Babel v7 + eslint + git hooks + editorconfig

## 从2009到2019社会在不断进步 技术也在不断进步 我们当然也不能落后

<!--![](images/js2019.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e014973cc5da?w=720&h=440&f=png&s=227739)

“不积跬步无以至千里，不积小流无以成江海”

## 先开始webpack基本构建

创建一个工程目录 vue-structure

```
mkdir vue-structure && cd vue-structure
```

### 安装webpack
```
npm i webpack webpack-cli -D
```

创建build目录

```
mkdir build
```

在build目录里, 创建webpack.config.js

```
cd build && touch webpack.config.js
```

创建入口文件 src/main.js

```
mkdir src

cd src && touch main.js
```

main.js

```
alert('hello world!')
```

配置npm scripts

```
  // package.json
  "scripts": {
    "build": "webpack --config build/webpack.config.js --progress --mode production"
  }
```

### 配置devServer

```
npm i webpack-dev-server -D
```

配置npm scripts

```
  "scripts": {
    ...
    "dev": "webpack-dev-server --config build/webpack.config.js --progress --mode development"
  }
```

html 插件

```
npm i html-webpack-plugin -D
```

webpack配置
```
// build/webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir => path.join(__dirname, '..', dir)

module.exports = {
  entry: resolve('src/main.js'),
  output: {
    filename: '[name].[hash:5].js',
    path: resolve('dist')
  },
  devServer: {
    host: '0.0.0.0',
    port: 7000,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html')
    })
  ]
}

```

运行webpack dev server

```
npm run dev
```
浏览器自动打开 http://0.0.0.0:7000/

<!--![](images/alert.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e021d6442992?w=896&h=260&f=png&s=19023)

到这里webpack开发服务基本跑通了

## 配置babel v7

webpack 4.x | babel-loader 8.x | babel 7.x
```
npm i -D babel-loader @babel/core @babel/preset-env
```

babel plugin
支持动态import()
```
npm i @babel/plugin-syntax-dynamic-import -D
```

配置webpack.config.js

```
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
```

创建.babelrc文件

```
{
  "plugins": [
    "@babel/plugin-syntax-dynamic-import"
  ],
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ]
}

```

测试下ES6代码

test.js
```
  // src/test.js
  export default () => alert('hello vue!')
```

index.html
```
  // src/index.html
  <body>
    <div id="app">请说say</div>
  </body>
```

main.js
```
 // src/main.js
 document.querySelector('#app').addEventListener('click', () => {
  import('./test.js').then(res => {
    res.default()
  })
})
```

运行下dev

```
npm run dev
```

点击页面div

<!--![](images/es6-test.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e0268bf0c9e7?w=1268&h=338&f=png&s=83888)

ok 没问题

## 配置Vue Loader

### Vue Loader 是什么？

> Vue Loader 是一个 webpack 的 loader，它允许你以一种以单文件组件（*.vue文件） 的格式撰写 Vue 组件：

创建App.vue根组件

```
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello Vue!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

```

安装Vue

```
npm i vue
```

src/main.js
```
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
```

修改index.html

```
<body>
  <div id="app"></div>
</body>
```

运行dev

```
npm run dev
```

结果报错了
 webpack默认只能识别JavaScript文件，不能解析.vue文件（vue单文件组件 是Vue独有的），于是作者提供了vue-loader。

<!--![](images/vloader-error.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e02b85edd5a1?w=1384&h=358&f=png&s=87076)

Vue单文件组件

https://cn.vuejs.org/v2/guide/single-file-components.html

### 配置vue-loader

```
npm i vue-loader vue-template-compiler
```
vue-template-compiler (peer dependency) 是vue-loader的同版本依赖

webpack.config.js
```
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
}
```


vue单文件组件中css 也需要css-loader解析
```
npm i css-loader -D
```

### 配置webpack

```
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin()
  ]
}
```

此时运行npm run dev OK了，App.vue被成功挂载到页面

<!--![](images/vtest.01.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e02eb6f02d31?w=570&h=230&f=png&s=31191)


## css预处理器配置

```
npm i stylus stylus-loader
```

webpack.config.js

```
module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  }
```

vue组件中使用

```
<style lang='stylus' scoped>
.example
  .title
    color: red
</style>
```

### postcss配置

postcss
提供了一个解析器，它能够将 CSS 解析成抽象语法树（AST）。

```
npm i -D postcss-loader
```

autoprefixer（插件)
它可以解析CSS文件并且添加浏览器前缀到CSS内容里

```
npm i -D autoprefixer
```

创建postcss.config.js

```
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

配置webpack

```
// webpack.config.js
  module: {
    rules: [
      ...
      {
        test: /\.css$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
```

给App.vue添加css3样式

<!--![](images/postcss.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e0326363e2f9?w=702&h=342&f=png&s=43700)

此时 npm run dev 可以看到 自动添加了浏览器前缀

<!--![](images/autoprefixer.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e0350e6992c2?w=1282&h=224&f=png&s=101483)

## 图片资源加载配置

### url-loader

将图片资源转换成base64 URI

```
// webpack.config.js

module: {
  rules: [
    {
      test: /\.(png|svg|jpe?g)$/,
      loader: 'url-loader',
      options: {
        limit: 8192
      }
    }
  ]
}
```

<!--![](../images/urlloader.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e053de3609f4?w=918&h=334&f=png&s=56082)

转换后图片地址变为了base64 URI

<!--![](images/urlloaderres.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e0563d14d639?w=668&h=294&f=png&s=83425)

### file-loader
加载图标字体

```
module: {
  rules: [
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }
  ]
}
```

## cross-env
设置命令运行时的环境变量 以便在webpack配置文件中区分环境

```
npm i cross-env -D
```

package.json

```
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js --progress --mode production",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.js --progress --mode development"
  },
```

## css提取

webpack4
```
npm i mini-css-extract-plugin -D
```

webpack.config.js

```
// 区分当前环境是 development 还是 production
const devMode = process.env.NODE_ENV === 'development'

module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },
    {
      test: /\.styl(us)?$/,
      use: [
        devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
      ]
    }
  ]
},

plugins: [
  ...
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css'
  })
]
```

开发环境下一般不开启css提取，要不然每次代码改动重新编译速度会慢。通常在生成环境下打包时 才开启css提取。

此时npm run build, css被单独打包成一个css文件

<!--![](images/css-extract.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e079a6dbe856?w=386&h=220&f=png&s=15072)

## 代码校验 (Linting)

安装eslint
```
 npm i eslint eslint-plugin-vue -D
```

eslint各种安装

```
npm i -D babel-eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node
```

创建.eslintrc文件

```
{
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    parser: "babel-eslint",
    sourceMap: "module"
  },
  extends: [
    "plugin:vue/essential",
    "standard"
  ],
  rules: {}
}
```

## 清理dist目录
生产环境下 为什么要清理dist目录 因为我们的输出文件为了缓存再文件名拼接上hash值，只要文件有改动就会产生新的hash值，dist目录下每次都会新增一份输出文件 但我们只要编译后的最终的那个就可以了

npm run build 三次 dist目录如下
```
dist
├── app.bundle.0e380cea371d050137cd.js
├── app.bundle.259c34c1603489ef3572.js
├── app.bundle.e56abf8d6e5742c78c4b.js
├── index.html
└── style.css
```


```
module.exports = {
    output: {
    filename: '[name].[hash:6].js',
    path: resolve('dist')
  },
}
```

### 利用webpack插件清理
clean-webpack-plugin

```
npm i clean-webpack-plugin -D
```

webpack配置

```
// build/webpack.config.js

const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../')
    })
  ]
}
```

然后运行npm run build 每次打包前就会把之前的dist目录清理下

### 第二种方式 用rimraf命令 清理dist目录

rimraf

The UNIX command rm -rf for node.

```
npm i rimraf -D
```

修改package.json

```
"scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && cross-env NODE_ENV=production webpack --config build/webpack.config.js --progress --mode production",
}

```

npm run build 也是ok的

### webpack中配置eslint

通过webpack实时编译，进行代码效验

```
npm i eslint-loader -D
```

webpack.config.js

```
module: {
  rules: [
    {
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      ......
    }
  ]
}
```

在src/main.js中定义一个未使用变量

```
let title = 'eslint'
```

运行 npm run dev

<!--![](images/eslint-error.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e05b7cc0ab08?w=1416&h=194&f=png&s=48578)

eslint基本配置完了 但是我想在控制台报错信息更友好些

### eslint-friendly-formatter
一个简单的eslint格式设置工具/报告器，它使用高级文本和iterm2“点击打开文件”功能友好

安装

```
npm i -D eslint-friendly-formatter
```

修改webpack配置

```
// build/webpack.config.js

module: {
  rules: [
    {
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      ......
    }
  ]
}

```


再次 npm run dev

<!--![](images/eslint-error2.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e05e141e1dab?w=1800&h=398&f=png&s=73226)

此时命令行中报错信息更加友好 显示rules详细规则

### devServer.overlay

把编译错误，直接显示到浏览器页面上。

webpack.config.js
```
module.exports = {
  devServer: {
    overlay: {
      errors: true,
      warnings: true
    }
  }
}

```

再次npm run dev 这样就可以直接在页面中看到错误信息了
<!--![](images/browser-erros.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e06bddd1ebed?w=2050&h=906&f=png&s=223458)

### package.json中配置eslint

```
  "scripts": {
    "lint": "eslint --ext .js,.vue src"
  },
```

通过npm 单独进行效验代码也可以
```
npm run lint
```

### eslint自动修复
Eslint检测出的问题如何自动修复

```
  "scripts": {
    "lint": "eslint --ext .js,.vue src",
    "lint:fix": "eslint --fix --ext .js,.vue src"
  },
```

```
npm run lint:fix
```
会把你代码中一些常规错误 进行自动修复


## Git Hooks

> Git 能在特定的重要动作发生时触发自定义脚本。
类似于框架中的生命周期

https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90

### husky

```
npm install husky --save-dev
```
https://www.npmjs.com/package/husky

创建.huskyrc
```
// .huskyrc
{
  "hooks": {
    "pre-commit": "npm run lint"
  }
}
```

package.json
```
  "scripts": {
    "lint": "eslint --ext .js,.vue src"
  },
```

当每次git commit时 自动执行npm run lint效验

<!--![](images/githook-error.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e06139695b6a?w=1434&h=398&f=png&s=83971)


## webpack代码分离
代码分离 属于性能优化 (业务代码 第三方代码 webpack运行时生成代码...)

webpack4中直接配置就可以
```
// build/webpack.config.js

module.exports = {
    optimization: {
    splitChunks: {
      // 默认将node_modules中依赖打包到venders.js
      chunks: 'all'
    },
    // 将webpack运行时生成代码打包到runtime.js
    runtimeChunk: true
  },
}
```

此时 npm run build 会看到vendors.js 和 runtime.js

<!--![](images/opt.png)-->

![](https://user-gold-cdn.xitu.io/2019/1/24/1687e064a0aad702?w=412&h=354&f=png&s=29339)

webpack4中 optimization选项更多配置请看官方文档

https://webpack.js.org/configuration/optimization/

## 目前完整配置文件

package.json

```
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && cross-env NODE_ENV=production webpack --config build/webpack.config.js --progress --mode production",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.js --progress --mode development",
    "lint": "eslint --ext .js,.vue src",
    "lint:fix": "eslint --fix --ext .js,.vue src"
  },
```

build/webpack.config.js
```
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const resolve = dir => path.join(__dirname, '..', dir)

const devMode = process.env.NODE_ENV === 'development'

module.exports = {
  entry: resolve('src/main.js'),
  output: {
    filename: '[name].[hash:6].js',
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      // 默认将node_modules中依赖打包到venders.js
      chunks: 'all'
    },
    // 将webpack运行时代码打包到runtime.js
    runtimeChunk: true
  },
  devServer: {
    host: '0.0.0.0',
    port: 7000,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      template: resolve('index.html')
    })
    // new CleanWebpackPlugin(['dist'], {
    //   root: path.join(__dirname, '../')
    // })
  ]
}

```

## webpack配置根据环境进行拆分、vue路由集成代码组织 、api管理、Vue插件应用及其他更多配置留到下一章

每当到了夜晚时 就是内心最安静的时候 心无杂念。

## 源码地址
https://github.com/Lwenli1224/webpack-vue-loader-structure.git
