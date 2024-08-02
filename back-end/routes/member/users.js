import express from "express";
import dayjs from "dayjs";
const router = express.Router();
import { updateById } from "../../models/base.js";
import bcrypt from "bcryptjs";

// 檢查空物件
import { isEmpty } from "../../utils/tool.js";

// 認証用middleware(中介軟體)
// import auth from '../middlewares/auth.js'

// 上傳檔案用使用multer(另一方案是使用express-fileupload)
import multer from "multer";
// const upload = multer({ dest: "public/img/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/member/");
  },
  filename: function (req, file, cb) {
    // 檔名加上時間戳達成唯一檔名
    cb(null, Date.now() + file.originalname);
    console.log(123);
  },
});

const upload = multer({ storage: storage });

const userTable = "client";

import {
  cleanAll,
  createBulkUsers,
  createUser,
  deleteUserById,
  getCount,
  getUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserById,
  verifyUser,
} from "../../models/users.js";

// GET - 得到所有會員資料
router.get("/", async function (req, res, next) {
  const users = await getUsers();
  return res.json({ message: "success", code: "200", users });
});

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get("/:userId", async function (req, res, next) {
  const user = await getUserById(req.params.userId);
  user.birthday = dayjs(user.birthday).format("YYYY-MM-DD");

  delete user.passwd;
  delete user.edit_date;
  delete user.edited_by;
  delete user.client_IC;
  delete user.application_date;
  delete user.login_time;
  delete user.wallet;
  delete user.bank_account;
  delete user.client_permissions;

  return res.json({ message: "success", code: "200", user });
});

// POST - 上傳檔案用，使用express-fileupload
router.post("/upload", async function (req, res, next) {
  // req.files 所有上傳來的檔案
  // req.body 其它的文字欄位資料…
  console.log(req.files, req.body);

  if (req.files) {
    console.log(req.files.avatar); // 上傳來的檔案(欄位名稱為avatar)
    return res.json({ message: "success", code: "200" });
  } else {
    console.log("沒有上傳檔案");
    return res.json({ message: "fail", code: "409" });
  }
});

// POST - 上傳檔案用，使用multer
// 注意: 使用nulter會和express-fileupload衝突，所以要先註解掉express-fileupload的使用再作測試
// 在app.js中的app.use(fileUpload())
router.post(
  "/upload2",
  upload.single("avatar"), // 上傳來的檔案(這是單個檔案，欄位名稱為avatar)
  async function (req, res, next) {
    if (req.file) {
      console.log(req.file);
      // 將檔名insert至資料庫
      const result = await updateById(
        userTable,
        { avatar: req.file.filename },
        req.body.client_id
      );
      console.log(result);

      return res.json({ message: "success", code: "200" });
    } else {
      console.log("沒有上傳檔案");
      return res.json({ message: "fail", code: "409" });
    }
  }
);

// POST - 新增會員資料
router.post("/register", async function (req, res, next) {
  const user = req.body;
  user.passwd = await bcrypt.hash(user.passwd, 10); 
  
  user.birthday = dayjs(user.birthday).format("YYYY-MM-DD");

  user.join_date = dayjs(user.join_date).format("YYYY-MM-DD");

  // 檢查從瀏覽器來的資料，如果為空物件則失敗
  if (isEmpty(user)) {
    return res.json({ message: "fail", code: "400" });
  }

  // 這裡可以再檢查從react來的資料，哪些資料為必要(name, username...)
  console.log(user);

  // 先查詢資料庫是否有同username與email的資料
  const count = await getCount({
    client_name: user.client_name,
    email: user.email,
  });

  // 檢查使用者是否存在
  if (count) {
    return res.json({ message: "fail", code: "400" });
  }

  // 新增至資料庫
  const result = await createUser(user);

  // 不存在insertId -> 新增失敗
  if (!result.insertId) {
    return res.json({ message: "fail", code: "400" });
  }

  // 成功加入資料庫的回應
  return res.json({
    message: "success",
    code: "200",
    user: { ...user, id: result.insertId },
  });
});

// PUT - 更新會員資料
router.put("/:userId", async function (req, res, next) {
  const userId = req.params.userId;
  const user = req.body;
  user.join_date = dayjs(user.join_date).format("YYYY-MM-DD");
  console.log(userId, user);

  // 檢查是否有從網址上得到userId
  // 檢查從瀏覽器來的資料，如果為空物件則失敗
  if (!userId || isEmpty(user)) {
    return res.json({ message: "error", code: "400" });
  }

  // 這裡可以再檢查從react來的資料，哪些資料為必要(name, username...)
  console.log(user);

  // 對資料庫執行update
  const result = await updateUserById(user, userId);
  console.log(result);

  // 沒有更新到任何資料
  if (!result.affectedRows) {
    return res.json({ message: "fail", code: "400" });
  }

  // 最後成功更新
  return res.json({ message: "success", code: "200" });
});

// reset password
router.post("/reset-password/:client_id", async function (req, res, next) {
  const data = req.body;
  const client_id = req.params.client_id;
  console.log(data);

  if (!client_id) {
    return res.json({ message: "error", code: "400" });
  }
  const user = await getUserById(client_id);

  const comparePassword = bcrypt.compareSync(data.oldPassword, user.passwd);
  if (!comparePassword) {
    return res.json({ message: "fail", code: "400" });
  }

  const passwd = await bcrypt.hash(data.newPassword, 10);
  const result = await updateById(userTable, { passwd }, client_id);
  console.log(result);

  res.json({ message: "success", code: "200" });
});

export default router;
