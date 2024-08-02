import express from "express"; //使用express
import db from "../../modules/database.js"; //連線資料庫
import authenticate from "../../middlewares/jwt.js";

//建立路由器
const searchcollect = express.Router();

//可以找到會員的所有收藏 
//本來寫好的會員收藏有新書和舊書 但現在只需要新書 不用舊書了:)
searchcollect.get("/", authenticate, async (req, res) => {
  const clientId = req.user.client_id;
  try {
    // 會員的資料
    const clientAll = `SELECT * FROM client WHERE client_id=?`;
    const [client] = await db.query(clientAll, [clientId]);

    // 該會員收藏的舊書資料
    //沒有舊書也就不用這筆資料了:)
    // const collectOldBookData = `
    //     SELECT ob.* 
    //     FROM collect_old_book AS cob
    //     JOIN old_book AS ob ON cob.old_book_id = ob.old_book_id
    //     WHERE cob.client_id=?
    // `;
    // const [collectOldBook] = await db.query(collectOldBookData, [clientId]);

    // 該會員收藏的新書資料
    //當初一起寫好的 就不用改了 :) 呵呵
    const collectBookData = `
        SELECT b.* 
        FROM collect_book AS cb
        JOIN book AS b ON cb.book_id = b.book_id
        WHERE cb.client_id=?
    `;
    const [collectBook] = await db.query(collectBookData, [clientId]);
    
    
    // 本來type是判定新書二手書 但type改成書籍語言的分類 那也不用判定了
    //只需要定是哪種語言的書 :)
    const genreAll = "SELECT * FROM book_genre";
    const [genre] = await db.query(genreAll);
    res.json({ client,collectBook, genre });
   
  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default searchcollect;
