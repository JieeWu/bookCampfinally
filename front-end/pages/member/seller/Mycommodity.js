import React, { useState, useEffect } from 'react'
import Put from '@/components/oldbook/Mycommodity/put'
import Manage from '@/components/oldbook/Mycommodity/manage'
import OldbookSide from '@/components/oldbook/oldbook-side'
import Link from 'next/link'
import axios from 'axios'
import ChatApp from '@/components/cbot/chat-app'

export default function Mycommodity() {
  const [searchTerm, setSearchTerm] = useState('')
  const [bookData, setBookData] = useState([])
  const [filterCondition, setFilterCondition] = useState('全部商品');
  const [showBot, toggleBot] = useState(false);

  
  let filteredBooks = bookData;
if (filterCondition === '上架的商品') {
  filteredBooks = bookData.filter(book => book.book_status_id === 1); 
} else if (filterCondition === '下架的商品') {
  filteredBooks = bookData.filter(book => book.book_status_id  == 2); 
}

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/search', {
          params: { term: '' }, // 空關鍵字表示搜尋所有資料
          withCredentials: true,
        })
        setBookData(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchAllData() // 在進入頁面時執行一次搜尋，顯示所有資料
  }, [])

  //搜尋
  const handleSearch = async () => {
    try {
      const reponse = await axios.get('http://localhost:3002/search', {
        params: { term: searchTerm },
        withCredentials: true,
      })
      setBookData(reponse.data)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
    {/* <button>
    <ChatApp/>
    </button> */}
   
   <button onClick={() => toggleBot((prev) => !prev)}>
        打開聊天機器人
      </button>
      <ChatApp showBot={showBot} toggleBot={toggleBot} />
      

      <div className='row gx-5'>
        <div className='col-2 d-none d-md-flex px-0'>
          <OldbookSide />
        </div>
        {/*分隔 */}
        {/*中間 */}
        <div className='col-12 col-md-10 col-xl-8'>
          <div className='mb-5'>
            <div>
            <Put setFilterCondition={setFilterCondition} />
              <div className='p-4 rounded-2 shadow-sm operatemenu mb-4'>
                <div className='input-container search-frame9'>
                  <input
                    type='text'
                    placeholder='關鍵字搜尋商品'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: 20 }}
                  />
                  <button type='submit' onClick={handleSearch}>
                    搜尋
                  </button>
                </div>
                <Link href='./add_product'>新增商品</Link>
                <div className='container'>
                  <div className='row Management2 Mana3'>
                    <div className='col-4'>商品</div>
                    <div className='col-1'>金額</div>
                    <div className='col-1'>狀態</div>
                    <div className='col-2'>上架時間</div>
                    <div className='col-2'>數量</div>
                    <div className='col-2'>操作</div>
                  </div>
                  <Manage books={filteredBooks} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
