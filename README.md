## 1.初始化package.json
npm init -y
## 2.webpack-cli:可以解析用户传入的参数,把解析好的参数传给webpack进行打包(webpack4)
npm install webpack webpack-cli --save-dev
## 3.零配置的方式来打包
npx webpack
## 4.步骤3 报warning:The 'mode' option has not been set
## 5.解决方案: npx webpack --mode development (webpack-cli解析参数)
## 6.每次都需要写,很麻烦,所以可以放在scripts脚本中 npm run scripts 里面配置对应的命令

```
  "scripts": {
    "dev":"webpack --mode development",
    "build":"webpack --mode production",
  },
```
## 7.步骤6比较傻,比较局限(入口文件只能是src下的index.js,打包也是dist下面的main.js,不好改),自己建配置文件
## 8.webpack.config.js
```
const path = require('path')
module.exports = {
    mode:'development', //当前是开发模式
    //入口 出口
    entry:path.resolve(__dirname,'./src/index.js'), //写路径采用绝对路径(_dirname指的是根目录)
    output: { //出口配置
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist') //把当前bundle放到dist文件夹下(没有dist文件夹会自动创建)
    }
}
```
## 9.vue-cli create-react-app 都是多个配置文件,将配置文件进行拆分
## 10.给env加上development production属性,这样在配置文件中可以获取到当前是哪个环境
```
  "scripts": {
    "dev":"webpack --env.development",
    "build":"webpack --env.production"
  },
```
webpack.config.js不仅可以导出一个对象，也可以导出一个函数
```
module.exports = (env) =>{
    console.log(env) //环境变量 {development:true}
}
```
## 11.webpack.base.js(基本、公共配置) webpack.dev.js(开发) webpack.prod.js(生产) 更加清晰
## 12.默认是找webpack.config.js,所以需要告知wepack去找对应的配置文件
    1)webpack.base.js(传入参数mode,再根据env.development去判断合并webpack.dev.js还是合并webpack.prod.js并返回) 
    2)同样也可以直接指定dev找webpack.dev.js build找webpack.prod.js  dev和prod引入base
```
 "scripts": {
    "dev":"webpack --env.development --config ./config/webpack.base.js",
    "build":"webpack --env.production ./config/webpack.base.js"
  },
```
## 13.webpack合并 npm i webpack-merge --D
## 14.开发环境使用webpack-dev-server 是在内存中打包的,不会产生实体文件(默认是打包到根目录下)
所以npm run dev肉眼无法看到dist文件夹,但可以被访问。为了方面查看,增加一个dev:build 在开发环境看到生成的文件
```
  "scripts": {
    "dev:build":"webpack --env.development --config ./config/webpack.base.js",
    "dev": "webpack-dev-server --env.development --config ./config/webpack.base.js",
    "build": "webpack --env.production --config ./config/webpack.base.js"
  },
```
## 15.存在问题:端口号是写死的
修改webpack.dev.js 增加devServer
```
const path = require('path')
module.exports = {
    mode: 'development',
    devServer: {
        port: 3000,
        compress: true,//gzip 可以提升返回页面的速度
        contentBase: path.resolve(__dirname,'../dist') //webpack启动服务会在dist目录下
    }
}

```
## 16.存在问题,需要在dist目录下自己新建index.html文件,引入js文件
希望:自动生成html文件,并且引入打包后的js 
配置一个插件,在打包结束后,把当前文件的资源 打包后的结果 引入进来 并且产生到当前dist目录下
## 17.解决方案 npm i html-webpack-plugin --D
开发环境不压缩代码,生产环境下压缩代码
```
   plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'), //以public里面的index.html作为模板
                filename: 'index.html',
                minify: !isDev && { //生产环境下压缩代码
                    removeAttributeQuotes: true, //去除引号
                    collapseWhitespace: true //去除空格(压缩成一行)
                }
            })
        ]
```

## 18.存在问题 每次打包需要手动删除dist文件夹下的内容
npm i clean-webpack-plugin --D
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //插件默认导出的是一个对象,对象有这个属性
new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns:['**/*'] //默认所有目录下的所有文件
})
```
所以可以直接写成
```
new CleanWebpackPlugin()
```

## 19.解析css
npm i css-loader style-loader --D

字符串格式(从下往上)
```
      rules: [
                {
                    test: /\.css$/,
                    use:'style-loader'
                },
                {
                    test: /\.css$/,
                    use:'css-loader'
                }
            ]
        },
```
数组格式(从右往左)
```
    module: {
            rules: [
                {
                    test: /\.css$/,
                    use:['style-loader','css-loader']
                }
            ]
        },
```

## 20.解析scss
npm i node-sass sass-loader --D
```
 { //匹配到scss文件,用sass-loader调用node-sass处理sass文件
      test: /\.scss$/,
      use:['style-loader','css-loader','sass-loader']
}
```

## 21.存在一个场景(有bug)  index.js引入index.css,index.css中引入a.css,而a.css中又引入了a.scss 
webpack首先找到index.js,然后发现这个文件里面引入了css文件,所以会调用css-loader来解析。但不会再去解析scss文件(可以看到整个scss文件直接被插入到style标签中了,而没有解析去解析,而事实上,我们是希望去解析的)

```
   {
    test: /\.css$/,
    use: ['style-loader', {
        loader: 'css-loader',
        options: { //给loader传递参数,css文件引入了其他文件,你从当前这个loader之后执行这个文件(先调用sass-loader,再调用css-loader) 如果写2 就是调用后面两个(可以写多,不可以写少)
            importLoaders:1
        }
    },'sass-loader']
},
```
## 22.打包css还需要处理 样式前缀 比如样式 transform:rotate(45deg)
在浏览器版本比较低是,需要加上webkit前缀
解决方案 npm i postcss-loader --D
同样也需要一个插件 (sass-loader会调用node-sass)
npm i autoprefixer --D

```
    {
        test: /\.css$/,
        use: ['style-loader', {
            loader: 'css-loader',
            options: { //给loader传递参数,css文件引入了其他文件,你从当前这个loader之后执行这个文件(先调用sass-loader,再调用css-loader) 如果写2 就是调用后面两个(可以写多,不可以写少)
                importLoaders:2
            }
        },'postcss-loader','sass-loader']
    },
```
## 23.postcss-loader需要一个配置文件postcss.config.js
```
module.exports = {
    plugin: [
        require('autoprefixer')
    ]
}
```
## 24.存在问题 打包后的bundle.js中并没有加上前缀(目前浏览器默认版本都比较高,加了有些浪费性能)
解决方案 告诉当前浏览器

1).browserslistrc 

2)package.json
```
 "browserslist": [
    "defaults",
    "not ie < 9",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ],
```

## 25.抽离css文件,可以和js同时进行(抽离css插件)
npm i mini-css-extract-plugin --D

开发环境不用抽取,线上环境需要抽取
```
  isDev ? 'style-loader' : MiniXCssExtractLoader.loader,
```

## 26.告诉它抽取出来的css叫什么
```
  !isDev &&　new MiniXCssExtractLoader({
      filename:'css/main.css'
  }), 
```
## 27.存在问题:css文件为压缩(webpack生产环境只会默认压缩js,css不会压缩,需要另外配置)
npm i optimize-css-assets-webpack-plugin --D
```
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
    mode: 'production',
    optimization: { //优化项
        minimizer: [
            new OptimizeCSSAssetsPlugin() //css手动压缩的话 js也需要手动压缩
        ]
    }
}
```
## 28.存在问题 js未压缩(css手动压缩,那么js也需要手动压缩)
npm i terser-webpack-plugin --D
```
module.exports = {
    mode: 'production',
    optimization: { //优化项
        minimizer: [
            new TerserWebpackPlugin(),
            new OptimizeCSSAssetsPlugin() //css手动压缩的话 js也需要手动压缩
        ]
    },
    //在每次打包之前,先清除dist目录下的文件
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

## 29.图片
```
import logo from './logo.jpg'
console.log(logo)
let img = document.createElement('img')
img.src = logo
document.body.appendChild(img)
```
报错不认识图片,需要安装file-loader(默认功能拷贝)

npm i file-loader -D

## 30.小图片转成base64(比以前大,不用发送http请求)
npm i url-loader -D
```
{
    //图片转换
    test: /.jpe?g|png|gif$/,
    use: {
        loader: 'url-loader',
        //如果大于100k,会使用file-loader
        options: { 
            name:'image/[contentHash].[ext]', //当前contentHash-hash ext-当前后缀
            limit: 1024
        }//file-loader 默认的功能是拷贝的作用
        //希望当前较小的图片可以转化成base64 比以前大 好处就是不用http请求
    }
            
}
```

## 31.图标
```
{ //图标转换
    test: /\.(woff|ttf|eot|svg)$/,
    use:'file-loader'
},
```
## 32. js转换 
npm i @babel/core @babel/preset-env babel-loader -D
可以放在options中 很多的话不方面,建一个配置文件 .babelrc
```
{
    test: /\.js/,
    use: {
        loader: 'babel-loader',
        options: {

        }
    }
},
```
 .babelrc
```
{
    "presets": [
        "@babel/preset-env" //插件的集合,从下往上执行
    ]
}
```
执行npm run dev:build可以看到,bundle.js中将es6代码转换为了es5
```
const fn = () => {

}
fn()
```
=>
```
var fn = function fn() {};
```
## 33.草案语法
npm i @babel/plugin-proposal-class-properties --D
```
class A {
    a = 1
}

```
等价于
```
class A {
    constructor(props) {
        this.a = 1;
    }
}
```
plugins默认一个插件
```
{ 
    "presets": [
        //配置多个插件
        "@babel/preset-env" //插件的集合,这个是从下往上执行
    ],
    "plugins":[//插件是从上往下执行
        "@babel/plugin-proposal-class-properties"
    ]
}

```

如果需要对插件传参
```
{ 
    "presets": [
        //配置多个插件
        "@babel/preset-env" //插件的集合,这个是从下往上执行
    ],
    "plugins":[//插件是从上往下执行
        ["@babel/plugin-proposal-class-properties",{
            "loose": true 
        }]
    ]
}

```
加上这个宽松属性,会把刚才的代码变成
```
class A {
    a = 1 // this.a = 1
}
```
如果"loose": false ,打包出来里面是Object.defineProperty来定义属性,装饰器无法使用
建议使用true(才能用装饰器)

## 34.babel7语法

```
@log
class A {
    a = 1 // this.a = 1
}

function log(target) {
    //target代表的就是A

}
```
npm i @babel/plugin-proposal-decorators --D
必须在@babel/plugin-proposal-class-properties之前使用,参考https://babeljs.io/docs/en/babel-plugin-proposal-decorators
```
   "plugins":[//插件是从上往下执行
        ["@babel/plugin-proposal-decorators",{
            "legacy":true
        }],
        ["@babel/plugin-proposal-class-properties",{
            "loose": true //加上这个宽松属性,
        }]
    ]
```

## 35.问题:不能转换高级语法 实例上的语法 以及promise
`[1,2,3].includes(1)`
## 36. 遇到这种API 帮我转换一下。好处是按需加载
```   
"presets": [
        //插件包,含有很多很多插件
        ["@babel/preset-env",{
            "useBuiltIns": "usage"
        }] //这个是从下往上执行
],
```

## 37.报错，无法知道安装字符串还是数组
```
ERROR in ./src/index2.js
Module not found: Error: Can't resolve 'core-js/modules/es6.string.includes' in 'D:\frontEnd\WEBPACK-BASE\src'
 @ ./src/index2.js 2:0-45

ERROR in ./src/index2.js
Module not found: Error: Can't resolve 'core-js/modules/es7.array.includes' in 'D:\frontEnd\WEBPACK-BASE\src'
 @ ./src/index2.js 1:0-44
```
 解决方案：报错中已提示
 npm install core-js@2 --D
 ```
   "presets": [
        //插件包,含有很多很多插件
        ["@babel/preset-env",{
            //使用的api 会自动转化,并且是按需加载
            "useBuiltIns": "usage",
            "corejs": 2
        }] //这个是从下往上执行
    ],
 ```

 ## 38.还有问题
 index.js中有一个class A,引入了另外一个js,这个js中有class B,可以看到bundle.js中，有多个_classCallCheck
npm install --save-dev @babel/plugin-transform-runtime --D
npm install --save @babel/runtime --D 

这样的好处是使用_babel_runtime_helpers_classCallCheck,不用每次都编译,而是用统一的命令,比以前代码少很多










