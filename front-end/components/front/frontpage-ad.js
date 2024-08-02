import { useState, useEffect } from 'react'
import styles from './front-page.module.css'
import Link from 'next/link'
import axios from 'axios'

export default function FrontPageAd() {
  const [advertises, setAdvertises] = useState([])
  const [book, setBook] = useState([])
  const [low,setLow] = useState([])

  // 輪播大圖廣告
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(
          `http://localhost:3002/advertise/ad_size`,
        ).then((res) => {
          console.log('傳ㄌ啥',res.data);
          setAdvertises(res.data.adData.data)
          setBook(res.data.book.book_id)
          setLow(res.data.lowprice.book_id)

        }).catch((error) => {
          console.log(error);
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  return (
    <>
      {/* 首頁廣告區 */}
      <div>
        <div className={`${styles.carouselImg} boder-pixel`}>
          <div
            id='carouselInterval'
            className='carousel slide'
            data-bs-ride='carousel'
          >
            <div className='carousel-inner'>
              {advertises
                ? advertises.map((v, i) => {
                  return (
                    <>
                      <div
                        className={
                          i == 0 ? 'carousel-item active' : 'carousel-item'
                        }
                        data-bs-interval='5000'
                        key={v.ad_id}
                      >
                        <Link
                          href={
                            v.client_id !== null
                              ? `/store/${v.client_id}`
                              : v.ad_class === 'class'
                                ? `/book/language/${v.b_genre_id}`
                                : `/book/${v.book_id}`
                          }
                        >
                          <picture className='d-block w-100'>
                            <source
                              srcSet={`http://localhost:3002/public/img/ad/${v.ad_img_urls.find(
                                (url) => url.includes('1200x300'),
                              )}`}
                              media='(min-width: 768px)'
                            />
                            <source
                              srcSet={`http://localhost:3002/public/img/ad/${v.ad_img_urls.find(
                                (url) => url.includes('800x300'),
                              )}`}
                              media='(min-width: 540px)'
                            />
                            <img
                              src={`http://localhost:3002/public/img/ad/${v.ad_img_urls.find(
                                (url) => url.includes('300x300'),
                              )}`}
                              alt=''
                              width='100%'
                            />
                          </picture>
                        </Link>
                      </div>
                    </>
                  )
                })
                : ''}

              {/* <div className='carousel-item' data-bs-interval='2000'>
              <a href='#'>
                <picture className='d-block w-100'>
                  <source
                    srcSet='/img/all-ad/1200x300_ad_2.jpg'
                    media='(min-width: 768px)'
                  />
                  <source
                    srcSet='/img/all-ad/800x300_ad_2.jpg'
                    media='(min-width: 540px)'
                  />
                  <img src='/img/all-ad/300x300_ad_2.jpg' alt='' width='100%' />
                </picture>
              </a>
            </div>
            <div className='carousel-item'>
              <picture className='d-block w-100'>
                <source
                  srcSet='/img/all-ad/1200x300_ad_3.jpg'
                  media='(min-width: 768px)'
                />
                <source
                  srcSet='/img/all-ad/800x300_ad_3.jpg'
                  media='(min-width: 540px)'
                />
                <img src='/img/all-ad/300x300_ad_3.jpg' alt='' width='100%' />
              </picture>
            </div> */}
            </div>
            <button
              className='carousel-control-prev'
              type='button'
              data-bs-target='#carouselInterval'
              data-bs-slide='prev'
            >
              <span
                className='carousel-control-prev-icon'
                aria-hidden='true'
              ></span>
              <span className='visually-hidden'>Previous</span>
            </button>
            <button
              className='carousel-control-next'
              type='button'
              data-bs-target='#carouselInterval'
              data-bs-slide='next'
            >
              <span
                className='carousel-control-next-icon'
                aria-hidden='true'
              ></span>
              <span className='visually-hidden'>Next</span>
            </button>
          </div>
        </div>
        <div className={`${styles.registerBlock} d-md-none m-bg-purple`}>
          <div className={`${styles.registerText}`}>
            <span>初來書營 ?</span>
            <span>加入會員立刻送禮券 !</span>
          </div>
          <button
            type='button'
            className='rounded-pill text-m-purple fw-bold px-4 py-2 bg-white'
          >
            立即加入
          </button>
        </div>
        <div className='d-flex my-3'>
          {/* top10廣告 */}
          <div className='col-6 col-md-4 col-xl-4'>
            <div
              className={`${styles.BottomAd} truncatedCorner-purple me-2 me-md-0`}
            >
              <a className='d-flex text-white h-100' href='#'>
                <div
                  className={`${styles.topText} col col-xl-5 ps-5 pe-5 pe-xl-0`}
                >
                  <h5 className='fw-bold mb-2'>
                    <div className='pixel-font font-l me-2'>TOP10</div>
                    <span className='text-center'>十大必讀精選</span>
                  </h5>
                  <p className='d-none d-md-block'>
                    「十大必讀精選」是一份包含了最值得閱讀的十本書籍清單，提供了精心挑選的內容
                    ....
                  </p>
                </div>
                <div className='d-none d-xl-block col-xl-7'>
                  <img
                    className={`${styles.top10Img} pt-4`}
                    src='/img/test/戀愛使用說明書1.png'
                  />
                </div>
              </a>
            </div>
          </div>
          {/* 熱搜廣告 */}
          <div
            className={`${styles.BottomAd} ${styles.hotAd} col-6 col-md-4 col-xl-3`}
          >
            <div
              className={`${styles.registerBlock} d-none d-md-flex flex-xl-row m-bg-purple`}
            >
              <div
                className={`${styles.registerText} flex-xl-column mb-2 mb-xl-0`}
              >
                <span className='d-none d-xl-flex'>初來書營 ?</span>
                <span className='ms-2 ms-xl-0'>加入會員立刻送禮券 !</span>
              </div>
              <Link
                href="/member/login"
                className='rounded-pill text-m-white fw-bold px-4 py-2'
              >
                立即加入
              </Link>
            </div>
            <Link className='mt-0 mt-md-3 h-100' href='/newbook?b_genre_id=1'>
              <div className={`${styles.wellBook} px-5 px-md-3 px-xl-5`}>
                <h5 className='d-flex flex-column flex-md-row'>
                  <i className='fa-solid fa-crown'></i>
                  <span className='fw-bold m-0 mt-2 mt-md-0 mb-md-2 ms-md-2'>
                    最新熱搜排行
                  </span>
                </h5>
                <p className='d-none d-md-block'>
                  帶您探索當下最受矚目的書籍，了解讀者間熱切討論的新作品和閱讀趨勢。
                </p>
              </div>
            </Link>
          </div>
          {/* 隨機廣告 */}
          <div
            className={`${styles.BottomAd} col-md-4 col-xl-3 d-none d-md-block px-0`}
          >
            <Link href={`newbook/${low}`}>
              <div className={styles.ad3}></div>
            </Link>
          </div>
          {/* 找書連結 */}
          <div className='d-none d-xl-block col-xl-2 position-relative'>
            <Link className={styles.searchBook} href={`newbook/${book}`}>
              <img src='img/test/openbook.png' />
              <div className={`${styles.searchBookText} fw-bold`}>找好書?</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
