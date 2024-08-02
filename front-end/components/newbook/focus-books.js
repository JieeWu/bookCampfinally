import React from 'react'
import FrontTitle from '@/components/share/front-title'
import styles from '@/components/newbook/focus-books.module.css'

export default function FocusBooks() {
  return (
    <>
      <div className='newbook-top'>
        <FrontTitle icon='fa-solid fa-expand me-2' title='焦點書籍' />
        <div className='row px-3'>
          <div className='col-4'>
            <div className='position-relative'>
              <div className={styles.focusBook}>
                <img src='/img/test/戀愛使用說明書1.png' />
              </div>
              <div className={styles.imgSpace}></div>
              <div className={`${styles.goBtnPosition} more-btn`}>
                <button className='fw-bold'>
                  前往了解<i className='fa-solid fa-arrow-right-long ms-2'></i>
                </button>
              </div>
              <div className={styles.focusContent}>
                <h5 className='fw-bold mb-2'>書籍名稱</h5>
                <span>
                  ＼橫向思考是釋放創造力、解決問題、抓住商機的最大關鍵！／★廉價航空的商業模式....
                </span>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='position-relative'>
              <div className={styles.focusBook}>
                <img src='/img/test/戀愛使用說明書1.png' />
              </div>
              <div className={styles.imgSpace}></div>
              <div className={`${styles.goBtnPosition} more-btn`}>
                <button className='fw-bold'>
                  前往了解<i className='fa-solid fa-arrow-right-long ms-2'></i>
                </button>
              </div>
              <div className={styles.focusContent}>
                <h5 className='fw-bold mb-2'>書籍名稱</h5>
                <span>
                  ＼橫向思考是釋放創造力、解決問題、抓住商機的最大關鍵！／★廉價航空的商業模式....
                </span>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='position-relative'>
              <div className={styles.focusBook}>
                <img src='/img/test/戀愛使用說明書1.png' />
              </div>
              <div className={styles.imgSpace}></div>
              <div className={`${styles.goBtnPosition} more-btn`}>
                <button className='fw-bold'>
                  前往了解<i className='fa-solid fa-arrow-right-long ms-2'></i>
                </button>
              </div>
              <div className={styles.focusContent}>
                <h5 className='fw-bold mb-2'>書籍名稱</h5>
                <span>
                  ＼橫向思考是釋放創造力、解決問題、抓住商機的最大關鍵！／★廉價航空的商業模式....
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
