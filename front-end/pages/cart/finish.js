import React, { useState, useEffect } from 'react'

import axios from 'axios'
import Swal from 'sweetalert2'

// 取用Redux
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "@/Redux/action.js";

import CartItemHeader from '@/components/cart/cart-item-header'
import CartDialogBtn from '@/components/cart/cart-dialog-btn'
import CartItem from '@/components/cart/cart-book'
import CartPart from '@/components/cart/cart-part'

import styles from '@/components/cart/css/cart-item.module.css'
import inforstyles from '@/components/cart/css/cart-information.module.css'



export default function Checkout3() {

    //取用Redux
    const localorder = useSelector((state) => state.order); //此為完整訂單內容，拿來傳送給後端

    // 讀取 
    const [allData, setAllData] = useState([]);

    // 傳給產品
    const [book, setBook] = useState([]);

    //取用Redux
    const dispatch = useDispatch();

    //抓取資料
    useEffect(() => {
        const data = async () => {
            try {
                await axios.post('http://localhost:3002/cart/finish', localorder, {
                    headers: {
                        'content-type': 'application/json',
                    },
                    withCredentials: true,
                })
                    .then((res) => {
                        let data = {
                            coupon: res.data.bookcoupon == '' ? '' : res.data.bookcoupon[0].coupon_name,
                            user: res.data.userdata.client_name,
                            userPhone: res.data.userdata.phone,
                            userAddress: res.data.userdata.client_address,
                            point: res.data.point,
                            usepoint: res.data.usepoint,
                            consignee: res.data.bookorder[0].consignee,
                            consigneePhone: res.data.bookorder[0].consignee_phone,
                            consigneeAddress: res.data.bookorder[0].consignee_address,
                            dilivery: res.data.bookdelivery[0].delivery_name,
                            pay: res.data.bookpay[0].pay_name,
                            receipt: res.data.bookreceipt[0].receipt_name,
                            fee: res.data.bookorder[0].delivery_fee,
                            other: res.data.bookorder[0].other,
                            total: res.data.bookorder[0].total,
                        }
                        setAllData(data);
                        setBook(res.data.bookdetail);

                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: '感謝您的訂購！',
                            showConfirmButton: true,
                        })

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

    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    {/* 步驟 */}
                    <div className="col-12 mb-5">
                        <CartPart />
                    </div>

                    {/* 個人訊息 */}
                    <div className="col-12 col-md-6 mb-5">
                        <div className='frame-line-black-heart'>
                            <div className={`${inforstyles["data_frame"]}`}>

                                {/* 個人資訊 */}
                                <div className="row mb-5">
                                    <div className='col-6'>
                                        <h3><b>購買人資訊</b></h3>
                                        <div>
                                            <span>姓名：</span>
                                            <span>{allData.user}</span>
                                        </div>
                                        <div>
                                            <span>電話：</span>
                                            <span>{allData.userPhone}</span>
                                        </div>
                                        <div>
                                            <span>地址：</span>
                                            <div>{allData.userAddress}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <h3><b>收貨人資訊</b></h3>
                                        <div>
                                            <span>姓名：</span>
                                            <span>{allData.consignee}</span>
                                        </div>
                                        <div>
                                            <span>電話：</span>
                                            <span>{allData.consigneePhone}</span>
                                        </div>
                                        <div>
                                            <span>地址：</span>
                                            <div>{allData.consigneeAddress}</div>
                                        </div>

                                    </div>
                                    <div className='col-12'>
                                        <span>備註：</span>
                                        <span>{allData.other}</span>
                                    </div>
                                </div>

                                {/* 重要資訊 */}
                                <div className='row'>
                                    <div className="col-4">
                                        <h3><b>發票</b></h3>
                                        <div>{allData.receipt}</div>
                                    </div>
                                    <div className="col-4">
                                        <h3><b>配送</b></h3>
                                        <div>{allData.dilivery}</div>
                                    </div>
                                    <div className="col-4">
                                        <h3><b>付款</b></h3>
                                        <div>{allData.pay}</div>
                                    </div>
                                </div>

                                {/* 優惠 */}
                                <div className='row'>
                                    <div className='col-4'>
                                        <h3><b>優惠卷</b></h3>
                                        <div>{allData.coupon}</div>
                                    </div>
                                    <div className='col-4'>
                                        <h3><b>消費點數</b></h3>
                                        <div>您剩餘<span>{allData.point}</span>點</div>
                                    </div>
                                    <div className='col-4'>
                                        <div>
                                            <h3><b>運費</b></h3>
                                            <div>{allData.fee}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3.如果是銀行轉帳->顯示一個匯款帳號，
                                然後有一個4小時的setTimeout在倒數
                                4.如果是貨到付款就顯示711選擇的地址。 */}

                                <div className='col-12'>
                                    ---------------------------

                                    <div className='text-end'>${allData.total}元</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 產品 */}
                    <div className="col-12 col-md-6 mb-5">
                        <CartItemHeader />
                        <div className={`frame-line-black ${styles.cart_bg}`}>
                            {book.map((item) =>
                                <CartItem item={item} />
                            )}
                        </div>
                        <CartDialogBtn Shopping="返回購物車" next="繼續購物" href='/book' />
                    </div>
                </div>
            </div>


            <style jsx>
                {`
            h3{
                display: inline; 
  margin: 0; 
  padding: 0;
            }

            `}</style>
        </>
    )
}
