import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './post-page.module.css'
export default function ForumReplyButton() {
  const SelectRef = useRef(null)
  const router = useRouter()
  const pid = router.query.post_id
  const handleMouseOver = () => {
    if (SelectRef.current) {
      SelectRef.current.style.display = 'block'
    }
  }

  const handleMouseOut = () => {
    if (SelectRef.current) {
      SelectRef.current.style.display = 'none'
    }
  }

  return (
    <>
      <div className={styles.messageOperateBlock}>
        <div className={styles.likeBtn}>
          <button className='pixel-border-yellow'>
            <i className='fa-solid fa-heart font-l'></i>
          </button>
          <button className='pixel-border-yellow'>
            <i className='fa-solid fa-heart-crack font-l'></i>
          </button>
        </div>
        <button className={`${styles.replyBtn} pixel-border-yellow`}>
          <span className='text-black'>
            我要回覆<i className='fa-solid fa-comment-dots ms-2'></i>
          </span>
          <span>
            立即回覆<i className='fa-solid fa-comment-dots ms-2'></i>
          </span>
        </button>
        <div
          className={`${styles.moreFunctionBtn} pixel-border-yellow`}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          更多選項
          <i className='fa-solid fa-ellipsis-vertical ms-3'></i>
          <div className={styles.customSelect}>
            <div className={styles.selectOptions} ref={SelectRef}>
              <div className='button-area'>
                <Link href={`/forum`}>
                  <span className='btn button-style mb-3'>收藏文章</span>
                </Link>
                <Link href={`/forum/post/${pid}?status=edit`}>
                  <span className='btn button-style mb-3'>編輯文章</span>
                </Link>
                <Link href={`/forum`}>
                  <span className='btn button-style mb-3'>收藏文章</span>
                </Link>
                <Link href={`/forum`}>
                  <span className='btn button-style mb-3'>收藏文章</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .button-style {
            color: black;
            width: 120px;
            background: var(--main-yellow);
            box-shadow:
              0 3px 0 #ffa81d,
              3px 0 0 #ffa81d,
              0 -3px 0 var(--main-yellow),
              -3px 0 0 var(--main-yellow),
              0 -6px 0 var(--black),
              0 6px 0 var(--black),
              -6px 0 0 var(--black),
              6px 0 0 var(--black),
              0 0 0 3px var(--black);
          }

          .button-style:hover {
            background-color: var(--main-orange);
          }

          span {
            color: white;
          }

          .button-area {
            width: 100px;
            min-height: 260px;
          }
          .custom-select {
            position: relative;
            display: inline-block;
          }

          .custom-select .select-options {
            display: none;
            position: absolute;
            top: -250px;
            right: -15px;
            z-index: 9999;
          }

          .forum-reply {
            height: 90px;
            background: orange;
            box-shadow:
              0 5px 0 0 #ab5c00,
              0 -5px 0 0 orange,
              5px 0px 0 0 #ab5c00,
              -5px 0px 0 0 orange,
              0 0 0 5px yellow,
              0 0 0 10px black; /* 添加陰影效果到父 div */
            position: relative; /* 添加 position 屬性 */
            display: grid;
            grid-template-columns: 0.5fr 0.5fr 2.5fr 0.5fr;
            flex-wrap: wrap;
          }
          .forum-reply-button {
            margin-left: 20px;
            margin-right: 30px;
            height: 50px;
            background: yellow;
            box-shadow:
              10px 0 0 0 yellow,
              -10px 0 0 0 yellow,
              0px 10px 0 0 yellow,
              0px -10px 0 0 yellow,
              0 0 0 5px yellow,
              0 0 0 10px black,
              15px 0 0 0px black,
              15px 5px 0 0px black,
              15px -5px 0 0px black,
              -15px -5px 0 0px black,
              -15px 5px 0 0px black,
              -5px 15px 0 0px black,
              5px 15px 0 0px black,
              5px -15px 0 0px black,
              -5px -15px 0 0px black;
          }
          .button4 {
            max-width: 400px;
            margin-left: 50px;
            margin-right: 50px;
            margin-top: 10px;
            height: 40px;
            background: #9b6cff;
            /* #6b4cb3*/
            box-shadow:
              10px -10px 0 0 #9b6cff,
              0px -10px 0 0 #9b6cff,
              0px -15px 0 0 black,
              -5px -10px 0 0 black,
              15px 0px 0 0 #6b4cb3,
              15px -10px 0 0 #6b4cb3,
              20px -10px 0 0 black,
              15px -15px 0 0 black,
              0px 5px 0 0 #6b4cb3,
              -5px 5px 0 0 black,
              15px 5px 0 0 #6b4cb3,
              20px 5px 0 0 black,
              0px 10px 0 0 black,
              15px 10px 0 0 black;
          }
        `}
      </style>
    </>
  )
}
