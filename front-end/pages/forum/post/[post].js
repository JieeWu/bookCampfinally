import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import CkeditorButton from '@/components/forum/ckeditor-button'
import ForumBreadcrumb from '@/components/forum/forum-breadcrumb'
import { useRouter } from 'next/router'
import axios from 'axios'
import MyEditor from '@/components/forum/MyEditor'
const TextEditorWithNoSSR = dynamic(
  () => import('@/components/forum/ckeditor'),
  {
    ssr: false,
  },
)
export default function Test() {
  const router = useRouter()

  const [status, setStatus] = useState('')
  const [data, setData] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState('')
  const [question2, setQuestion2] = useState('')
  const [editData, setEditData] = useState('')
  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }
  const onChangeQuestion = (e) => {
    // setQuestion(e.target.value)
    const selectedOption = e.target.options[e.target.selectedIndex]
    const selectedCategoryId = selectedOption.getAttribute('data')

    setQuestion(selectedCategoryId)
  }
  const onChangeQuestion2 = (e) => {
    setQuestion2(e.target.value)
  }
  const onChangeContent = (v) => {
    setContent(v)
  }
  useEffect(() => {
    const { post, status } = router.query
    setStatus({ post, status })
    setData({
      title: title,
      content: content,
      question: question,
      question2: question2,
      forum_id: post,
      status: status,
    })
  }, [title, content, question, question2])
  useEffect(() => {
    if (router.query.status === 'edit') {
      const getForum = async () => {
        await axios
          .post('http://localhost:3002/forum/getEdit', [router.query.post], {
            withCredentials: true,
          })
          .then((res) => {
            // console.log('getData', res.data)
            setTitle(res.data.forum_title)
            setContent(res.data.forum_content)
            setQuestion(res.data.forum_category_id)
            setData({
              title: res.data.forum_title,
              content: res.data.forum_content,
              question: question,
              forum_id: res.data.forum_id,
              status: status.status,
            })
          })
          .catch((error) => console.log(error))
      }
      getForum()
    }
  }, [router.query.status])
  return (
    <>
      <div className='container'>
        {/* 導覽 */}
        <ForumBreadcrumb />
        <div className='row'>
          <div className='col-10 '>
            {/* wandEditor*/}
            <TextEditorWithNoSSR
              router={router}
              setTitle={setTitle}
              title={title}
              data={data}
              onChangeQuestion={onChangeQuestion}
              onChangeQuestion2={onChangeQuestion2}
              onChangeTitle={onChangeTitle}
              editData={editData}
            />
            <MyEditor
              onChangeContent={onChangeContent}
              data={data}
              router={router}
            />
          </div>
          <div className='col-2'>
            <CkeditorButton data={data} />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .post-background {
            background: #0e0e32;
            min-height: 564px;
            color: white;
          }
        `}
      </style>
    </>
  )
}
