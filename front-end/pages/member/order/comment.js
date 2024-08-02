import React, { useState } from 'react'
import MemberSide from '@/components/member/member-side'
import Breadcrumb2 from '@/components/share/guide-pagination'
import MemberMiddle from '@/components/member/member-middle'
import styles from '@/components/member/ad/seller-ad.module.css'
import { useRouter } from 'next/router'
import OrderDetailComment from '@/components/order/order-detail-comment'
export default function Comment() {

  //評價
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState([]);

  const router = useRouter();


  // 送出評論
  const sentComment = async (e) => {
    try {
      await axios
        .put(`http://localhost:3002/member/user-order/${router.query.orderdetail}`, { rating, comment }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        })
        .then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '已評論！',
            showConfirmButton: true,
          })

        }).catch((error) => {
          console.log(error);
        })
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <>
      <div className='row'>
        <div className='col-2 d-none d-md-flex px-0'>
          <MemberSide />
        </div>
        <div className='col-12 col-md-10 col-xl-8 mobile-phone'>
          <div className='mb-5'>
            <Breadcrumb2 />
            <MemberMiddle
              TitleIcon='fa-solid fa-comment-dots pe-2'
              TitleName='評論商品'
              Remark='為此商品給一個評價吧!!'

            >
              <OrderDetailComment setRating={setRating} setComment={setComment} rating={rating} comment={comment} />


              <div className='d-flex justify-content-between py-4'>
                <button
                  type='button' onClick={() => { router.back() }}
                  className='text-white main-btn pixel-border-purple c-bg-purple'
                >
                  返回
                </button>
                <button
                  type='button'
                  className='main-btn pixel-border-yellow m-bg-yellow'
                  onClick={(e) => { sentComment(e); }}
                >
                  送出評論
                  <i className='fa-solid fa-upload ms-3'></i>
                </button>
                {/* Modal */}
                <div
                  className='modal fade'
                  id='adconfirm'
                  tabIndex={-1}
                  aria-labelledby='adModalLabel'
                  aria-hidden='true'
                >
                  <div
                    className={`${styles.paymentConfirmation} modal-dialog modal-dialog-centered`}
                  >
                    <div className='yellow-alert pixel-border-yellow'>
                      <div className='modal-body'>
                        <h5 className='mb-3 fw-bold'>
                          <i className='fa-regular fa-circle-check me-2'></i>
                          刊登確認
                        </h5>
                        <ul className={styles.adInformation}>
                          <li>
                            <h6 className='fw-bold me-3 mb-0'>標題</h6>
                            <span>限量珍藏版，即刻收藏 !</span>
                          </li>
                          <li>
                            <h6 className='fw-bold me-3 mb-0'>類型</h6>
                            <span className='class-frame'>中文書類</span>
                          </li>
                          <li>
                            <h6 className='fw-bold me-3 mb-0'>廣告時段</h6>
                            <span>2023/01/01 ~ 2023/12/31</span>
                          </li>
                        </ul>
                        <img
                          className='rounded-3'
                          src='/img/test/1200x300_ad_1.jpg'
                          width='100%'
                          alt=''
                        />
                      </div>
                    </div>

                    <div className={`${styles.totalBox} boder-pixel mt-md-0`}>
                      <img
                        className='d-none d-md-block'
                        src='/img/test/money.png'
                        alt=''
                      />
                      <div>
                        <div className='mb-2'>我的錢包 : ******元</div>
                        <div>廣告費用 : 10000元</div>
                        <hr />
                        <div className='text-orange text-end mb-3'>
                          錢包餘額 : ******
                        </div>
                        <button
                          type='button'
                          className='main-btn w-100 pixel-border-orange m-bg-orange'
                        >
                          確認刊登
                        </button>
                      </div>
                    </div>
                    <button
                      type='button'
                      className={styles.closebtn}
                      data-bs-dismiss='modal'
                      aria-label='Close'
                    >
                      <i className='fa-solid fa-xmark'></i>
                    </button>
                  </div>
                </div>
              </div>
            </MemberMiddle>
          </div>
        </div>

        <div className='col d-none d-xl-flex'></div>
      </div>
    </>
  )
}
