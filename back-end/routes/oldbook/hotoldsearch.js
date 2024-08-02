import express from "express";
import db from "../../modules/database.js";


const hotodsearch = express.Router();

//這個是熱門搜尋 已經做好了:)
hotodsearch.get("/", async(req, res) => {
    try{
        const term = req.query.term;
        
        const [data] = await db.query(
            `SELECT * FROM book WHERE b_title LIKE ?`,
            [`%${term}%`]
        );
        res.json(data);
    }catch(err){
        console.error(err);
       
    }
})


export default hotodsearch;