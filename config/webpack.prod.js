const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

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
