import React, { useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import styles from './post-edit.module.css'
export default function CkeditorButton(props) {
  const router = useRouter()
  const data = JSON.stringify(props.data)
  console.log('json', data)
  console.log('this is data ', props.data)
  // console.log([data])
  // 新增貼文
  const insertPost = async () => {
    await axios
      .post('http://localhost:3002/forum/api/insertData', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === 'pass') {
          Swal.fire({
            icon: 'success',
            title: '新增了一則文章！',
          }).then((result) => {
            if (result.isConfirmed) {
              router.push('/') //
            }
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  //編輯貼文
  const editPost = async () => {
    await axios
      .put('http://localhost:3002/forum/putEdit', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res)
        // if (res.data === 'pass') {
        //   Swal.fire({
        //     icon: 'success',
        //     title: '新增了一則文章！',
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       router.push('/') //
        //     }
        //   })
        // }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <div className='d-flex flex-column justify-content-between h-100'>
        <button
          className={`${styles.postPageBtn} d-bg-pink`}
          onClick={insertPost}
        >
          <i className='fa-solid fa-image font-xl mb-3'></i>插入圖片
        </button>
        <button
          className={`${styles.postPageBtn} br-bg-pink`}
          onClick={insertPost}
        >
          <i className='fa-solid fa-film font-xl mb-3'></i>插入影音
        </button>
        <button
          className={`${styles.postPageBtn} d-bg-pink`}
          onClick={insertPost}
        >
          <i className='fa-solid fa-note-sticky font-xl mb-3'></i>插入貼圖
        </button>
        {router.query.status === 'add' ? (
          <>
            <button
              className={`${styles.subnitBtn} pixel-border-yellow`}
              onClick={insertPost}
            >
              送出<i className="fa-solid fa-paper-plane ms-2"></i>
            </button>
          </>
        ) : router.query.status === 'edit' ? (
          <>
            <button
              className={`${styles.subnitBtn} pixel-border-yellow`}
              onClick={editPost}
            >
              編輯<i className="fa-solid fa-file-pen ms-2"></i>
            </button>
          </>
        ) : (
          <>''</>
        )}
      </div>
      <style jsx>
        {`
          .button3 {
            width: 100%;
            height: 143px;
            background: #ff7269;
            border: 0px;
            box-shadow:
              -5px 0 0 #ff7269,
              10px -5px 0 #ff7269,
              5px -10px 0 #ff7269,
              0 5px 0 #ff7269,
              3px -3px 0 2px #ff7269,
              18px 0 0 #b3b3b3,
              5px 10px 0 #b3b3b3,
              10px 3px 0 2px#B3B3B3,
              5px 8px 0 0px #b3b3b3;
          }
          .button4 {
            width: 100%;
            height: 143px;
            background: #ff93c7;
            border: 0px;
            box-shadow:
              -5px 0 0 #ff93c7,
              10px -5px 0 #ff93c7,
              5px -10px 0 #ff93c7,
              0 5px 0 #ff93c7,
              3px -3px 0 2px #ff93c7,
              18px 0 0 #b3b3b3,
              5px 10px 0 #b3b3b3,
              10px 3px 0 2px#B3B3B3,
              5px 8px 0 0px #b3b3b3;
          }
          .submitBtn {
            width: 100%;
            height: 143px;
            margin: 15px;
            background: var(--main-yellow);
            padding: 3px 20px;
            box-shadow:
              0 0 0 1px var(--main-yellow),
              0 5px 0 -1px var(--main-yellow),
              4px 0 0 -1px var(--main-yellow),
              0 0 0 1px var(--main-yellow),
              0 -5px 0 -1px var(--main-yellow),
              -4px 0 0 -1px var(--main-yellow),
              0 0 0 3px var(--black),
              0 6px 0 0 var(--black),
              0 -6px 0 0 var(--black),
              5px 0 0 0 var(--black),
              -5px 0 0 0 var(--black);
          }
        `}
      </style>
    </>
  )
}
