import React, { useContext } from 'react'
import styles from './commodity-page.module.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartContext } from '@/hooks/cartContext'
import CollectButton from '@/components/oldbook/CollectButton'
import { useAuthJWT } from '@/hooks/use-auth-jwt'
export default function CommodityPageBig({ item, book_price, total_count, book_img_id, b_title, blurb, book_id }) {
  const url = 'http://localhost:3002/img/oldbookimgs/';
  //偵測路由
  const router = useRouter()
  // 加入購物車按鈕
  const handleAddCart = (e) => {
    try {
      axios
        .post('http://localhost:3002/share/addcart/add', e, {
          withCredentials: true,
        })
        .then((res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '加入購物車',
            timer: 1500
          })
          setCartItem(res.data.newcart)

        }).catch((error) => {
          console.log(error);
        })
    } catch (error) {
      console.log(error)
    }
  }
  // 使用會員
  const { authJWT } = useAuthJWT()
  // 請先加入會員
  const handleAlert = (e) => {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: '請先登入',
      confirmButtonText: '前往',
      cancelButtonText: '取消',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/member/login')
      }
    })
  }

  // 購物車狀態
  const { setCartItem } = useContext(CartContext);

  return (
    <>
      <div className={`${styles.hotlistCard} pixel-border-purple`}>
        <Link href={'/newbook/' + book_id}>
          <img src={url + `${book_img_id}`} />
        </Link>
        <div className='mt-auto text-white position-relative'>
          <CollectButton oldBookId={book_id} />
          <div className='p-3 pb-0'>
            <h5 className='fw-bold px-2'>{b_title}</h5>
            <p className='mt-2 mb-0'>
              { }
            </p>
          </div>
          <div className='d-flex m-2'>
            <div
              className={`${styles.SaleBlock} m-bg-yellow w-100 py-2 font-s`}
            >
              銷售量 :<span>{total_count}</span>本
            </div>
            <div className={styles.priceArea}>
              <div className='d-bg-purple pixel-d-purple w-100 p-1'>
                <i className='fa-solid fa-circle-dollar-to-slot me-2'></i>
                {book_price}元
              </div>

              <button type='button' className={styles.addButton} onClick={(e) => { authJWT.isAuth !== false ? handleAddCart(item) : handleAlert(e) }}>
                <i className='fa-solid fa-cart-plus'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
