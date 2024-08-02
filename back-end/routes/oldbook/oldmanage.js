import express  from "express";
import db from "../../modules/database.js";
import dayjs from "dayjs";
import authenticate from "../../middlewares/jwt.js";



//這個是賣家的商場 不過已經沒有用了:)
//建立路由器
const oldmanageRouter = express.Router()

oldmanageRouter.get('/my-store',authenticate,async (req, res)=>{
    const clientId = req.user.client_id;
    console.log(clientId);
    try{
        
        //會員資料的每筆資料
        const clientAll = `SELECT * FROM client WHERE client_id=?`
        const [client] = await db.query(clientAll, clientId)
        //二手書資料
        const oldbookAll =`SELECT * FROM book WHERE client_id=?`
        const [oldbook] =await db.query(oldbookAll,clientId)
        //上下架
        const bookstatusAll = "SELECT * FROM book_status"
        const [bookstatus] =await db.query(bookstatusAll)
        
        client.forEach((i)=>{
            i.join_date=dayjs(i.join_date).format("YYYY-MM-DD");
        })
        oldbook.forEach((i)=>{
            i.sherlf_date=dayjs(i.sherlf_date).format("YYYY-MM-DD");
        })

        
        res.json({client,oldbook,bookstatus,oldbookCount: oldbook.length})
        
    }catch(err){
        res.json(err)
    }
})

export default oldmanageRouter;
