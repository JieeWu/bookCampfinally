import React, { useState, useEffect } from 'react'
import FrontPageAd from '@/components/front/frontpage-ad'
import FrontPageActivity from '@/components/front/frontpage-activity-area'
import HotList from '@/components/front/frontpage-hotList'
import FrontPageLanguageTw from '@/components/front/frontpage-language-tw'
import FrontPageLanguageEn from '@/components/front/frontpage-language-en'
import FrontUesdBook from '@/components/front/frontpage-usedbook'
import FrontPageMessage from '@/components/front/frontpage-message'
import FloatCoupon from '@/components/member/coupon/float-coupon'
import axios from 'axios'
export default function Home() {
  const [twCategory, setTwCategory] = useState([])
  const [TW, setTW] = useState([])
  useEffect(() => {
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/share/TWlanguage')
          .then((res) => {
            setTW(res.data.TWbook)
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
  //抓取分類資料
  useEffect(() => {
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/share/TWlanguage/bookCategory')
          .then((res) => {
            setTwCategory(res.data)
          })
      } catch (error) {
        console.log(error)
      }
    }
    data()
  }, [])
  const twCategoryData = async (e) => {
    await axios
      .post('http://localhost:3002/share/TWlanguage/bookCategory', [
        e.target.id,
      ])
      .then((res) => {
        const [data] = res.data
        setTW(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  //中
  ////////////////////////////
  //英
  //有時間再把兩隻程式碼合併
  const [enCategory, setEnCategory] = useState([])
  const [EN, setEN] = useState([])
  useEffect(() => {
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/share/ENlanguage')
          .then((res) => {
            setEN(res.data.TWbook)
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
  //抓取分類資料
  useEffect(() => {
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/share/ENlanguage/bookCategory')
          .then((res) => {
            setEnCategory(res.data)
          })
      } catch (error) {
        console.log(error)
      }
    }
    data()
  }, [])
  const enCategoryData = async (e) => {
    console.log(11)
    await axios
      .post('http://localhost:3002/share/ENlanguage/bookCategory', [
        e.target.id,
      ])
      .then((res) => {
        const [data] = res.data
        setEN(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <FrontPageAd />
      <FrontPageActivity />
      <HotList />
      <FrontPageLanguageTw
        category={twCategory}
        categoryData={twCategoryData}
        TW={TW}
      />
      <FrontPageLanguageEn
        category={enCategory}
        categoryData={enCategoryData}
        EN={EN}
      />
      {/* <FrontUesdBook />     */}
      {/* 這個二手書交易平台用不到了 我就先註解掉了 :) */}
      <FrontPageMessage />
      <FloatCoupon />
    </>
  )
}
