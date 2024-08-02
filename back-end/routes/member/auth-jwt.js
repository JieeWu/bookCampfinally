import express from 'express'
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

const router = express.Router()

import authenticate from '../../middlewares/jwt.js'

import { verifyUser, getUser } from '../../models/users.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'
// 定義安全的私鑰字串
const accessTokenSecret = process.env.JWT_SECRET

// 驗證訪問者是否具有訪問指定路由（在這個例子中是/private路由）的權限。
router.get('/private', authenticate, (req, res) => {
  const user = req.user
  console.log('user', user)
  return res.json({ message: 'authorized', user })
})

// 檢查登入狀態用
router.get('/check-login', authenticate, (req, res) => {
  const user = req.user
  return res.json({ message: 'authorized', user })
})

router.post('/login', async (req, res) => {
  console.log(req.body)

  // 從要求的req.body獲取email與password
  const { email, passwd } = req.body

  // 先查詢資料庫是否有同email/password的資料
  const isMember = await verifyUser({
    email,
  })

  console.log(isMember)

  if (!isMember) {
    return res.json({ message: 'fail', code: '400' })
  }

  // 會員存在，將會員的資料取出
  const member = await getUser({
    email,
  })

  const comparePassword = bcrypt.compareSync(passwd, member.passwd)
  if (!comparePassword) {
    return res.json({ message: 'fail', code: '400' })
  }

  console.log(member)

  // 如果沒必要，member的password資料不應該，也不需要回應給瀏覽器
  delete member.passwd
  delete member.edit_date
  delete member.edited_by
  delete member.client_IC
  delete member.application_date
  delete member.login_time
  delete member.wallet
  delete member.bank_account
  delete member.client_permissions

  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign({ ...member }, accessTokenSecret, {
    expiresIn: '24h',
  })
  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }) // 傳送access token回應(react可以儲存在state中使用)
  res.json({
    message: 'success',
    code: '200',
    accessToken,
  })
})

router.post('/logout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })

  res.json({ message: 'success', code: '200' })
})

router.post('/logout-ssl-proxy', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })

  res.json({ message: 'success', code: '200' })
})

router.get('/:client_id', authenticate, (req, res) => {
  // console.log(req);
  return res.json(req.user)
})

export default router
