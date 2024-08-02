import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '@/components/member/coupon/member-coupon.module.css'
import { useRouter } from 'next/router'

export default function CouponInput({ setStatus, status, setCoupons }) {
  const [couponCode, setCouponCode] = useState('')
  const router = useRouter()
  const InputBox = router.pathname

  const handleStatus = () => {
    setStatus(!status) // 將setStatus的值取反來處理checkbox的狀態變化
  }

  const handleInputChange = (event) => {
    setCouponCode(event.target.value)
  }

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3002/coupon/coupon_code/search',
        {
          coupon_code: couponCode,
          type: status,
          client_id: 33,
        },
      )

      setCoupons(response.data.data)
    } catch (error) {
      console.error('Error searching coupon code:', error)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch() // 按下 Enter 執行搜尋操作
    }
  }

  return (
    <>
      {/* 選取區塊 */}
      {InputBox === '/cart' ? (
        <div className={`${styles.cartCoupon}`}>
          <input
            className={styles.state}
            type='checkbox'
            id='coupon_toggle'
            checked={status}
            onChange={handleStatus}
          />
          <div className={styles.cartCheckbox}>
            <label htmlFor='coupon_toggle' className={styles.slide}>
              <label
                htmlFor='coupon_toggle'
                className={`${styles.toggle} boder-pixel`}
              >
                <span></span>
              </label>
              <label htmlFor='coupon_toggle' className={styles.text}>
                已領取
              </label>
              <label htmlFor='coupon_toggle' className={`${styles.text} ps-4`}>
                所有優惠
              </label>
            </label>
          </div>
        </div>
      ) : (
        <div className={`${styles.switchCoupon} my-3`}>
          <div className='position-absolute top-0 start-50 translate-middle-x'>
            <div className={`${styles.stateCoupon} boder-pixel`}>
              <input
                className={styles.state}
                type='checkbox'
                id='coupon_toggle'
                // onChange={() => {setPickStatus.checked}}
                checked={status}
                onChange={handleStatus}
              />
              <div className={styles.checkbox}>
                <label htmlFor='coupon_toggle' className={styles.slide}>
                  <label
                    htmlFor='coupon_toggle'
                    className={`${styles.toggle} boder-pixel`}
                  >
                    <span></span>
                  </label>
                  <label htmlFor='coupon_toggle' className={styles.text}>
                    已領取
                  </label>
                  <label
                    htmlFor='coupon_toggle'
                    className={`${styles.text} ps-4`}
                  >
                    所有優惠
                  </label>
                </label>
              </div>
            </div>
          </div>
          <div
            className={`${styles.inputCoupon} d-none d-md-flex col-2 input-type`}
          >
            <i className='fa-solid fa-pen my-2 mx-3'></i>
            <input
              className='p-2'
              type='text'
              name='coupon-code'
              value={couponCode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              id=''
              placeholder='輸入代碼'
            />
          </div>
        </div>
      )}
      {/* 手機板搜尋框 */}
      <div className={InputBox === '/cart' ? 'd-none' : ''}>
        <div className='d-flex d-md-none input-type mb-3'>
          <i className='fa-solid fa-pen my-2 mx-3'></i>
          <input
            className='p-2 d-bg-purple w-100 text-white'
            type='text'
            name='coupon-code'
            value={couponCode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // 監聽鍵盤按鍵
            id=''
            placeholder='輸入代碼'
          />
        </div>
      </div>
    </>
  )
}
