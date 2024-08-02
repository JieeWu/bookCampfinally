import "dotenv/config";
import express, { urlencoded } from "express";
import db from "../modules/database.js";
import bcrypt from "bcryptjs";
import cors from "cors";
import jwt from "jsonwebtoken";

const forum = express.Router();

forum.use(express.urlencoded({ extended: false }));
forum.use(express.json());
// 自訂 middleware 檢查是否有帶著token進來
forum.use((req, res, next) => {
  const auth = req.get("Authorization");
  if (auth && auth.indexOf("Bearer ") === 0) {
    const token = auth.slice(7);
    let jwtData = null;
    try {
      jwtData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (ex) {}
    if (jwtData) {
      res.locals.jwtData = jwtData; // 標記有沒有使用 token
    }
  }
  next();
});
const corsOptions = {
  credentials: true,
  origin: function (origin, cb) {
    // console.log({ origin });
    cb(null, true);
  },
};
forum.use(cors(corsOptions));

forum.get("/select/category/:pid", async (req, res) => {
  const itemsPerPage = 6;
  const pageIndex = parseInt(req.query.page) || 1;
  const pid = req.params.pid;
  try {
    console.log(pid);
    const totalCountQuery = `SELECT COUNT(*) as totalCount FROM forum JOIN forum_category ON forum.forum_category_id = forum_category.forum_category_id WHERE forum_category.forum_category_id='${pid}'`;
    const [[totalCountResult]] = await db.query(totalCountQuery);
    const offset = (pageIndex - 1) * itemsPerPage;
    // 分頁做到一半 幹你娘

    const sql = `SELECT * FROM forum JOIN forum_category ON forum.forum_category_id = forum_category.forum_category_id WHERE forum_category.forum_Cname ='${pid}'`;
    const [rows] = await db.query(sql, [pid]);
    rows.forEach((row) => {
      const publishTime = new Date(row.forum_create_time);
      const taiwanTime = publishTime.toLocaleString({
        timeZone: "Asia/Taipei",
        hour12: false,
      });
      row.forum_create_time = taiwanTime
        .replace(" 上午", "")
        .replace(" 下午", "");
    });
    res.json({ rows });
  } catch (error) {
    console.log(error);
  }
});

// // 根據pid取得文章
forum.get("/post/:post_id", async (req, res) => {
  const { post_id } = req.params;
  const { status } = req.query;
  const sql = "SELECT * FROM forum WHERE forum_id = ?";
  const replyDataSql =
    "SELECT forum_reply.*,client.client_name FROM forum_reply JOIN forum ON forum_reply.forum_id = forum.forum_id JOIN client ON forum_reply.client_id = client.client_id WHERE forum_reply.forum_id = 5";
  const [avatar] = await db.query(sql, [post_id]);
  const [replyData] = await db.query(replyDataSql);
console.log(avatar);
  avatar.forEach((row) => {
    const publishTime = new Date(row.forum_create_time);
    const taiwanTime = publishTime.toLocaleString({
      timeZone: "Asia/Taipei",
      hour12: false,
    });
    row.forum_create_time = taiwanTime
      .replace(" 上午", "")
      .replace(" 下午", "");
  });

  const data = res.locals.jwtData;
  res.json({ rows: avatar, data, replyData });
});
// 文章
forum.post("/reply/message", async (req, res) => {
  const postId = req.body;
  const sql =
    "SELECT * FROM forum_message WHERE forum_id = ? AND forum_id IN (SELECT forum_id FROM forum_reply)";
  const data = await db.query(sql, [postId]);
  console.log(data);
  res.json(data);
});
forum.post("/reply/message2", async (req, res) => {
  try {
    const [data] = req.body;
    const data2 = res.locals.jwtData;
    const sql = `INSERT INTO forum_message (id,client_id,forum_id,forum_content) VALUES (?,?,?,?)
    `;
    const result = await db.query(sql, [
      parseInt(data.id),
      data2.id,
      parseInt(data.post_id),
      data.content,
    ]);
    const resSql =
      "SELECT * FROM forum_message WHERE forum_id = 5 AND forum_id IN (SELECT forum_id FROM forum_reply)";
    const [successRes] = await db.query(resSql, [data.post_id]);
    res.status(200).json(successRes);
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }
});
forum.get("/select/post", async (req, res) => {
  const itemsPerPage = 6;
  const pageIndex = parseInt(req.query.page) || 1;
  try {
    // 查询总文章数量
    const totalCountQuery =
      "SELECT COUNT(*) as totalCount FROM forum WHERE client_id != 'NULL'";
    const [[totalCountResult]] = await db.query(totalCountQuery);
    const totalCount = totalCountResult.totalCount;
    const offset = (pageIndex - 1) * itemsPerPage;

    // 构建 SQL 查询语句
    const sql = `
    SELECT * FROM forum f
    JOIN forum_category c ON f.forum_category_id = c.forum_category_id
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `;

    const [rows] = await db.query(sql);

    rows.forEach((row) => {
      const publishTime = new Date(row.forum_create_time);
      const taiwanTime = publishTime.toLocaleString("en-US", {
        timeZone: "Asia/Taipei",
        hour12: false,
      });
      row.forum_create_time = taiwanTime.replace(" AM", "").replace(" PM", "");
    });
console.log(totalCount);
    res.json({ rows, totalCount });
  } catch (error) {
    console.log(error.message);
    res.send("error");
  }
});

// // 問題
forum.get("/select/question", async (req, res) => {
  const sql = "SELECT * FROM forum_question ";
  const [data] = await db.query(sql);
  res.json(data);
});
forum.get("/reply", async (req, res) => {
  const sql =
    "SELECT * FROM forum JOIN forum_reply ON forum.forum_id = forum_reply.forum_id WHERE forum.forum_id = forum_reply.forum_id";
  const [res2] = await db.query(sql);

  res.json(res2);
});

// 使用 ES6 的方式導出 router
// // 設置靜態路由

// // 測試新增
forum.post("/api/insertData", async (req, res) => {
  const { title, content } = req.body;
  const sql = "INSERT INTO forum (forum_title,forum_content) VALUES (?, ?)";
  const values = [title, content];
  try {
    await db.query(sql, values, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      } else {
        res.json({ message: "Data inserted successfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
// 新增留言
forum.post("/reply/");
// // 分類
forum.get("/select/category", async (req, res) => {
  const sql = "SELECT * FROM forum_category";
  const [rows] = await db.query(sql);
  res.json({ rows });
});
// // 會員登入 及 token
forum.post("/login", async (req, res) => {
  const output = {
    success: false,
    code: 0,
    msg: "",
  };
  const { account, password } = req.body;
  const sql = "SELECT * FROM client WHERE client_name = ?";
  const [rows] = await db.query(sql, [account]);

  if (!rows.length) {
    output.code = 400;
    output.msg = "帳號或密碼錯誤";
    return res.json(output);
  }
  const row = rows[0];
  console.log(row);
  if (bcrypt.compare(password, row.password)) {
    output.code = true;
    const token = jwt.sign(
      {
        id: row.client_id,
        account: row.client_name,
        email: row.email,
        img: row.avatar,
      },
      process.env.JWT_SECRET
    );
    output.data = {
      id: row.client_id,
      username: row.client_name,
      email: row.email,
      password: row.passwd,
      img: row.avatar,
      token,
    };
  } else {
    output.code = 420;
    output.msg = "帳號或密碼錯誤";
  }
  console.log(output);

  res.json(output);
});
forum.put("/post/edit", async (req, res) => {
  const [status] = req.body;
  console.log(status);
  const sql = `SELECT * FROM forum WHERE forum_id =?`;
  const [data] = await db.query(sql, [status.post]);
  console.log(data);
  res.send(data);
});
forum.use(express.static("public"));

export default forum;
