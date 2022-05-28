// 数据层 controler只关心数据
const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    // where 1=1 起占位作用
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword) {
        sql += `and title like '%${keyword}%' ` // title模糊查询
    }
    sql += `order by createtime desc;`
    // 返回一个promise
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}';`
    // 取数组的第一个元素 then返回的也是promise
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含 title content 属性
    const content = blogData.content
    const title = blogData.title
    const author = blogData.author
    const createTime = Date.now()
    console.log('author',author);
    const sql = `
        insert into blogs (title, content, createtime, author)
        value ('${title}', '${content}', '${createTime}', '${author}')
    `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId // 插入的id号
        }
    })
}

const updateBlog =  (id, blogData = {}) => {
    const title = blogData.title ;
    const content = blogData.content;

    const sql = `
        update blogs set title='${title}', content='${content}' where id='${id}';
    `
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) { // 影响的行数大于零 说明更新成功
            return true
        }
        return false
    })
}

const deleteBlog = (id, author) => {
    const sql = `
        delete from blogs where id='${id}' and author='${author}';
    `
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) { // 影响的行数大于零 说明更新成功
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}