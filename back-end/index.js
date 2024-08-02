/* 引入「可配置.env檔案」啟動 */
import "dotenv/config.js";

/* 引入插件 */
import express from "express"; //使用express框架
import cors from "cors"; //跨領域
import path from "path"; //修正 __dirname for esm
import cookieParser from "cookie-parser"; //解析cookie
import authenticate from "./middlewares/jwt.js";
import upload from "./modules/upload-img.js";
import { Server } from "socket.io";
import http from "http";
// 修正 __dirname for esm
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.WEB_PORT || 3002;

// 讓console.log可以呈現檔案與行號
import { extendLog } from "./utils/tool.js";
extendLog(); // 執行全域套用

import "colors"; // 讓console.log可以呈現顏色

/* 主要 */
const app = express();
const httpServer = http.createServer(app); // 使用你的 express 应用实例 'app'
const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:3000","http://localhost:3000", "https://newbookcamp.ngrok.app/"], // 允许来自这个域的请求
    methods: ["GET", "POST","PUT","DELETE"], // 允许的请求方法
  },
})

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("message", (data) => {
    console.log("Received message:", data.userId, ":", data.message, ":", data.avatar);
    io.emit("message", data); // 广播消息给所有连接的客户端
  });
  socket.on("chat", (message) => {
    io.emit("message", message);
  });
});
/* 跨領域 */
const corsOptions = {
  credentials: true,
  origin: function (origin, cb) {
    // console.log({ origin });
    cb(null, true);
  },
};
app.use(cors(corsOptions));

/* 首頁 */
import activityRouter from "./routes/share/activity.js" //活動專區
import hotListRouter from "./routes/share/hotList.js" //熱銷榜
import ENRouter from "./routes/share/ENlanguage.js" //英文書
import TWRouter from "./routes/share/TWlanguage.js" //中文書

/* 購物車引入檔 */
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";
import payRouter from "./routes/pay/linepay.js";
import blueRouter from "./routes/pay/BluePay.js";
import bankRouter from "./routes/pay/bankAnd711.js";
import addCartRouter from "./routes/share/addcart.js";
import userOrderRouter from "./routes/member/user-order.js";

/* 其他人引入檔 */
import couponRouter from './routes/coupon.js'
import advertiseRouter from './routes/advertise.js'
import forumRouter from './routes/forum/forum.js'
import oldbookRouter from './routes/oldbook/oldbook.js'
import storeRouter from './routes/oldbook/store.js'
import selleroldbookRouter from './routes/oldbook/selleroldbook.js'
import oldbookimg from './routes/oldbook/oldbookimg.js'
import obgenerRouter from './routes/oldbook/obgenre.js'
import odsearchRouter from './routes/oldbook/oldsearch.js'
import hotodsearchRouter from './routes/oldbook/hotoldsearch.js'
import searchcollectRouter from './routes/oldbook/searchcollect.js'
import collectRouter from './routes/oldbook/oldcollect.js'
import bookperpageRouter from './routes/oldbook/bookperpage.js'

/* 會員引入檔 */
import usersRouter from "./routes/member/users.js";
import authJwtRouter from "./routes/member/auth-jwt.js";
import googleLoginRouter from "./routes/member/google-login.js";
import emailRouter from "./routes/member/email.js";
import resetPasswordRouter from "./routes/member/reset-password.js";
import loadAvatarRouter from "./routes/member/avatar.js";

import oldmanageRouter from "./routes/oldbook/oldmanage.js";

/* middleware */
app.use(express.urlencoded({ extended: false })); //解析URL
app.use(express.json()); //解析JSON
app.use(cookieParser()); //解析cookie

/* ------------------------------------------ */

//首頁
// app.get("/", (req, res) => {
//   res.locals.title = "HOME - " + res.locals.title;
//   res.render("home");
// });

// Use是接受所有http的方法

// home 首頁
app.use("/share/activity", activityRouter);
app.use("/share/hotList", hotListRouter);
app.use("/share/TWlanguage", TWRouter);
app.use("/share/ENlanguage", ENRouter);

// client api 會員
app.use("/member/users", usersRouter); // 會員CRUD部分
app.use("/member/auth-jwt", authJwtRouter); // 登入登出的驗證
app.use("/member/google-login", googleLoginRouter); // google登入
app.use("/member/email", emailRouter); // 寄送驗證信otp
app.use("/member/reset-password", resetPasswordRouter); // 重設密碼
app.use("/member/avatar", loadAvatarRouter)

// cart api 購物車
app.use("/order", orderRouter); //後台訂單
app.use("/cart", cartRouter);
app.use("/pay/linepay", payRouter);
app.use("/pay/bankAnd711", bankRouter);
app.use("/pay/bluepay", blueRouter)
app.use("/share/addcart", addCartRouter);
app.use("/member/user-order",userOrderRouter)

// oldbook seller api 二手書 賣家
app.use('/oldbook', oldbookRouter)
app.use('/store', storeRouter)
app.use('/selleroldbook', selleroldbookRouter)
app.use('/oldbookupload', oldbookimg)
app.use('/obgenre', obgenerRouter)
app.use('/oldmanageRouter', oldmanageRouter)
app.use('/search', odsearchRouter)
app.use('/hotsearch', hotodsearchRouter)
app.use('/searchcollect', searchcollectRouter)
app.use('/collect', collectRouter)
app.use('/perpage', bookperpageRouter)

app.use("/public", express.static("public")); //可以讀後端圖片

// coupon api 優惠卷
app.use("/coupon", couponRouter);
// 廣告  advertise api
app.use("/advertise", advertiseRouter);
// forum api 留言板
app.use("/forum", forumRouter);

// 靜態資料夾
app.use(express.static("public")); //為了丟圖片
app.use("/public", express.static("public")); //可以讀後端圖片

/* ------------------------------------------ */

/* 網頁狀態顯示 */
app.use((req, res) => {
  res.type("text/html").status(404).send(`<h1>404-無法顯示網頁</h1>`);
});

/* 伺服器登入 */
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`express server 啟動 ${port}`.bgMagenta);
});
