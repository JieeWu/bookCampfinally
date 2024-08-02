import express from 'express'
import db from '../../modules/database.js'

const router = express.Router()

// //++
// router.get("/few", async (req, res) => {
//   try {
//     const book = `SELECT * FROM book ORDER BY book_price ASC;`;
//     const [bookAll] = await ㄇdb.query(book);
//     res.json({bookAll});
//   } catch (error) {
//     res.status(500).json({ message: "錯誤" });
//   }
// });

// //--
// router.get("/many", async (req, res) => {
//     try {
//       const book = `SELECT * FROM book ORDER BY book_price DESC;`;
//       const [bookAll] = await db.query(book);
//       res.json({bookAll});
//     } catch (error) {
//       res.status(500).json({ message: "錯誤" });
//     }
//   });
router.get('/books', async (req, res) => {
  try {
    const sortOrder = req.query.sortOrder || 'ASC'

    if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
      return res.status(400).json({ message: '無效的排序参数' })
    }

    const book = `SELECT * FROM book ORDER BY book_price ${sortOrder};`
    const [bookAll] = await db.query(book)
    res.json({ bookAll })
  } catch (error) {
    res.status(500).json({ message: '錯誤' })
  }
})

export default router
