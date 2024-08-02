
import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { Collapse } from 'react-bootstrap';
import Swal from 'sweetalert2';

// 鉤子
import { CartContext } from '@/hooks/cartContext'

// 取用Redux
import { useSelector } from "react-redux";


// 引用功能
import CartPart from '@/components/cart/cart-part'
import CartBook from '@/components/cart/cart-book'
import CartDialogBtn from '@/components/cart/cart-dialog-btn'


// 引用CSS
import styles from '@/components/cart/css/cart-information.module.css'
import stylesitem from '@/components/cart/css/cart-item.module.css'


export default function Checkout2() {

    // 訂單
    let { orderCH, setOrderCH } = useContext(CartContext);

    // 前往結帳狀態
    const [goPay, setGoPay] = useState(false)

    // 藍新金流
    const [xxx, setxxx] = useState("")

    // 印出資料
    const [receiptData, setReceiptData] = useState([]);
    const [payData, setPaytData] = useState([]);
    const [deliveryData, setDeliveryData] = useState([]);

    //抓取資料
    useEffect(() => {
        const data = async () => {
            try {
                await axios.get('http://localhost:3002/cart/checkout', {
                    withCredentials: true,
                })
                    .then((res) => {
                        setReceiptData(res.data.bookreceipt)
                        setPaytData(res.data.bookpay)
                        setDeliveryData(res.data.bookdelivery)
                        setGoPay(false)
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } catch (error) {
                console.log(error)
            }
        }
        data()
    }, [])

    // 填入收貨人資料
    const [consignee, setConsignee] = useState('');
    // 填入收貨人電話
    const [consigneePhone, setConsigneePhone] = useState('');
    // 填入收貨人地址
    const [consigneeAddress, setConsigneeAddress] = useState('');
    // 填入其他意見
    const [other, setOther] = useState('');
    // 與購買人資料相同
    const sameuser = () => {
        setConsignee(orderCH.userName)
        setConsigneePhone(orderCH.userPhone)
        setConsigneeAddress(orderCH.userAddress)
    }

    //更新任何一項都刷新
    useEffect(() => {
        let newValue = {
            ...orderCH,
            consignee: consignee,
            consigneePhone: consigneePhone,
            consigneeAddress: consigneeAddress,
            other: other,
        }

        setOrderCH(newValue)
    }, [consignee, consigneePhone, consigneeAddress, other])


    // 選擇發票方式
    const [receipt, setReceipt] = useState(1);
    useEffect(() => {
        let newValue = {
            ...orderCH,
            receipt: receipt ? receipt : '1',
        }
        setOrderCH(newValue)
    }, [receipt])

    // 選擇配送方式
    const [delivery, setDelivery] = useState(0);
    useEffect(() => {
        let newValue = {
            ...orderCH,
            delivery: delivery,
        }
        setOrderCH(newValue)
    }, [delivery])


    // 選擇付款方式
    const [pay, setPay] = useState(0);
    useEffect(() => {
        let newValue = {
            ...orderCH,
            pay: pay,
        };
        setOrderCH(newValue)

        //假如我選了2就先幫我做好簽章
        if (pay == '2') {
            const creditCart = async () => {
                try {
                    await axios.post('http://localhost:3002/pay/BluePay', orderCH, {
                        headers: {
                            'content-type': 'application/json',
                        },
                    },)
                        .then((res) => {
                            setxxx(res.data.post)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } catch (error) {
                    console.log(error)
                }
            }
            creditCart()
        }
    }, [pay]);

    console.log(xxx);

    // 已選購產品資料展開
    const [open, setOpen] = useState(true);


    /* 錯誤訊息 需要驗證的資料 */
    const errorMessage = {
        consignee: '',
        consigneePhone: '',
        consigneeAddress: '',
        delivery: '',
        pay: '',
    }
    const [error, setError] = useState(errorMessage);
    const newError = { ...errorMessage }

    let errorMessageBtn = (e) => {
        let hasError = false;
        if (!consignee || !consigneePhone || !consigneeAddress) {
            Swal.fire({
                title: '請填寫收貨人資料',
            })
            newError.consignee = '請填寫收貨人姓名'
            newError.consigneePhone = '請填寫收貨人電話'
            newError.consigneeAddress = '請填寫收貨人地址'
            hasError = true
        }
        if (!delivery) {
            Swal.fire({
                title: '請選擇配送方式',
            })
            newError.delivery = '請填寫配送方式'
            hasError = true
        }
        if (!pay) {
            Swal.fire({
                title: '請選擇付款方式',
            })
            newError.pay = '請填寫付款方式'
            hasError = true
        }
        if (hasError) {
            setError(newError);
            e.preventDefault();
            return;
        }
        setError(errorMessage);
        setGoPay(true);
    };
    console.log(orderCH.pay);

    /* 前往付款 */
    useEffect(() => {
        if (orderCH.pay == 1) {
            const linepay = async () => {
                try {
                    await axios.post('http://localhost:3002/pay/linepay', orderCH, {
                        headers: {
                            'content-type': 'application/json',
                        },
                    },)
                        .then((res) => {
                            window.location.href = res.data;
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } catch (error) {
                    console.log(error)
                }
            }
            linepay()
        } else if (orderCH.pay == 2) {

        } else if (orderCH.pay == 3) {
            const bank = async () => {
                try {
                    await axios.post('http://localhost:3002/pay/bank', orderCH, {
                        headers: {
                            'content-type': 'application/json',
                        },
                    },)
                        .then((res) => {
                            // window.location.href = res.data;
                            console.log(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } catch (error) {
                    console.log(error)
                }
            }
            bank()
        } else if (orderCH.pay == 4) {
            const seven711 = async () => {
                try {
                    await axios.post('http://localhost:3002/pay/seven711', orderCH, {
                        headers: {
                            'content-type': 'application/json',
                        },
                    },)
                        .then((res) => {
                            // window.location.href = res.data;
                            console.log(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } catch (error) {
                    console.log(error)
                }
            }
            seven711()
        }

    }, [goPay])




    //取用Redux
    const localorder = useSelector((state) => state.order); //當作訂單預設值
    const books = useSelector((state) => state.book);

    //假如重整遺失資料就執行這裡寫回來
    useEffect(() => {
        orderCH = { ...localorder }
    }, [orderCH.pay == 0])


    return (
        <>
            <div className='container'>
                <div className="pixel-font-chinese pt-5">
                    <div className='pb-5'>
                        <CartPart />
                    </div>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            {/* 資料 */}
                            <div className='frame-line-black-heart mb-4'>
                                <div className={`${styles.data_frame}`}>
                                    {
                                        <>
                                            <div className='p-3'>
                                                <div className="d-flex justify-content-between pb-2">
                                                    <h3><b>購買人資訊</b></h3>
                                                    <p> * 為必填資訊</p>
                                                </div>
                                                <div className='pb-2'>
                                                    <span>購買人：</span>
                                                    <span>{orderCH.userName}</span>
                                                </div>
                                                <div className='pb-2'>
                                                    <span>電話：</span>
                                                    <span>{orderCH.userPhone}</span>
                                                </div>
                                                <div className='pb-2'>
                                                    <span>地址：</span>
                                                    <span>{orderCH.userAddress}</span>
                                                </div>
                                            </div>



                                            <div className='p-3'>
                                                <div className="d-flex">
                                                    <h3><b>收貨人資訊</b></h3>
                                                    <button className={`ms-3 ${styles["same-name-btn"]}`}
                                                        onClick={sameuser}>資料同上</button>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 pb-2">
                                                        <div className='d-flex justify-content-between'>
                                                            <label className='py-2' for="consignee">* 收貨人</label>
                                                            <span className='text-danger'>{error.consignee}</span>
                                                        </div>
                                                        <input className={`${styles["person-input"]}`} type="text" id="consignee" value={consignee} onChange={(e) => { setConsignee(e.target.value) }} />
                                                    </div>
                                                    <div className="col-12 pb-2">
                                                        <label className='py-2' for="consigneePhone">* 電話</label>
                                                        <span className='text-danger'>{error.consigneePhone}</span>
                                                        <input className={`${styles["person-input"]}`} type="text" id="consigneePhone" value={consigneePhone} onChange={(e) => { setConsigneePhone(e.target.value) }} />
                                                    </div>
                                                    <div className="col-12 pb-2">
                                                        <label className='py-2' for="consigneeAddress">* 地址</label>
                                                        <span className='text-danger'>{error.consigneeAddress}</span>
                                                        <input className={`${styles["person-input"]}`} type="text" id="consigneeAddress" value={consigneeAddress} onChange={(e) => { setConsigneeAddress(e.target.value) }} />
                                                    </div>
                                                    <div className="col-12 pb-2">
                                                        <label className='py-2' for="consigneeOther">備註</label>
                                                        <input className={`${styles["person-input"]}`} type="text" id="consigneeOther" value={other} onChange={(e) => { setOther(e.target.value) }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            {/* 發票 */}
                            <div className='frame-line-black-heart mb-4'>
                                <div className={`${styles.data_frame}`}>
                                    <h3><b>發票方式</b></h3>
                                    {(receiptData ? receiptData : localreceipt).map((v) => {
                                        return (
                                            <div key={v.receipt_id} className="input-radio-div">
                                                <input id={`receipt${v.receipt_id}`} type="radio" name="receipt-group" value={v.receipt_id} onChange={(e) => { setReceipt(e.target.value) }} checked={!receipt ? 1 : receipt == v.receipt_id} />
                                                <label htmlFor={`receipt${v.receipt_id}`} className="input-radio-label">{v.receipt_name}</label>
                                                {
                                                    v.receipt_id == 3 ? <input type="text" className="input-box-all" /> : ""
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            {/* 配送 */}
                            <div className='frame-line-black-heart mb-4'>
                                <div className={`${styles.data_frame}`}>
                                    <h3><b>配送方式</b></h3>
                                    {deliveryData.map((v) => {
                                        return (
                                            <>
                                                <div key={v.delivery_id} className='input-radio-div'>
                                                    <input type="radio" id={`delivery${v.delivery_id}`} name="delivery-group" value={v.delivery_id} onChange={(e) => { setDelivery(e.target.value) }} />
                                                    <label className='input-radio-label' htmlFor={`delivery${v.delivery_id}`}>{v.delivery_name}</label>
                                                    <div className={`${styles["img-size"]}`} >
                                                        <img src={`/img/cart/delivery${v.delivery_id}.png`} alt="delivery" className="w-100" />
                                                    </div>
                                                </div>
                                                {v.delivery_id == 2 ?
                                                    <div>
                                                        <button className="btn-jump-page px-5">選擇門市</button>
                                                        <p> **市 **路 **門市</p>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            {/* 付款 */}
                            <div className='frame-line-black-heart mb-4'>
                                <div className={`${styles.data_frame}`}>
                                    <h3><b>付款方式</b></h3>
                                    <div className="row" id="pay-radio">
                                        {payData.map((v) => {
                                            return (
                                                <label className={`col-3 ${styles["center-index"]}`} key={v.pay_id}>
                                                    <input type="radio" name="pay-group" value={v.pay_id} onChange={(e) => { setPay(e.target.value) }} hidden />
                                                    <div className={`input-choose-style ${styles["center-index"]}`}>
                                                        <div className={`${styles["img-size"]}`} >
                                                            <img src={`/img/cart/pay${v.pay_id}.png`} alt="pay" className="w-100" />
                                                        </div>
                                                        <p>{v.pay_name}</p>
                                                    </div>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-6'>
                            {/* 選購產品 */}
                            <div className='position-relative cart-cart-area'>
                                <div className={`${styles["cart-item-hidden"]}`} onClick={() => setOpen(!open)}>
                                    ▼　訂單資訊　▼
                                </div>
                                <Collapse in={open}>
                                    <div id="example-collapse-text">
                                        <div className={`frame-line-black ${stylesitem.cart_bg}`}>
                                            {(orderCH.book ? orderCH.book : books).map((item) => {
                                                return (
                                                    <CartBook item={item} />
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Collapse>
                            </div>

                            <form method='post' action="https://ccore.newebpay.com/MPG/mpg_gateway">
                                <input type='hidden' id='MerchantID' name='MerchantID' value={xxx.MerchantID} />
                                <input type='hidden' id='TradeInfo' name='TradeInfo' value={xxx.TradeInfo} />
                                <input type='hidden' id='TradeSha' name='TradeSha' value={xxx.TradeSha} />
                                <input type='hidden' id='Version' name='Version' value={xxx.Version} />
                                <input type='hidden' id='EncryptType' name='EncryptType' value={xxx.EncryptType} />
                                <CartDialogBtn Shopping="返回購物車" next="前往結帳" errorMessageBtn={errorMessageBtn} submit='submit' pay={pay} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}
