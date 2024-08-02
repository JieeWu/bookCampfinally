import express from "express";
import db from "../../modules/database.js";

const selleroldbookRouter = express.Router();

//新增
selleroldbookRouter.post("/", (req, res) => {
  const q =
    "INSERT INTO book(`b_title`, `book_price`,`author`, `book_quantity`, `b_language_id`, `blurb`, `book_status_id`, `sherlf_date`, `revise_date`, `b_genre_id`,`b_type_id`,`book_img_id`,`isbn`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";

  const values = [
    req.body.b_title,
    req.body.book_price,
    req.body.author,
    req.body.book_quantity,
    req.body.b_language_id,
    req.body.blurb,
    req.body.book_status_id,
    req.body.sherlf_date,
    req.body.revise_date,
    req.body.b_genre_id,
    req.body.b_type_id,
    req.body.book_img_id,
    req.body.isbn
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//更新
selleroldbookRouter.put("/:book_id", (req, res) => {
  const clientId = req.user.client_id;
  const oldbookId = req.params.book_id;
  const oldbook =
    "UPDATE book SET `b_title`=?, `book_price`=?, `author`=?, `book_quantity`=?, `book_language`=?, `blurb`=?, `revise_date`=?, `b_genre_id`=?, `b_type_id`=?, `book_img_id`=?, `isbn`=? WHERE `book_id`=? AND `client_id`=?;";

  const values = [
    req.body.b_title,
    req.body.book_price,
    req.body.author,
    req.body.book_quantity,
    req.body.book_language,
    req.body.blurb,
    req.body.revise_date,
    req.body.b_genre_id,
    req.body.b_type_id,
    req.body.book_img_id,
    req.body.isbn,
    oldbookId,
    clientId,
  ];

  console.log(values);

  db.query(oldbook, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("更新成功");
  });
});

selleroldbookRouter.get("/:book_id", async (req, res) => {
  const oldbookId = req.params.book_id;

  const checkOwnershipQuery = "SELECT * FROM book WHERE `book_id`=?";

  try {
      const [data] = await db.query(checkOwnershipQuery, [oldbookId]); 

      if (data.length === 0) {
          // 如果沒有找到任何記錄，則返回錯誤消息
          return res.status(404).send("找不到此商品");
      }

      return res.json(data);
  } catch (err) {
      return res.json(err);
  }
});

export default selleroldbookRouter;
