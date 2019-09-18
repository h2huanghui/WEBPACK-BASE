const dev = require('./webpack.dev')
const prod = require('./webpack.prod')
const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniXCssExtractLoader = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = (env) => {
    console.log(env) //环境变量 
    let isDev = env.development
    const base = {
        entry: path.resolve(__dirname, '../src/index4.ts'),
        module: {
            //转化什么文件,用什么去转,使用哪些loader
            //写法 [](多个loader) 或 {}(传参数) 或 ''
            //打包css还需要处理 样式前缀
            //scss编译完成后,加入前缀,转成css,再放到style中

            //解析css的时候 就不能渲染dom(单线程)
            //css可以并行和js 一同加载 mini-css-extract-plugin
            rules: [
                {
                    test: /\.vue$/,
                    use: {
                        loader: 'vue-loader'
                    }
                },
                {//解析js文件 默认会用调用@babel/core
                    test: /\.tsx?$/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {//解析js文件 默认会用调用@babel/core
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [//是不是开发环境,如果是开发环境使用style-loader
                       isDev ? 'style-loader' : MiniXCssExtractLoader.loader,
                        {
                            loader: 'css-loader',
                            options: { //给loader传递参数,css文件引入了其他文件,你从当前这个loader之后执行这个文件(先调用sass-loader,再调用css-loader) 如果写2 就是调用后面两个(可以写多,不可以写少)
                                importLoaders: 2
                            }
                        }, 'postcss-loader', 'sass-loader']
                },
                { //匹配到scss文件,用sass-loader调用node-sass处理sass文件。(不用写node-sass,因为是默认去调)
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                { //图标转换
                    test: /\.(woff|ttf|eot|svg)$/,
                    use:'file-loader'
                },
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
            ]
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, '../dist')
        },
        plugins: [
            //如果是开发模式,就不需要抽离样式
            !isDev &&　new MiniXCssExtractLoader({
                filename:'css/main.css'
            }), 
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'), //以public里面的index.html作为模板
                filename: 'index.html',
                minify: !isDev && { //生产环境下压缩代码
                    removeAttributeQuotes: true, //去除引号
                    collapseWhitespace: true //去除空格(压缩成一行)
                }
            })
        ].filter(Boolean) //isDev为true是 返回false(不能放在数组中,需要过滤到)

    }
    //函数返回配置文件
    if (isDev) {
        return merge(base, dev)  //循环后面的配置 定义到前面去(不是覆盖的关系,是合并)
        console.log(merge(base, dev))
    } else {
        return merge(base, prod)
    }
}