import React, { useState, useEffect, useContext, useRef } from 'react'
import Header from '@/components/forum/header'
import Navbar from '@/components/forum/navbar'
import ForumBreadcrumb from '@/components/forum/forum-breadcrumb'
import AvatarData from '@/components/forum/avatar-data'
import ForumReplytContent from '@/components/forum/forum-reply-content'
import ForumReplyButton from '@/components/forum/forum-reply-button'
import axios from 'axios'
import { useRouter } from 'next/router'
import styles from '@/components/forum/post-page.module.css'
import Link from 'next/link'
export default function Reply() {
  const [data, setData] = useState('')
  const [avatar, setAvatar] = useState('')
  const router = useRouter()
  const messageAreaRef = useRef(null)
  const [chat, setChat] = useState([])
  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }
  // ref={messageAreaRef}

  useEffect(() => {
    scrollToBottom() // 確保在新增訊息後捲動到最底部
  }, [chat])
  useEffect(() => {
    const getAvatar = async () => {
      try {
        const { post_id, status } = router.query

        if (!post_id) {
          return ''
        }
        const result = await axios.get(
          `http://localhost:3002/forum/post/${post_id}?status=${status}`,
        )

        // console.log(result);
        const [firstData] = result.data.rows
        console.log('first', firstData)
        const newData = [firstData, ...result.data.replyData]
        // token
        console.log(result.data)
        setAvatar(result.data.data)
        console.log('result', result)
        //原發佈者
        console.log()
        setData(newData)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    getAvatar()
  }, [router.query])
  useEffect(() => {
    console.log('111', data)
  }, [data])
  return (
    <>
      <div className=''>
        <div className='container'>
          <ForumBreadcrumb />
          <div className='row'>
            <div>
              {data.length > 0 && data != ''
                ? data.map((v, i) => {
                    return (
                      <>
                        <div key={i}>
                          <AvatarData
                            id={i}
                            postId={data[i].id}
                            data={data}
                            avatar={avatar}
                          />
                          <div className='d-flex'>
                            <div className='col-10'>
                              <div className='pe-3'>
                                <ForumReplytContent id={i} data={data} />
                                <ForumReplyButton />
                              </div>
                            </div>
                            <div className='col-2'>
                              <div className={styles.postPageAd}>
                                {/* <img src='http://localhost:3002/public/img/ad/200x600_ad_3.jpg' /> */}
                                <img src='/img/all-ad/200x600_ad_5.jpg' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  })
                : ''}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{``}</style>
    </>
  )
}
