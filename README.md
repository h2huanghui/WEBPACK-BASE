## 一、概念
webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
![webpack.png](https://upload-images.jianshu.io/upload_images/11092615-aac0c9c2d833f27c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##  1. 使用Webpack作为前端构建工具
-  代码转换：TS->JS,SCSS->CSS
- 文件优化：压缩JS、CSS（加前缀）、HTML代码，压缩合并图片
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过（eslint..）
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统
## 2.  webpack两个核心
- 模块转换器(loader)：用于把模块原内容按照需求转换成新内容，可以加载非JS模块
- 扩展插件(plugin)：在Webpack构建流程中的特定时机注入扩展逻辑来改变扩展结果或做你想要做的事情(比如先删除文件夹下的文件,再重新生成)

##  二、使用
## 1. 初始化package.json
`npm init -y`

## 2. 安装webpack webpack-cli
webpack-cli:可以解析用户传入的参数,把解析好的参数传给webpack进行打包(webpack4)
`npm install webpack webpack-cli --save-dev` 表示开发环境

## 3. 项目目录下,建立`src`文件夹，`src`下新建`a-module.js`，`index.js`
webpack默认支持模块的写法 commonjs 规范，es6(esmodule)

`a-module.js`代码如下：
```
module.exports = 'come on,SmartHui'
```
index.js代码如下：
```
let result = require('./a-module')
console.log(result)
```
`node环境下可以运行，但是浏览器是不支持这种语法的，所以需要把模块打包，解析出浏览器可以识别的代码`

##4. 利用webpack webpack-cli 零配置的方式来打包（默认去找当前文件夹src下的index.js）
`npx webpack //npx是npm 5.2之后出来的，帮助执行node_modules下的某个文件`

执行完之后，可以看到生成了一个dist文件夹，下面有一个main.js文件(就是打包之后的结果，浏览器可以识别)

## 5. 验证打包后的main.js
在`dist`文件夹下新建`index.html`，引入main.js`<script src="./main.js"></script>`，在浏览器中访问index.html，即可看到控制台输出

## 6. 不建议直接使用npx webpack，vscode可以看到警告
```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option
to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```
可以 `npx webpack --mode development //传参（webpack-cli会解析参数）`开发环境(`development` )打包出来的main.js是默认不会被压缩的，生产环境(`production`)打包出来的main.js是被压缩的

## 7. 每次敲命令会很麻烦，把命令配置到package.json中,
```
  "scripts": {
    "dev":"webpack --mode development",
    "build":"webpack --mode production",
  },
```
运行命令`npm run dev`,运行命令时，会把`node_modules`下的`bin`目录放到全局上（就会有`.bin`下的命令，执行结束后销毁）

## 8. 上述方法比较局限，自己建配置文件配置`webpack.config.js`(零配置限制：入口文件只能是src下的index.js,打包也是dist下面的main.js,不好改)
```
const path = require('path')
module.exports = {
    mode:'development', //当前是开发模式
    //入口 出口
    entry:path.resolve(__dirname,'./src/index.js'), //写路径采用绝对路径(_dirname指的是根目录)，防止文件夹变动后，需要重新更改路径
    output: { //出口配置
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist') //把当前bundle放到dist文件夹下(没有dist文件夹会自动创建)
    }
}
```
可以看到`dist`文件夹下，生成了bundle.js，并且可以看到文件以及大小
```
D:\frontEnd\WEBPACK-ALL\WEBPACK-BASE>npm run dev

> WEBPACK-BASE@1.0.0 dev D:\frontEnd\WEBPACK-ALL\WEBPACK-BASE
> webpack --mode development

Hash: 03d09b5e51a493b9408c
Version: webpack 4.41.2
Time: 109ms
Built at: 2019-11-06 11:07:46
    Asset      Size  Chunks             Chunk Names
bundle.js  4.17 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/a-module.js] 35 bytes {main} [built]
[./src/index.js] 55 bytes {main} [built]
```
## 9. webpack.config.js中传入mode参数，修改package.json，去除命令中参数中的传递
```
  "scripts": {
    "dev":"webpack",
    "build":"webpack"
  },

```
直接运行`npm run dev`还是ok的

 ## 10. 通过`vue-cli` `create-react-app`源码，有自己的`webpack`配置， 不会把所有的配置写到一个文件里面，都是`多个`配置文件。所以下面进行配置文件的拆分

## 11. 修改`package.json`，给env自挂属性（development production）,这样在配置文件中可以获取到当前是哪个环境
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
`npm run dev`可以看到结果
```
{ development: true }
Hash: 6c637f5819123099586e
Version: webpack 4.41.2
Time: 131ms
Built at: 2019-11-06 11:31:52
  Asset        Size  Chunks             Chunk Names
main.js  1000 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js 55 bytes {0} [built]
[1] ./src/a-module.js 35 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```
`所以可以在代码中判断当前是开发还是生产`

## 12. 建立build文件夹，下面建立三个文件，分别为：webpack.base.js(基本、公共配置) webpack.dev.js(开发) webpack.prod.js(生产) 更加清晰，如下图：
![image.png](https://upload-images.jianshu.io/upload_images/11092615-a65d6dd8a2af9326.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 13. 默认是找webpack.config.js,所以需要告知wepack去找对应的配置文件

```
 "scripts": {
    "dev":"webpack --env.development --config ./build/webpack.base.js",
    "build":"webpack --env.production ./build/webpack.base.js"
  },
```
`这里有两种方式，如下，我采用的是1`
```
1.  webpack.base.js(传入参数mode,再根据env.development去判断合并webpack.dev.js还是合并webpack.prod.js并返回) 
2. 同样也可以直接指定dev找webpack.dev.js build找webpack.prod.js  dev和prod引入base
```
运行`npm run dev`，可以看到
```
{ development: true }
```

运行`npm run build`，可以看到
```
{ production: true }
```
## 14. webpack合并` npm i webpack-merge --D`
## 15.  `webpack.base.js`
```
const dev = require('./webpack.dev')
const prod = require('./webpack.prod')
const path = require('path')
const merge = require('webpack-merge')

module.exports = (env) => { //env是环境变量
    console.log(env)
    let isDev = env.development
    const base = {
        entry: path.resolve(__dirname, '../src/index.js'),
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname,'../dist')
        }
    }
    //函数返回配置文件,没返回会采用默认配置
    if (isDev) {
        return merge(base,dev)
    } else {
        return merge(base,prod)
    }
}
```
`webpack.dev.js`
```
module.exports = {
    mode:'development'
}
```
`webpack.prod.js`
```
module.exports = {
    mode:'production'
}
```
## 16. 如果是开发环境，要使用webpack-dev-server `npm i webpack-dev-server --save-dev`
`webpack-dev-server是在内存中打包的，不会产生实体文件`

修改`package.json`:
- 增加`dev:build`,在开发环境看打包后的结果
- 把webpack修改为webpack-dev-server，就会启动一个服务
```
  "scripts": {
    "dev:build": "webpack --env.development --config ./build/webpack.base.js",
    "dev": "webpack-dev-server --env.development --config ./build/webpack.base.js",
    "build": "webpack --env.production --config ./build/webpack.base.js"
  },
```
如下：
```
i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from D:\frontEnd\WEBPACK-ALL\WEBPACK-BASE
i ｢wdm｣: Hash: 9a936290a170bf8cc970
Version: webpack 4.41.2
```
运行`npm run dev`，可以看到，输出的文件应该在当前根目录,但是当我们访问`http://localhost:8080/`并没有看到bundle.js
![image.png](https://upload-images.jianshu.io/upload_images/11092615-74d51d59c32a0308.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

而直接访问 `[http://localhost:8080/bundle.js](http://localhost:8080/bundle.js)`,可以看到bundle.js
（`从而验证了webpack-dev-server是在内存中打包的，不会产生实体文件`）
![bundle.png](https://upload-images.jianshu.io/upload_images/11092615-d80c1d3f7b78b588.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 17. 存在问题:端口号是写死的
修改`webpack.dev.js` 增加devServer
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
运行`npm run dev`，可以看到,运行的是`index.html(之前手动在dist目录下创建的)`，而且和我们打包生成的bundle.js并没有什么关联
![image.png](https://upload-images.jianshu.io/upload_images/11092615-10c89ceccadb18b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 18.  自动生成html文件,并且引入打包后的js 
新建`public`文件夹,新建  `index.html`文件 (作为模板)
![index.html.png](https://upload-images.jianshu.io/upload_images/11092615-f9f210bc27011797.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 19. 配置一个插件,在打包结束后,把当前文件的资源 打包后的结果 引入进来 并且产生到当前dist目录下` npm i html-webpack-plugin --D`
`修改webpack.base.js`，引入`html-webpack-plugin`插件，增加`pulgins`配置
```
const dev = require('./webpack.dev')
const prod = require('./webpack.prod')
const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => { //env是环境变量
    console.log(env)
    let isDev = env.development
    const base = {
        entry: path.resolve(__dirname, '../src/index.js'),
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname,'../dist')
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename:'index.html'
            })
        ]
    }
    //函数返回配置文件,没返回会采用默认配置
    if (isDev) {
        return merge(base,dev) //循环后面的配置,定义到前面去
    } else {
        return merge(base,prod)
    }
}
```
运行`npm run dev`，可以看到（打包在内存中，没有产生实体文件，所以看不到）
```
i ｢wds｣: Project is running at http://localhost:3001/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from D:\frontEnd\WEBPACK-ALL\WEBPACK-BASE\dist
i ｢wdm｣: Hash: 40f577fce1560dc91faf
Version: webpack 4.41.2
```

打开`[http://localhost:3001/](http://localhost:3001/)`，可以看到,index.html中引入了bundle.js
![image.png](https://upload-images.jianshu.io/upload_images/11092615-02fb722b5029c8dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如果要看的打包后的文件，运行`npm run build`
![dist.png](https://upload-images.jianshu.io/upload_images/11092615-3851809ee8597a32.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 20. 优化打包后的结果
修改`webpack.base.js`中`plugins`配置
```
    plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,//移除引号
                    collapseWhitespace:true //打包为一行
                }
            })
        ]
```
运行`npm run build`，可以看到实际结果


## 21. 每次打包需要手动删除dist文件夹下的内容（原来dist下面有a.js和b.js，重新打包后文件还在，需要手动删除）
`npm i clean-webpack-plugin --D`
`修改webpack.prod.js`，`生成环境`每次都删除重新生成
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //默认导出的是一个对象,对象有这个属性
new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns:['**/*'] //默认所有目录下的所有文件
})
```
所以可以直接写成
```
new CleanWebpackPlugin()
```
`补充插件用法:[https://www.npmjs.com/](https://www.npmjs.com/)`

## 22. css文件问题
`src`文件夹下，新建`index.css`
```
body {
    background: #f0f0f0;
}
```
 `index.js`中引入 `index.css`
```
import './index.css'
```
可以看到报错(`需要一个合适的loader去处理这个文件类型`)
```
ERROR in ./src/index.css 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body {
|     background: #f0f0f0;
| }
 @ ./src/index.js 1:0-20
```
## 23. 解析CSS，需要两个loader(css-loader style-loader)

`css-loader`: 解析css语法

 `style-loader`：会将解析的css，变成style标签插入到页面中

 `npm i css-loader style-loader --D`

`loader执行顺序 默认是从下往上，从右往左`（loader可以是`''`  `{}`  `[]`）

字符串格式(从下往上)
```
     module: {
            rules: [
                {
                    test: /\.css$/,
                    use: 'style-loader'
                },
                {
                    test: /\.css$/,
                    use: 'css-loader'
                }
            ]
        },
```
数组格式(从右往左) --这种方式比较`常用`
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
运行`npm run dev`，如图，可以看到生成了style标签
![index.html.png](https://upload-images.jianshu.io/upload_images/11092615-e481c79a0f38aa56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 24. 预处理器
```
文件               需要的loader
.scss node-sass sass-loader
.less less less-loader
.stylus stylus stylus-loader
```
## 25. 解析scss
`npm i node-sass sass-loader --D`
node-sass `匹配到scss文件,用sass-loader调用node-sass解析sass文件`
```
 { 
      test: /\.scss$/,
      use:['style-loader','css-loader','sass-loader']
}
```

## 26. 存在一个场景(有bug)  index.js引入index.css,index.css中引入a.css,而a.css中又引入了a.scss 
webpack首先找到index.js,然后发现这个文件里面引入了css文件,所以会调用`css-loader`来解析。但不会再去解析scss文件(可以看到整个scss文件直接被插入到style标签中了,而没有解析去解析,而事实上,我们是希望去解析的)

`index.js`中引入`index.css`
```
import './index.css'
```
`index.css`中引入`a.css`
```
@import './a.css';
body {
    background: #f0f0f0;
}
```
`a.css`中引入`a.scss`
```
@import './a.scss'
```
`a.scss`
```
$background: black; 

div {
    width: 100px;
    height: 100px;
    background: $background;
}
```
运行`npm run dev`,结果如下：
![image.png](https://upload-images.jianshu.io/upload_images/11092615-e30a124b8cb39da5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到，`a.scss`中的内容直接被插入到style标签中了，解析到 `a.css`就不会再去解析里面的引入的 `a.scss`了，但实际我们希望去解析的

`解决方案：给css-loader传参数`

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
## 27. 打包css还需要处理样式前缀（比如样式 transform:rotate(45deg)） 
在浏览器版本比较低是,需要加上webkit前缀

解决方案 `npm i postcss-loader --D`

同样也需要一个插件 (就像sass-loader会调用node-sass)

`npm i autoprefixer --D`

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
`postcss-loader`需要一个配置文件`postcss.config.js`
```
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
## 28. 存在问题：打包后的bundle.js中并没有加上前缀(目前浏览器默认版本都比较高,加了有些浪费性能)
![image.png](https://upload-images.jianshu.io/upload_images/11092615-40fa53761ba58b66.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`解决方案 告诉当前浏览器(参考[https://github.com/browserslist/browserslist](https://github.com/browserslist/browserslist) 
)`
  
- .browserslistrc 
```
cover 95%
```
- package.json
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
`选择其中一个即可`，这里选择的是`方法1`，运行`npm run dev:build`，`bundle.js`如下：
![image.png](https://upload-images.jianshu.io/upload_images/11092615-d2cbd62f6466dd4d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 29. 这种方法解析css的时候，不能渲染dom。但是我们希望css和js一同并行加载，所以我们需要抽离css文件。
抽离css插件 `npm i mini-css-extract-plugin --D`

`开发环境不用抽取,线上环境需要抽取`

```
     {
                    test: /\.css$/,
                    use: [
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2
                            }
                        }, 'postcss-loader', 'sass-loader']
    },
```

## 30. 告诉webpack抽取出来的css叫什么
```
     plugins: [
            !isDev && new MiniCssExtractPlugin({
                filename:'css/main.css'
            }),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,//移除引号
                    collapseWhitespace: true //打包为一行
                }
            })
        ].filter(Boolean)
```
`补充知识点`：

[].filer(Boolean)等价于 [简写模式]
```
[].filter((x)=>{
    return Boolean(x)
})
```
`把plugins里面的每一项处理，把结果为false的过滤掉`

执行`npm run build`,发现dist目录下多了`css/main.css`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-7e70fa0cf43cad7d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 31. 存在问题:css文件未压缩
- `webpack`生产环境只会默认压缩`js`，`css`不会压缩,需要另外配置 `npm i optimize-css-assets-webpack-plugin --save-dev`
- 如果`css`手动压缩,那么js也需要手动压缩 `npm i terser-webpack-plugin --save-dev`

```
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
    mode: 'production',
    optimization: { //优化项
        minimizer: [
            new TerserWebpackPlugin(), //css手动压缩的话 js也需要手动压缩
            new OptimizeCSSAssetsPlugin() //css压缩
        ]
    }
}
```
运行`npm run build`,可以看到`css`和`js`均被压缩
![main.css](https://upload-images.jianshu.io/upload_images/11092615-e012ec82e1e5d6d2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![bundle.js](https://upload-images.jianshu.io/upload_images/11092615-bb89790b9b84fa3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 32. 图片
`src`下放一张`logo.jpg`图片

编辑 `index.js`代码
```
//获取当前打包logo后的路径
import logo from './logo.jpg'
console.log(logo)
let img = document.createElement('img')
img.src = logo
document.body.appendChild(img)
```
运行`npm run dev`，报错不认识图片
![error](https://upload-images.jianshu.io/upload_images/11092615-fa8275258a6f2a3b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

需要安装`file-loader`(默认功能拷贝，拷贝到dist目录下，并且返回图片)`npm i file-loader -D`
```
     {
            test: /.jpe?g|png|gif$/,
            use:'file-loader'
     }
```
运行`npm run build`，结果如下：
![image.png](https://upload-images.jianshu.io/upload_images/11092615-8ddc65c9dc5fb871.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 34. 小图片转成base64(编码比以前大,不用发送http请求)
`npm i url-loader -D`
```
       {
                    //图片转换
                    test: /\.(jpe?g|png|gif)$/,
                    use: {
                        loader: 'url-loader',
                        //如果小于100k，会使用url-loader
                        //如果大于100k,会使用file-loader
                        options: { 
                            name:'image/[contentHash].[ext]', // 打包后的图片目录（当前contentHash-图片打包后的hash ext-当前后缀）
                            limit: 100*1024
                        }//file-loader 默认的功能是拷贝的作用
                        //希望当前较小的图片可以转化成base64 比以前大 好处就是不用http请求
                    }
                  
        }
```
运行`npm run build`，结果如下，可以对比看到，打包后的差别
- 使用 `url-loader`，打包后无img，并且bundle.js文件大小变大了

![url-loader](https://upload-images.jianshu.io/upload_images/11092615-197c263a02264d1a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![file-loader](https://upload-images.jianshu.io/upload_images/11092615-fef530bac4e3d987.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 35. 图标
```
   { //图标转换
                    test: /\.(woff|ttf|eot|svg)$/,
                    use:'file-loader'
   },
```

## 36. js转换 
`npm i @babel/core @babel/preset-env babel-loader -D`
- babel/core: 核心模块
- babel/preset-env: 插件集合（所有将es6->es5的插件）
- babel-loader: webpack使用的loader

`关系：默认会调用babel/core会转化代码 转化的时候需要@babel/presets-env 将es6转换成es5`

`@`是指作用域，`npm`之后把所有babel相关的都放在一个目录下，如图：
![image.png](https://upload-images.jianshu.io/upload_images/11092615-174ee1daaaab4afc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

修改`index.js`
```
//es6->es5
const fn = () => {
    
}

fn()
```

配置`webpack.base.js`，把具体的配置写在`options`中
```
 {//解析js文件 默认会用调用@babel/core
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            
                        }
                    }
  }
```

如果options很多的话不方面,所以建一个配置文件`.babelrc`
```
       {
                   test: /\.js$/,
                   use:  'babel-loader'
       },
```
插件的集合
` .babelrc`
```
{
//preset从下往上执行
    "presets": [
        "@babel/preset-env"
    ],
//plugins从上往下执行
  "plugins":[
  ]
}
```
执行`npm run dev:build`，如图，可以看到代码成功转换
![image.png](https://upload-images.jianshu.io/upload_images/11092615-de3c8520b680b702.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 37. js草案语法
```
class A {
    a = 1 //实例上的属性,并且是私有的
}
```
等同于
```
class A{
    constructor() {
        this.a = 1
    }
}
```
运行`npm run dev:build`，报错如图
![image.png](https://upload-images.jianshu.io/upload_images/11092615-9ac68ef8dc82588f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装报错中所需要的插件 `npm i @babel/plugin-proposal-class-properties --save-dev`
修改`.babelrc`
- presets：插件集合
- plugin: 单个插件

```
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins":[
        ["@babel/plugin-proposal-class-properties", {
            "loose": true
        }]
    ]
}
```
执行`npm run dev:build`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-ac66dcec717bb6aa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 
修改`.babelrc`,`"loose":false`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-2e8338aeb449c47c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
`一般情况是用"loose":true`，因为这样可以用`装饰器`

## 38. es7 装饰器
修改 `index.js`,`target`代表的就是A
```
@log
class A {
    a = 1 //实例上的属性,并且是私有的
}
function log(target) {
   console.log(target)
}
``` 
执行`npm run dev`，报错
![image.png](https://upload-images.jianshu.io/upload_images/11092615-99c4ac44a11cfa09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

访问`[https://babeljs.io/](https://babeljs.io/)`，搜索`decorators`
[https://babeljs.io/docs/en/babel-plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)，根据文档配置即可

首先，`npm install --save-dev @babel/plugin-proposal-decorators`

其次，修改`.babelrc`
```
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins":[
        ["@babel/plugin-proposal-decorators", { 
            "legacy": true 
        }],
        ["@babel/plugin-proposal-class-properties", {
            "loose": true
        }]
    ]
}
```

执行`npm run dev:build`，如图:
![image.png](https://upload-images.jianshu.io/upload_images/11092615-8113b74e6353961d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到，A作为target传入log函数

直接在`node`环境运行，可以看到打印出来的`target`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-7557bca0cd64a133.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 39. api自动转换
修改`index.js`
```
[1, 2, 3].includes(1);
```
执行`npm run dev:build`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-9a5515a2e9f85613.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到，并未进行转化，这是因为默认`不能转换高级语法,实例上的语法以及promise`，所以我们需要自己进行手动配置

修改`.babelrc`
```
{
    "presets": [
        ["@babel/preset-env",{
            "useBuiltIns": "usage" //使用的api 会自动转化,并且是按需加载
        }]
    ],
    "plugins":[
        ["@babel/plugin-proposal-decorators", { 
            "legacy": true 
        }],
        ["@babel/plugin-proposal-class-properties", {
            "loose": true
        }]
    ]
}
```
执行`npm run dev:build`,报错了
![image.png](https://upload-images.jianshu.io/upload_images/11092615-43e6ea5ac15a3b9a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
原因就是，遇到`includes`，不知道是引入`string.includes`还是`array.includes`
按照报错的提示，我们安装code.js ` npm install --save-dev core-js@2 `(这里我们用2)
- `code.js`类似于`babel-polyfill`

修改`.babelrc`
```
{
    "presets": [
        ["@babel/preset-env",{
            "useBuiltIns": "usage",
            "corejs": 2
        }]
    ],
    "plugins":[
        //解析装饰器
        ["@babel/plugin-proposal-decorators", { 
            "legacy": true 
        }],
        //解析类的属性
        ["@babel/plugin-proposal-class-properties", {
            "loose": true
        }]
    ]
}
```
运行`npm run dev:build`,成功编译
![image.png](https://upload-images.jianshu.io/upload_images/11092615-c947603b2081946e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 40. babel7新特性：解决重复引入_classCallCheck
修改`index.js`

```
import './a'
class A {

}
```
`a.js`中也有一个`class`
```
class B {

}
```
执行`npm run dev:build`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-74368b68b3957581.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/11092615-6bd9e79d2949ecd9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到，引入了两次_classCallCheck（代码冗余）

解决办法`npm install --save-dev @babel/plugin-transform-runtime` 节约代码

[https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav](https://babeljs.io/docs/en/babel-plugin-transform-runtime#docsNav)

参考文档，还需要安装`npm install --save @babel/runtime`（线上需要使用）

修改`.babelrc`

```
{
    "presets": [
        ["@babel/preset-env",{
            "useBuiltIns": "usage",
            "corejs": 2
        }]
    ],
    "plugins":[
        //解析装饰器
        ["@babel/plugin-proposal-decorators", { 
            "legacy": true 
        }],
        //解析类的属性
        ["@babel/plugin-proposal-class-properties", {
            "loose": true
        }],
        ["@babel/plugin-transform-runtime"]
    ]
}
```
执行`npm run dev:build`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-d148ac5a43053c6d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到，a.js和index.js中,都使用的一种方法引入_classCallCheck

## 41. 如何编译react
安装`npm i react react-dom --save`
安装`npm i @babel/preset-react --save-dev`

修改`index.js`
```
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<div>hello</div>,document.getElementById('root'))
```
修改`.babelrc`
```
{
    "presets": [
        ["@babel/preset-env",{
            "useBuiltIns": "usage",
            "corejs": 2
        }],
        "@babel/preset-react"
    ],
    "plugins":[
        //解析装饰器
        ["@babel/plugin-proposal-decorators", { 
            "legacy": true 
        }],
        //解析类的属性
        ["@babel/plugin-proposal-class-properties", {
            "loose": true
        }],
        ["@babel/plugin-transform-runtime"]
    ]
}
```
运行`npm run dev`,可以看到成功了
![image.png](https://upload-images.jianshu.io/upload_images/11092615-062aaf5f47f3a899.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 42. ts配置
新建`index1.jsx`
```
import React from 'react'
import ReactDOM from 'react-dom'

//ts校验类型
interface IProps {
    num: number
}
let initState = { count: 0 }
type State = Readonly<typeof initState>
class Counter extends React.Component<IProps,State> {
    state: State = initState
    render() {
        return(
            <div>
                {this.state.count}
                <button onClick={this.handleClick}>点击</button>
            </div>
        )
    }
    handleClick = () => {
        this.setState({
            count:this.state.count + 1
        })
    }
}

ReactDOM.render(<Counter />,document.getElementById('root'))
```
使用ts有两种方案:
-  使用ts-loader，需要配合typescript库使用
-  babel7发明一个包，专门解析ts `@babel/preset-typescript` 
`npm i @babel/preset-typescript --save-dev`

修改webpack.base.js，入口文件应该是`index.jsx`
```
entry: path.resolve(__dirname, '../src/index.jsx')
```
并且，增加解析ts文件的配置
![image.png](https://upload-images.jianshu.io/upload_images/11092615-96d4e06baffa9fe3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后，修改`.babelrc`,先ts->js->react->es5
![image.png](https://upload-images.jianshu.io/upload_images/11092615-fbe91e4961eca19d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

运行`npm run dev`，编译成功
![image.png](https://upload-images.jianshu.io/upload_images/11092615-a0a1c3d4b0ce8704.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 43.解决代码报错
![image.png](https://upload-images.jianshu.io/upload_images/11092615-0b350d9575ea582a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`用ts去校验代码,是否符合规范，是否是ts语法`

首先，安装`npm i typescript //并不是用来解析语法，而是用来校验代码` 

然后，本地执行`npx typescript --init`,可以看到本地生成了一个文件  `tsconfig.json`

![image.png](https://upload-images.jianshu.io/upload_images/11092615-c9e3e7623e739352.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![error1.png](https://upload-images.jianshu.io/upload_images/11092615-6a66cdf4904cc0d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到代码报错，react并不是ts版本

根据提示安装`npm i @types/react @types/react-dom --save`

安装成功后，可以看到报错（error1）消失

![error2.png](https://upload-images.jianshu.io/upload_images/11092615-325c5e37434b321d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

但是，可以看到代码还有报错，不认识JSX,修改`tsconfig.json`

![tsconfig.json](https://upload-images.jianshu.io/upload_images/11092615-8aebfb80a04af630.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到报错（error2）消失

![error3](https://upload-images.jianshu.io/upload_images/11092615-bf2c4a9cfc13160b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
使用Count应该传`num`属性

修改`index.tsx`

```
ReactDOM.render(<Counter num={1} />,document.getElementById('root'))

```

## 44. vue配置
新建`index.ts`
```
import Vue from 'vue'

let vm = new Vue({
    el: '#root',
    render: h => h('h1', {}, 'hello vue')
})

```
修改`webpack.base.js`入口
```
entry: path.resolve(__dirname, '../src/index.ts')
```
执行`npm run dev`
![index.ts](https://upload-images.jianshu.io/upload_images/11092615-eacadf658e5b2536.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

新建`App.vue`
```
<template>
    <div>
        Welcome
    </div>
</template>
```
修改`index.ts`
```
import Vue from 'vue'
import App from './App.vue'

let vm = new Vue({
    el: '#root',
    render: h => h(App)
})

```
可以看到报错
![image.png](https://upload-images.jianshu.io/upload_images/11092615-78726ce68c27d8a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

解决方法：新建`vue-shims.d.ts`,也是任何.vue文件，都看成一个Vue类型(名称随便，后缀名一定要是`.d.ts`)
```
declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

```
解析`vue`，需要安装`npm i vue-loader vue-template-compiler --save-dev`

修改`webpack.base.js`
![image.png](https://upload-images.jianshu.io/upload_images/11092615-cb2c8b7d67cfd885.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

还需要引入一个插件
```
const VueLoaderPlugin = require('vue-loader/lib/plugin')
   plugins: [
            !isDev && new MiniCssExtractPlugin({
                filename:'css/main.css'
            }),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html',
                minify: !isDev && {
                    removeAttributeQuotes: true,//移除引号
                    collapseWhitespace: true //打包为一行
                }
            })
        ].filter(Boolean)
```
运行`npm run dev`，成功
![image.png](https://upload-images.jianshu.io/upload_images/11092615-eb3b7da36640693b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)





















