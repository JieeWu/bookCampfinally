import 'dotenv/config'
import express, { query, urlencoded } from 'express'
import db from '../../modules/database.js'
import bcrypt from 'bcryptjs'
import authenticate from '../../middlewares/jwt.js'
import upload from '../../modules/upload-img.js'

const forum = express.Router()

forum.use(express.urlencoded({ extended: false }))
forum.use(express.json())
// 自訂 middleware 檢查是否有帶著token進來

forum.post('/user', authenticate, async (req, res) => {
  console.log(req.body)
  const sql = 'SELECT * FROM client WHERE client_id = ?'
  const [data] = await db.query(sql)

  res.json(data)
})
forum.get('/select/category/:pid', async (req, res) => {
  const itemsPerPage = 6
  const pageIndex = parseInt(req.query.page) || 1
  const pid = req.params.pid
  console.log(pid)
  try {
    console.log(pid)
    const totalCountQuery = `SELECT COUNT(*) as totalCount FROM forum JOIN forum_category ON forum.forum_category_id = forum_category.forum_category_id WHERE forum_category.forum_category_id='${pid}'`
    const [[totalCountResult]] = await db.query(totalCountQuery)
    const offset = (pageIndex - 1) * itemsPerPage
    // 分頁做到一半 幹你娘

    const sql = `SELECT * FROM forum JOIN forum_category ON forum.forum_category_id = forum_category.forum_category_id WHERE forum_category.forum_Cname ='${pid}'`
    const [rows] = await db.query(sql, [pid])
    rows.forEach((row) => {
      const publishTime = new Date(row.forum_create_time)
      const taiwanTime = publishTime.toLocaleString({
        timeZone: 'Asia/Taipei',
        hour12: false,
      })
      row.forum_create_time = taiwanTime
        .replace(' 上午', '')
        .replace(' 下午', '')
    })
    res.json({ rows })
  } catch (error) {
    console.log(error)
  }
})
// 收藏
forum.post('/collect', async (req, res) => {
  const fid = 1
  const cid = 1
  const sql = 'INSERT INTO forum_collect (forum_id,client_id) VALUES (?,?)'
  await db.query(sql, [fid, cid])
  res.json(111)
})
//印出收藏
forum.get('/collect', async (req, res) => {
  const sql =
    'select f.forum_title,f.forum_content,f.forum_create_time from forum_collect as c JOIN forum as f ON c.forum_id = f.forum_id WHERE c.client_id = 1'
})
// // 根據pid取得文章
forum.get('/post/:post_id', async (req, res) => {
  const { post_id } = req.params
  const { status } = req.query
  const sql =
    'SELECT * FROM forum JOIN client ON forum_id = ? AND (forum.client_id = client.client_id) '
  const replyDataSql =
    'SELECT forum_reply.*,client.client_name FROM forum_reply JOIN forum ON forum_reply.forum_id = forum.forum_id JOIN client ON forum_reply.client_id = client.client_id WHERE forum_reply.forum_id = ?'
  const [avatar] = await db.query(sql, [post_id])
  const [replyData] = await db.query(replyDataSql, [post_id])
  avatar.forEach((row) => {
    const publishTime = new Date(row.forum_create_time)
    const taiwanTime = publishTime.toLocaleString({
      timeZone: 'Asia/Taipei',
      hour12: false,
    })
    row.forum_create_time = taiwanTime.replace(' 上午', '').replace(' 下午', '')
  })

  const data = res.locals.jwtData
  res.json({ rows: avatar, data, replyData })
})
// 文章
forum.post('/reply/message', async (req, res) => {
  const postId = req.body
  const sql =
    'SELECT * FROM forum_message as f JOIN client as c ON f.client_id = c.client_id WHERE forum_id=? '
  const data = await db.query(sql, [postId])
  res.json(data)
})
forum.post('/reply/message2', authenticate, async (req, res) => {
  try {
    const [data] = req.body
    const data2 = req.user.client_id
    const sql = `INSERT INTO forum_message (id,client_id,forum_id,forum_content) VALUES (?,?,?,?)
    `
    const result = await db.query(sql, [
      parseInt(data.id),
      data2,
      parseInt(data.post_id),
      data.content,
    ])
    console.log(data.post_id)
    // const resSql =
    // 'SELECT * FROM forum_message WHERE forum_id = ? AND forum_id IN (SELECT forum_id FROM forum_reply)'
    const resSql =
      'SELECT * FROM forum_message as f JOIN client as c ON f.client_id = c.client_id WHERE forum_id=?'
    const [successRes] = await db.query(resSql, [data.post_id])
    console.log(successRes)
    res.status(200).json(successRes)
  } catch (error) {
    console.error(error)
    res.status(500).send('error')
  }
})
//圖片上傳
forum.post('/try-upload', upload.single('avatar'), (req, res) => {
  console.log(req.file.filename)
  const data = {
    errno: 0,
    data: {
      url: `http://localhost:3002/img/${req.file.filename}`,
    },
  }
  res.json(data)
})
forum.get('/select/post', async (req, res) => {
  const itemsPerPage = 6
  const pageIndex = parseInt(req.query.page) || 1
  try {
    // 查询总文章数量
    const totalCountQuery =
      "SELECT COUNT(*) as totalCount FROM forum WHERE client_id != 'NULL'"
    const [[totalCountResult]] = await db.query(totalCountQuery)
    const totalCount = totalCountResult.totalCount
    const offset = (pageIndex - 1) * itemsPerPage

    // 构建 SQL 查询语句
    const sql = `
    SELECT * FROM forum f
    JOIN forum_category c ON f.forum_category_id = c.forum_category_id
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `

    const [rows] = await db.query(sql)
    rows.forEach((row) => {
      const publishTime = new Date(row.forum_create_time)
      const taiwanTime = publishTime.toLocaleString('en-US', {
        timeZone: 'Asia/Taipei',
        hour12: false,
      })
      row.forum_create_time = taiwanTime.replace(' AM', '').replace(' PM', '')
    })
    res.json({ rows, totalCount })
  } catch (error) {
    console.log(error.message)
    res.send('error')
  }
})

// // 問題
forum.get('/select/question', async (req, res) => {
  const sql = 'SELECT * FROM forum_question '
  const [data] = await db.query(sql)
  res.json(data)
})
forum.get('/reply', async (req, res) => {
  const sql =
    'SELECT * FROM forum JOIN forum_reply ON forum.forum_id = forum_reply.forum_id WHERE forum.forum_id = forum_reply.forum_id'
  const [res2] = await db.query(sql)

  res.json(res2)
})

// 使用 ES6 的方式導出 router
// // 設置靜態路由

// // 測試新增
forum.post('/api/insertData', authenticate, async (req, res) => {
  console.log(req.user)
  try {
    const { title, content, question } = req.body

    const categorySql =
      'SELECT forum_category_id FROM forum_category WHERE forum_Cname = ?'
    const [data] = await db.query(categorySql, question)
    const categoryId = data[0].forum_category_id

    const clientId = req.user.client_id
    const sql =
      'INSERT INTO forum (forum_title,forum_content,client_id,forum_category_id	) VALUES (?,?,?,?)'
    const values = [title, content, clientId, categoryId]
    console.log('values', values)
    const [result] = await db.query(sql, values)
    if (result.affectedRows > 0) {
      res.json('pass')
    } else {
      res.json('error')
    }
  } catch (error) {
    console.log(error)
  }
})
// 新增留言
// // 分類
forum.get('/select/category', async (req, res) => {
  const sql = 'SELECT * FROM forum_category'
  const [rows] = await db.query(sql)
  res.json({ rows })
})
//取得編輯資料
forum.post('/getEdit', authenticate, async (req, res) => {
  console.log(111)
  console.log(req.body)
  const sql = 'SELECT * FROM forum WHERE forum_id = ?'
  const [data] = await db.query(sql, [req.body])
  const cid = data[0].forum_category_id
  const sqlC =
    'SELECT forum_Cname FROM forum_category WHERE forum_category_id = ?'
  const [result] = await db.query(sqlC, cid)
  const newData = { ...data[0], forum_Cname: result[0].forum_Cname }
  console.log(newData)
  res.json(newData)
})
//修改編輯後資料
forum.put('/putEdit', authenticate, async (req, res) => {
  const { title, content, question, forum_id, status } = req.body
  const categorySql =
    'UPDATE forum SET forum_title=? , forum_content=? , forum_category_id=?  WHERE forum_id = ?'
  const [result] = await db.query(categorySql, [
    title,
    content,
    question,
    forum_id,
  ])
  console.log(result)
  res.json(req.body)
})
forum.use(express.static('public'))

export default forum
