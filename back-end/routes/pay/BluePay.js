import express from "express"; //使用Express框架
import querystring from 'querystring';
import crypto from 'crypto';

const router = express.Router();

const { BLUEPAY_MerchantID,
    BLUEPAY_HashKey,
    BLUEPAY_HashIV,
    BLUEPAY_ReturnURL,
    BLUEPAY_ClientBackURL,
} = process.env;

//日期轉換
// 獲取 JavaScript 的時間戳（毫秒數）
const orderiii = new Date().getTime();

// 將毫秒數轉換成秒數
const javascriptTimestampInSeconds = Math.floor(orderiii / 1000);

router.post("/", async (req, res) => {
    try {
        const total = req.body.total;
        // 藍新需求資料格式一
        const string = {
            MerchantID: `${BLUEPAY_MerchantID}`,
            TimeStamp: javascriptTimestampInSeconds,
            Version: '2.0',
            RespondType: 'String',
            LangType: ' zh-tw',
            MerchantOrderNo: orderiii,  //商店訂單編號
            ItemDesc: 'book',
            Amt: total, //訂單金額
            CREDIT: 1,
            TradeLimit:60,
            // ReturnURL: `${BLUEPAY_ReturnURL}`,  //交易完成導向畫面
            ClientBackURL: `${BLUEPAY_ClientBackURL}`,
        }
        const data = querystring.stringify(string);  //轉成querystring字串
        const aes256cbcData = encryptData(data); //aes-256-cbc加密
        const hexString = aes256cbcData.toString('hex');
        const hashs = `HashKey=${BLUEPAY_HashKey}&${hexString}&HashIV=${BLUEPAY_HashIV}`;
        const sha256Hash = stringToBite(hashs); //sha256加密

        //發請求格式
        const post = {
            MerchantID: `${BLUEPAY_MerchantID}`,
            TradeInfo: hexString,
            TradeSha: sha256Hash,
            Version: '2.0',
            EncryptType: 0,
        }
        // const sig = querystring.stringify(post);
        res.json({ post })
    } catch (error) {
        console.log('錯在外面', error);
    }
})

// 加密AES
function encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', `${BLUEPAY_HashKey}`, `${BLUEPAY_HashIV}`);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return Buffer.from(encrypted, 'hex');
}

// 加密SHA
function stringToBite(str) {
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    return hash.toUpperCase();
}

export default router;