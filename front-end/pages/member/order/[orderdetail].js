import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import MemberSide from '@/components/member/member-side'
import Breadcrumb10 from '@/components/share/guide-pagination10'
import MemberMiddle from '@/components/member/member-middle'
import styles from '@/components/cart/css/cart-item.module.css'
import Link from 'next/link'

export default function OrderDetail() {

    const router = useRouter();
    const [order, setOrder] = useState([])
    const [detail, setDetail] = useState([])
    const [delivery, setdelivery] = useState([])
    const [receipt, setReceipt] = useState([])

    const url = 'http://localhost:3002/img/oldbookimgs/'


    //抓取資料
    useEffect(() => {
        const data = async () => {
            try {
                await axios
                    .get(`http://localhost:3002/member/user-order/${router.query.orderdetail}`, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        setDetail(res.data.detail)
                        setOrder(res.data.order)
                        setdelivery(res.data.delivery)
                        setReceipt(res.data.receipt)
                    }).catch((error) => {
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
            <div className='row'>
                <div className='col-2 col-xl-2 d-none d-md-flex px-0'>
                    <MemberSide />
                </div>
                <div className='col-12 col-md-10 col-xl-6'>
                    <div className='mb-5'>
                        <Breadcrumb10 crumb10='我的訂單' />
                        <MemberMiddle
                            TitleIcon='fa-solid fa-user me-2' // 標題icon
                            TitleName='訂單明細'
                        >
                            {/* 明細頭 */}
                            <div className={`row pixel-font-chinese text-center text-white`}>
                                <div className='col'></div>
                                <div className='col'>書名</div>
                                <div className='col'>類型</div>
                                <div className='col'>數量</div>
                                <div className='col'>金額</div>
                                <div className='col'></div>
                            </div>
                            {/* 明細 */}
                            <div>
                                {detail.map((item) => {
                                    return (
                                        <div className={`${styles.detail_height} ${styles.cart_item_body} row d-flex align-items-center text-center`} key={item.order_detail_id}>
                                            <div className='col'>
                                                <span className={styles.detailWidth}>
                                                    <img src={url + `${item.book_img_id}`} className='w-100' />
                                                </span>
                                            </div>
                                            <div className='col'>{item.b_title}</div>
                                            <div className='col'>{item.b_genre_name}</div>
                                            <div className='col'>{item.book_count}</div>
                                            <div className='col'>{item.book_price}</div>
                                            <div className='col'>
                                                <Link className='btn-jump-page' href={`http://localhost:3000/member/order/comment?id=${item.order_detail_id}`}>評價商品</Link>
                                            </div>
                                        </div>
                                    )
                                })}



                            </div>
                        </MemberMiddle>
                    </div>
                </div>
                <div className={`col-2 col-xl-4 ${styles.detail_fixed} ${styles.cart_item_body}`} >
                    <div className='dddddddddd'>
                        {order.map((user) => {
                            return (
                                <>
                                    <div className='col'>收件人名稱：{user.consignee}</div>
                                    <div className='col'>收件人電話：{user.consignee_phone}</div>
                                    <div className='col'>發票方式：{user != '' && receipt.length > 0 ? receipt[user?.receipt_id - 1]?.receipt_name : ''}</div>
                                    <div className='col'>配送方式：{user != '' && delivery.length > 0 ? delivery[user?.delivery_id - 1]?.delivery_name : ''}</div>
                                    <div className='col'>配送地址：
                                    </div><div>
                                        {user.delivery_address ? user.delivery_address : user.consignee_address}</div>
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>



        </>
    )
}
