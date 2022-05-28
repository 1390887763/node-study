// 数据层 controler只关心数据
const getList = (auther, keyword) => {
    return [
        {
            id: 1,
            title: '标题',
            content: '内容A',
            createTime: '1643508580668',
            author: 'zhangsan'
        },
        {
            id: 2,
            title: '标题2',
            content: '内容B',
            createTime: '1643508640167',
            author: 'lisi'
        }
    ]
}

const getDetail = (id) => {
    return {
        id: 1,
        title: '标题',
        content: '内容A',
        createTime: '1643508580668',
        author: 'zhangsan'
    }
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content 属性
    console.log('new Blog...', blogData);
    return {
        id: 3 // 表示新建博客，插入到数据表里面的 id
    }
}

const updateBlog =  (id, blogData = {}) => {
    return true
}

const deleteBlog = (id) => {
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}