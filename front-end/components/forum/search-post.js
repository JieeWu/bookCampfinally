import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from '@/components/forum/forum.module.css'

export default function SearchPost() {
  const [search, setSearch] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3002/forum/select/search')
        const [data] = res.data
        // 如果有相同的名稱，只要出現一個
        const unique = [
          ...new Set(
            data.map((v) => {
              // 同時取出title跟content
              return v.title, v.content
            }),
          ),
        ]
        console.log(unique)
        setSearch(unique)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  const searchBtn = () => {
    const searchInput = document.querySelector('.search-post').value
    // 按下ENTER一樣會搜尋
    if (searchInput !== '') {
      window.location.href = `http://localhost:3000/forum/${searchInput}`
    }
  }
  return (
    <>
      <div className={styles.forumInput}>
        <input list='name' placeholder='搜尋內容'></input>
        <datalist id='name'>
          {search.map((v, i) => {
            return <option key={i}>{v}</option>
          })}
          <option>Ann Hathaway</option>
        </datalist>
        <button className={styles.searchBtn} onClick={searchBtn}>
          找 !
        </button>
      </div>
      <style jsx>
        {`
          .contest {
            filter: drop-shadow(10px 6px 0px #72ccff);
          }
          .test {
            width: 417.5px;
            height: 92px;
            flex-shrink: 0;
            background: #321a66;
            fill: #321a66;
            stroke-width: 3px;
            stroke: #c071ff;
            box-shadow: -12px -10px 0px 0px #b86cf4 inset;
            clip-path: polygon(
              20px 0,
              100% 0,
              100% calc(100% - 20px),
              calc(100% - 20px) 100%,
              0 100%,
              0 20px
            );
          }
          .search-post {
            width: 300px;
            height: 47px;
            border-radius: 10px;
            padding-left: 20px;
          }
          .search-button {
            width: 63px;
            height: 47px;
            border-radius: 10px;
            background: var(--orange, #f90);
            /* in_shadow */
            box-shadow: -7px -7px 0px 0px rgba(0, 0, 0, 0.3) inset;
          }
           {
            /* .rectangle {
            position: relative;
            width: 417.5px;
            height: 92px;
            background: #b86cf4;
            clip-path: polygon(
              30px 5%,
              100% 5%,
              100% calc(100% - 20px),
              calc(100% - 20px) 100%,
              5px 100%,
              5px 30px
            );
          }
          .rectangle::after {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background: #321a66;
            z-index: -1;
            clip-path: polygon(
              20px 0,
              100% 0,
              100% calc(100% - 20px),
              calc(100% - 20px) 100%,
              0 100%,
              0 20px
            );
          } */
          }
        `}
      </style>
    </>
  )
}
