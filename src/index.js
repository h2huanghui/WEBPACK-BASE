

//把这个模块打包 解析出浏览器可以识别的代码
// let result = require('./a-module')
// console.log(result)

//引入css样式
import './index.css'
// import './a.scss' 
//获取当前打包logo后的路径
import logo from './logo.jpg'
console.log(logo)
let img = document.createElement('img')
img.src = logo
document.body.appendChild(img)








