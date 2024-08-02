import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './front-page-hotlist.module.css'
import FrontTitle from '@/components/share/front-title'
// import CarouselBook from '@/components/decorate/carousel-book'
import CommodityPageBig from '@/components/share/commodity/commodity-page-big'

export default function HotList() {
  const pageSpacing = {
    marginTop: '20vh',
  }
  // 熱銷榜的書
  const [hotList, setHotList] = useState([])
  console.log(hotList)
  // 抓到資料
  useEffect(() => {
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/share/hotList')
          .then((res) => {
            console.log(res.data.hot)
            setHotList(res.data.hot)
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
    }
    data()
  }, [])

  return (
    <>
      <div className='row flex-column flex-xl-row' style={pageSpacing}>
        {/* 頁面標題 */}
        <div className='col-12 mb-5'>
          <FrontTitle title='熱銷榜' icon='fa-solid fa-ranking-star me-2' />
        </div>
        <div className={`${styles.side} col-1 m-bg-purple boder-pixel`}>
          <div className='d-flex flex-column'>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white'></div>
          </div>
          <div className='d-flex flex-column mt-auto'>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white'></div>
          </div>
        </div>
        <div className='col-12 col-xl-10 px-0'>
          <div className={`${styles.hotBlock} d-bg-purple`}>
            {hotList.map((item) => {
              return (
                <div key={item.book_id}>
                  <CommodityPageBig
                    item={item}
                    book_id={item.book_id}
                    total_count={item.total_count}
                    blurb={item.blurb}
                    book_price={item.book_price}
                    book_img_id={item.book_img_id}
                    b_title={item.b_title}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div className={`${styles.side} col-1 m-bg-purple boder-pixel`}>
          <div className='d-flex flex-column'>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white'></div>
          </div>
          <div className='d-flex flex-column mt-auto'>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white mb-2'></div>
            <div className='shape4 bg-white'></div>
          </div>
        </div>
      </div>
    </>
  )
}
