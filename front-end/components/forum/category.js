import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import styles from '@/components/forum/forum.module.css'
export default function Category(props) {
  const [Data3, setData3] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3002/forum/select/category',
        )
        console.log(response)
        const data = response.data
        setData3(data.rows)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  console.log(Data3)
  const categoryData = async (pid) => {
    // 將pid參數進行URL編碼（URL encoding），這樣特殊字符會被轉換為URL安全的形式。
    pid = encodeURIComponent(pid)
    const res = await axios.get(
      `http://localhost:3002/forum/select/category/${pid}`,
    )
    console.log('select', pid)
    const data = res.data.rows
    props.setPost(data)
  }
  return (
    <>
      <div className='row row-cols-3 mt-3 mb-1'>
        {Data3.map((v, i) => (
          <div className={`${styles.categoryBtn} col`}>
            <button
              key={i}
              onClick={() => {
                categoryData(v.forum_Cname)
              }}
            >
              {v.forum_Cname}
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .category-btn {
          height: 47px;
          background: var(--colorful-purple, #9a4aff);
          box-shadow: -3px -3px 0px 0px rgba(0, 0, 0, 0.3) inset;
          color: white;
        }
      `}</style>
    </>
  )
}
