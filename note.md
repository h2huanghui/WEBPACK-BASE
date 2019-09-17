//webpack默认支持 模块的写法,commonjs语法 规范(node)
//es5规范 esmodule

//把这个模块打包 解析出浏览器可以识别的代码
```
let result = require('./a-module')
console.log(result)
```

//webpack webpack-cli 0配置的方式来打包
//--save-dev

//npx npm5.2之后出来的(找到node_modules下bin目录下的文件) npx webpack
//两个模式 开发模式 生成模式

//webpack配置文件默认叫 webpack.config.js webpack.file.js

//webpack插件 1是引入 2是new

//loader执行顺序 默认是从下往上 从右边向左边
//先解析css
//css-loader解析css语法 style-loader将解析的css变成style标签插入到页面中(先css-loader,后style-loader)
//解析css 需要两个loader css-loader style-loader

//预处理器 .scss node-sass sass-loader
//         .less less less-loader
//         stylus  stylus stylus-loader
//图片 + icon

//js
es6-es5 api不是es6语法 装饰器 类属性

babel 转化 vue-cli基于babel6来实现
bebel7 
默认会调用babel/core会转化代码 转化的时候需要@babel/presets-env 转换成es5
@babel/core @babel/preset-env(插件) babel-loader
 
//react + vue 




知识拓展
1.vscode 安装Code Runner插件,可以直接右击运行
2.npx(npm5.2之后) 可以找到node modules/bin下的文件 比如npx webpack
3.cross-env包(自己定义环境变量需要用到)
4.webpack做的优化 如果mode是development则不会压缩js 如果是production则会压缩
5.npm地址 https://www.npmjs.com 
6.stylus
7.[].filer(Boolean)等价于  [简写模式]
[].filter((x)=>{
    return Boolean(x)
})
8.正则 ?
test:/.jpe?g|png|gif$/


