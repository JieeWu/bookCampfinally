import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import RenderDatabaseContent from './inner'
import { useAuthJWT } from '../../hooks/use-auth-jwt'
import styles from './post-page.module.css'

export default function ForumPostContent(props) {
  const avatarUrl = 'http://localhost:3002/img/member/'
  const { authJWT, setAuthJWT } = useAuthJWT()
  const router = useRouter()
  const [hidden, setHidden] = useState('false')
  const [message, setMessage] = useState('')
  const [data, setData] = useState({
    id: 0,
    post_id: 0,
    content: '',
  })
  // Get inpurt context & post_id
  const getMessage = (e) => {
    setData({
      id: e.target.id,
      post_id: router.query.post_id,
      content: e.target.value,
    })
  }
  // 留言區 新增留言
  const submitMessage = async () => {
    await axios
      .post('http://localhost:3002/forum/reply/message2', [data], {
        withCredentials: true,
      })
      .then((res) => {
        setMessage(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const changePostReply = async (e) => {
    setHidden(!hidden)
    const postId = router.query.post_id
    await axios
      .post('http://localhost:3002/forum/reply/message', [postId])
      .then((res) => {
        const [data] = res.data
        setMessage(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  console.log('login')

  return (
    <>
      {/* 文章標題 */}
      <div className={`${styles.postHeader} mt-4 br-bg-purple`}>
        <div className='d-flex'>
          <h5 className='fw-bold'>
            <i className='fa-regular fa-comments me-2'></i>
            可以放主題?
          </h5>
          <span className='px-4'>討論名稱</span>
        </div>
        <div className='ms-auto'>
          <span className={`${styles.articleLike} c-bg-purple me-3`}>
            <i className='fa-solid fa-heart me-2'></i>20
          </span>
          <span className={`${styles.articleLike} c-bg-purple`}>
            <i className='fa-solid fa-heart-crack me-2'></i>-
          </span>
        </div>
      </div>
      {/* 文章內容 */}
      <div className={styles.textContent}>
        <p>
          {props.data.length > 0 && props.data[0].forum_content != '' ? (
            <RenderDatabaseContent
              htmlContent={props.data[props.id].forum_content}
            />
          ) : (
            '123'
          )}
        </p>
        {/* 彈出留言區塊 */}
        <div
          className={`${styles.messageBlock} ${
            hidden ? styles.messageBlockClose : styles.messageBlockOpen
          }`}
        >
          <button onClick={changePostReply}>
            {hidden ? (
              <div className={styles.openbtn}>
                <i className='fa-solid fa-caret-left'></i>
                留<br />言<i className='fa-solid fa-caret-left'></i>
              </div>
            ) : (
              <div className={styles.openbtn}>
                <i className='fa-solid fa-caret-right'></i>
                文<br />章<i className='fa-solid fa-caret-right'></i>
              </div>
            )}
          </button>
          <div className='d-flex flex-column w-100 me-4'>
            <div className='pt-3 px-3 overflow-auto w-100 h-100'>
              {message.length > 0 && message != '' ? (
                message.map((v, i) => {
                  return (
                    <>
                      <div key={i}>
                        {v.id === props.id + 1 ? (
                          <>
                            <div
                              className={`${styles.userMessageBlock} pixel-border-purple p-2`}
                            >
                              <div
                                className={`${styles.landlordAvatar} rounded-circle border border-white border-2`}
                              >
                                <img
                                  src={avatarUrl + `${message[i].avatar}`}
                                ></img>
                              </div>
                              <div className='ms-3'>
                                <div className='d-flex mb-1'>
                                  {v.client_id}
                                  <sapn className='px-2'>{v.client_name}</sapn>
                                  <p>{v.forum_content}</p>
                                </div>
                                <div className='font-sm text-br-purple'>
                                  {v.forum_create_time}目前沒抓到時間?
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </>
                  )
                })
              ) : (
                <div className='d-flex justify-content-center align-items-center w-100 h-100 text-white-50'>
                  尚未有留言內容<i className='fa-regular fa-comment ms-2'></i>
                </div>
              )}
            </div>
            {/* 留言輸入區塊 */}
            <div className={`${styles.messageInputBlock}`}>
              <div
                className={`${styles.landlordAvatar} rounded-circle border border-white border-2`}
              >
                <img src={avatarUrl + `${authJWT.userData.avatar}`}></img>
              </div>
              {/* 留言輸入的地方 */}
              <input
                className='m-3 px-3'
                placeholder='留言'
                id={props.id + 1}
                onChange={getMessage}
              />
              <button
                className='main-btn pixel-border-yellow'
                onClick={submitMessage}
              >
                送出
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <style jsx>
        {`
          .forum-post-header {
            display: grid;
            grid-template-columns: 2fr 2fr;
            height: 80.81px;
            background: #7817f3;
            box-shadow:
              5px 0 0 0 black,
              -5px 0 0 0 black,
              0 5px 0 0 black,
              0 -5px 0 0 black;
          }
          .forum-post-content {
            max-height: 500px;
            min-height: 500px;

            background-size: 51% 100%;
            background-repeat: no-repeat;
            display: grid;
          }
          .forum-post-content-reply {
          }
          .forum-post-content-text {
            padding-left: 50px;
            padding-top: 50px;
            padding-right: 50px;
            max-height: 500px;
            overflow: auto;
          }
          .message-bg {
            background: #512893;
          }
          .message-avatar {
          }
          .avatar-img {
            border-radius: 50%;
            background: white;
          }
          .post-avatar {
            max-width: 70px;
            min-height: 70px;
            border-radius: 50%;
            background-size: cover;
          }
          .reply-bg {
            background: #9b6cff;
            position: absolute;
            bottom: 0;
          }
          .test-bg {
            position: relative;
          }
        `}
      </style> */}
    </>
  )
}
