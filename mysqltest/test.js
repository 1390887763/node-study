const fs = require('fs') // 文件操作的库
const path = require('path') // 路径操作的库

// __dirname 为当前的目录 现在fileName就是data.txt文件
const fileName = path.resolve(__dirname, 'data.txt')

// 读文件 异步
fs.readFile(fileName, (err, data) => {
    if(err) {
        console.error(err)
        return
    }
    // data 是二进制内容，需要转换为字符串
    console.log(data.toString());
})


// 写文件
const content = '些图三顿饭\n'
const opt = {
    flag: 'a' // 追加写入，覆盖用‘w’
}
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.error(err);
    }
})

// 判断文件是否存在
fs.exists(fileName, (exist) => {
    console.log('exist',exist);
})

// 思考：耗费系统性能
// 1.读文件时：若文件太大 直接打开会占用内存
// 2.写文件时：若每次都打开文件 进行操作 会造成不必要的浪费
//           若文件太大如何处理

// 使用stream 流，见test1.js