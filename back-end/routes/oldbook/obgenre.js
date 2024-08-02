import express from "express";
import db from "../../modules/database.js";

//建立路由
const obgenerRouter = express.Router();

//這個是找到分類的所有資料 也就是側邊的地方
obgenerRouter.get("/:b_genre_id", async (req, res) => {
  try {
    const obookid = parseInt(req.params.b_genre_id) || 0;
    //分類的資料
    const genreAll = `SELECT * FROM  book_genre WHERE b_genre_id=?`;
    const [genre] = await db.query(genreAll, [obookid]);
    //新書的資料
    const oldbookAll = `SELECT * FROM book WHERE 
    b_genre_id=?`;
    const [oldbook] = await db.query(oldbookAll, [obookid]);
    res.json({genre, oldbook });
    
  } catch (err) {
    res.json(err);
  }
});

obgenerRouter.get("/language/:book_language", async(req, res) =>{
  try{
    const obookid = parseInt(req.params.book_language) || 0;
    //語言的資料
    const languageAll =`SELECT * FROM book_language WHERE b_language_id=?`;
    const [language] = await db.query(languageAll,[obookid]);
     //新書的資料
     const oldbookAll = `SELECT * FROM book WHERE 
     b_language_id=?`;
     const [oldbook] = await db.query(oldbookAll, [obookid]);
     res.json({language, oldbook });


  }catch(err){
    console.log(err);
  }
} )


export default obgenerRouter;