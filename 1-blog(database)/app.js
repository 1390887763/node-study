// 业务层
const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取 path url中?的前半部分
    const url = req.url
    req.path = req.url.split('?')[0]

    // 解析 query url中?的后半部分
    req.query = querystring.parse(url.split('?')[1])

    // 解析 post Data
    getPostData(req).then(postData => {
        req.body = postData
        
        // 处理 blog 路由 
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            console.log(1123123);
            return
        }
        

        //处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中路由，返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("Oh My God! 404 Not Found\n")
        res.end()
    })
}

module.exports = serverHandle