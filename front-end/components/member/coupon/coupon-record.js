import { useState, useEffect } from 'react'
import styles from '@/components/member/coupon/coupon-record.module.css'
import axios from 'axios'

export default function CouponRecord() {
  const [cRecord, setCRecord] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let param = {
          client_id: 33, // 到時要換成實際的會員id
        }
        const response = await axios.post(
          `http://localhost:3002/coupon/history`,
          param,
        )
        setCRecord(response.data.data)
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {/* 優惠券區塊 */}
      <div className={`${styles.offset} row`}>
        <div className={styles.cRecordHeader}>
          <div className={styles.cHeaderGrid}>優惠券名稱</div>
          <div className={styles.cHeaderGrid}>訂單編號</div>
          <div className={styles.cHeaderGrid}>結束日期</div>
          <div className={styles.cHeaderGrid}>使用日期</div>
          <div className={styles.cHeaderGrid}>狀態</div>
        </div>

        <div className='my-3 px-1 px-md-4'>
          {cRecord.map((v) => {
            return (
              <>
                <div
                  className={`${styles.cProduct} pixel-box--white`}
                  key={v.coupon_record_id}
                >
                  <div
                    className={`${styles.cProductGrid} ${styles.cProductTitle} fw-bold w-100`}
                  >
                    {v.coupon_name}
                  </div>
                  <div
                    className={`${styles.cProductGrid} ${styles.cProductOrder}`}
                  >
                    {v.order_id === null ? (
                      <span>-</span>
                    ) : (
                      <button
                        type='button'
                        className='c-bg-purple pixel-border-purple text-white'
                        data-bs-toggle='modal'
                        data-bs-target={`#${v.order_id}`}
                      >
                        {v.order_id}
                      </button>
                    )}

                    {/* Modal */}
                    <div
                      className='modal fade'
                      id={v.order_id}
                      tabIndex={-1}
                      aria-labelledby='adModalLabel'
                      aria-hidden='true'
                    >
                      <div className='modal-dialog modal-dialog-centered'>
                        <div className='yellow-alert pixel-border-yellow'>
                          <div className='modal-header'>
                            <h1
                              className='modal-title fs-5 fw-bold'
                              id='adModalLabel'
                            >
                              訂單編號 {v.order_id}
                            </h1>
                            <button
                              type='button'
                              className='btn-close'
                              data-bs-dismiss='modal'
                              aria-label='Close'
                            />
                          </div>
                          <div className='modal-body'>訂單表格?</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.cProductGrid} ${styles.cProductEndDate}`}
                  >
                    <span className={`${styles.titleS} d-md-none`}>
                      結束時間
                    </span>
                    {v.end_time.replace(/-/g, '/')}
                  </div>
                  <div
                    className={`${styles.cProductGrid} ${styles.cProductDate}`}
                  >
                    <span className={`${styles.titleS} d-md-none`}>
                      使用時間
                    </span>
                    {v.use_time === null ? '-' : v.use_time.replace(/-/g, '/')}
                  </div>
                  <div
                    className={`${styles.cProductGrid} ${
                      styles.cProductState
                    } ${
                      v.use_status_id === 2 ? 'c-bg-purple' : 'br-bg-purple'
                    }`}
                  >
                    <div className={`${styles.stateText} fw-bold`}>
                      {v.status_type_name}
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}
