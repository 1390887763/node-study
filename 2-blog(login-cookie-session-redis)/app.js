// 业务层
const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')

// 获取cookie的过期时间 toGMTString为cookie的时间格式
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000)) //设置过期时间为24h
    return d.toGMTString()
}

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

// 所有的HTTP请求都会经过serverHandle
const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取 path url中?的前半部分
    const url = req.url
    req.path = req.url.split('?')[0]

    // 解析 query url中?的后半部分
    req.query = querystring.parse(url.split('?')[1])

    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // eg: k1=v1;k2=v2;k3=v3
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0]
        const val = arr[1]
        req.cookie[key] = val
    });

    // 解析session （使用redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if(!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session值
        set(userId, {})
    }
    // 获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionDate => {
        if(sessionDate == null) {
             // 初始化 redis 中的 session值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else  {
            // 设置 session
            req.session = sessionDate
        }
        console.log('req.session', req.session);
        // 处理 post data(这里返回的是promise 可以和下面的getPostData连接起来)
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData
        
        // 处理 blog 路由 
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if(needSetCookie) {
                    // 操作 cookie 
                    // path为根路由 对所有的网页都生效 
                    // httpOnly表示只允许通过后端来改cookie->安全
                    // expires=${getCookieExpires()} 设置cookie过期时间
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
    
        //处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
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