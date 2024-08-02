import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChatApp from '@/components/cbot/chat-app'
import axios from 'axios'
import Link from 'next/link'
export default function Manage(props) {
  //存書籍
  const [bookData, setbookData] = useState([])
  //存上下架
  const [oldstate, setState] = useState([])

  const [bookDataFromParent, setBookDataFromParent] = useState(props.books)

  //會員資料
  const [client, setClient] = useState([])
  //幾筆
  // const [oldbookCount, setOldbookCount] = useState([])

  //路由參數
  useEffect(() => {
    const fetchstoreDate = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/oldmanageRouter/my-store`,
          { withCredentials: true },
        )
        setClient(res.data.client)
        setbookData(res.data.oldbook)
        setState(res.data.bookstatus)
        console.log(res)

        // setOldbookCount(res.data.oldbookCount)
      } catch (err) {
        console.log(err)
      }
    }
    fetchstoreDate()
  }, [])
  useEffect(() => {
    setBookDataFromParent(props.books)
  }, [props.books])
  return (
    <>
      {bookDataFromParent.map((v, i) => (
        <div className='row Management3' key={i}>
          <div className='col-4 '>
            <img
              src={`http://localhost:3002/public/img/oldbookimgs/${v.book_img_id}`}
              alt='123'
              width='100px'
              className='orwd'
            />
            <div className='book orwd '>{v.b_title}</div>
          </div>
          <img
            className='orwd1'
            src={`http://localhost:3002/public/img/oldbookimgs/${v.book_img_id}`}
            alt='123'
            width='10px'
          />
          <div className='book col-12 orwd1 col-md-1 orwd1 odk3'>
            {v.b_title}
          </div>
          <div className='col-md-1 col-12 price1 '>{v.book_price}</div>
          <div className='col-md-1 col-12 state3 orwd'>
            {oldstate[v.book_status_id - 1]?.book_status_name}
          </div>
          <div className='col-md-2 col-12 time3 orwd'>{v.sherlf_date}</div>
          <div className='col-md-2 col-12 count3'>{v.book_quantity}</div>
          <div className='col-md-1 col-12 state3 orwd1 '>
            {oldstate[v.book_status_id - 1]?.book_status_name}
          </div>
          <div className='col-md-2 col-12 time3 orwd1 '>{v.sherlf_date}</div>

          <div className='col-md-2 col-12 bot5'>
            <Link className='Lookorder' href={`/editproduct/${v.book_id}`}>
              編輯
            </Link>
            <a className='Lookorder' href=''>
              刪除
            </a>
          </div>
        </div>
      ))}

      {/* <ChatApp /> */}
      {/* <div className=' Management3'>
       <img src='/img/oldbookimgs/01.jpg' alt='123' width='100px' />
        <div className='book'>
            被討厭的勇氣被討厭的勇氣 被討厭的勇氣被討厭的勇氣
          </div>
      
        <div className='orwd1'>價錢</div>
        <div className='oprice1'>100</div>
        <div className='oprice3'>上架中</div>
        <div className='oprice'>87</div>
        <div className='obut'>
          <a className='Lookorder' href=''>
            編輯
          </a>
          <a className='Lookorder' href=''>
            刪除
          </a>
        </div>
      </div> */}

      {/* <div className='row Management3'>
        <div className='col-4 '>
          <img src='/img/oldbookimgs/01.jpg' alt='123' width='100px' className='orwd' />
          <div className='book orwd '>
            被討厭的勇氣
          </div>
        </div>
        <img className='orwd1' src='/img/oldbookimgs/01.jpg' alt='123' width='10px'  />
        <div className='book col-12 orwd1 col-md-1 orwd1 odk3'>被討厭的勇氣</div>
        <div className='col-md-1 col-12 price1 '>100</div>
        <div className='col-md-1 col-12 state3 orwd'>上架中</div>
        <div className='col-md-2 col-12 time3 orwd'>2023-07-17</div>
        <div className='col-md-2 col-12 count3'>1</div>
        <div className='col-md-1 col-12 state3 orwd1 '>上架中</div>
        <div className='col-md-2 col-12 time3 orwd1 '>2023-07-17</div>

        
        <div className='col-md-2 col-12 bot5'>
          <a className='Lookorder' href=''>
            編輯
          </a>
          <a className='Lookorder' href=''>
            刪除
          </a>
        </div>
      </div> */}
    </>
  )
}
