import { useState, useEffect } from 'react'
import styles from '@/components/member/coupon/float-coupon.module.css'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import { useAuthJWT } from '../../../hooks/use-auth-jwt'
import Swal from 'sweetalert2'

export default function FloatCoupon() {
  const { authJWT, setAuthJWT } = useAuthJWT()
  const [showSlide, setShowSlide] = useState(false)
  const pageLocation = usePathname()
  const [getCoupon, setGetCoupon] = useState('')
  const [claimedCoupons, setClaimedCoupons] = useState([])
  console.log(authJWT.userData.client_id)
  // 這裡開始
  // 領取重新渲染
  const handleCouponClaim = async (coupon) => {
    const updatedClaimedCoupons = [...claimedCoupons, coupon]
    setClaimedCoupons(updatedClaimedCoupons)
    await axios
      .post(
        'http://localhost:3002/coupon/record/create',
        {
          client_id: authJWT.userData.client_id,
          coupon_id: coupon.coupon_id,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      .then((res) => {
        if (res.data !== 'success') {
          Swal.fire({
            icon: 'success',
            title: '你已領取優惠卷！！',
          }).then(async (result) => {
            if (result.isConfirmed) {
              await axios
                .get('http://localhost:3002/coupon/frontCoupon', {
                  withCredentials: true,
                })
                .then((res) => {
                  const data = res.data
                  setGetCoupon(data)
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
    console.log(coupon)
  }
  //取得首頁 好康優惠 優惠卷的資料
  useEffect(() => {
    const getCoupon = async () => {
      await axios
        .get('http://localhost:3002/coupon/frontCoupon', {
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data
          setGetCoupon(data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getCoupon()
  }, [])
  // 這裡結束

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1080) {
        setShowSlide(true)
      } else {
        setShowSlide(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // 清除事件監聽
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div
        className={`${
          pageLocation.indexOf('newbook') < 0
            ? `${styles.floatCoupon} ${showSlide ? styles.active : ''}`
            : `${styles.pageCouponBlock}`
        }`}
      >
        <h4 className={styles.floatCouponTitle}>好康優惠</h4>
        <div className={styles.floatCouponShadow}>
          <div className={styles.frameDecorationTop}></div>
          <div className={styles.floatCouponBlock}>
            {/* 從這裡開始 */}
            {getCoupon.length > 0 ? (
              getCoupon.map((v, i) => {
                return (
                  <>
                    <div key={i} className={`${styles.couponBody} boder-pixel`}>
                      <div
                        className={`${styles.couponInformation} boder-pixel-w`}
                      >
                        <span>{v.coupon_name}</span>
                        {v.discount > 1 ? (
                          <h5 className='text-yellow'>
                            {Math.ceil(v.discount)}元
                          </h5>
                        ) : (
                          <h5 className='text-yellow'>
                            {v.discount
                              .toString()
                              .split('.')[1]
                              .replace(/^(d*?[1-9])0+$/, '$1')}
                            折
                          </h5>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          handleCouponClaim(v) // 传递当前优惠券对象到处理函数中
                        }}
                        className='mt-auto pixel-border-purple'
                      >
                        領取
                      </button>
                      {/* 按下後優惠券不消失，把button改成下面的div */}
                      {/* <div
                        className={`${styles.usedState} mt-auto`}
                      >
                        已領取
                      </div> */}
                    </div>
                  </>
                )
              })
            ) : (
              <h5 className='text-yellow'>已全部領取</h5>
            )}

            {/* 從這裡結束 */}
          </div>
          <div className={styles.frameDecorationBottom}></div>
        </div>
        <button className={styles.CMoreBtn}>
          <span>
            查看更多
            <div className='ms-2'>
              <i className='fa-solid fa-caret-right arrow-one'></i>
              <i className='fa-solid fa-caret-right arrow-two'></i>
              <i className='fa-solid fa-caret-right arrow-three'></i>
            </div>
          </span>
        </button>
      </div>
    </>
  )
}
