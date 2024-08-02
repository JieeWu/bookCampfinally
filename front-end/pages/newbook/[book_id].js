import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import CollectButton2 from '@/components/oldbook/CollectButton2'
import { CartContext } from '@/hooks/cartContext'
import styles from '@/styles/oldbook/oldbooklist.module.css'

export default function BookDetail() {
  //二手書資料
  const [bookData, setBookData] = useState([])

  //會員資料
  const [clientData, setClientData] = useState([])

  //分類資料
  const [genre, setGenre] = useState([])
  //使用多久資料
  const [usage, setUsage] = useState([])
  //新書還是二手書資料
  const [type, setType] = useState([])

  const router = useRouter()
  //用status來保存要顯示的頁面
  const [oldbooklist, setOldbooklist] = useState('pay')

  // 路由參數
  const { book_id } = router.query

  // 加入購物車按鈕
  const handleAddCart = (e) => {
    try {
      axios
        .post('http://localhost:3002/share/addcart/add', e, {
          withCredentials: true,
        })
        .then((res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '加入購物車',
            timer: 1500,
          })
          setCartItem(res.data.newcart)
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }
  // 購物車狀態
  const { setCartItem } = useContext(CartContext)

  useEffect(() => {
    // 確保 book_id 存在
    if (book_id) {
      const fetchBookData = async () => {
        try {
          const res = await axios.get(
            //這段是裡面有賣這本書的會員資料和書的資料...
            `http://localhost:3002/oldbook/${book_id}`,
          )
          //時間格式化
          if (res.data && res.data.obData && Array.isArray(res.data.obData)) {
            res.data.obData.forEach((book) => {
              if (book.sherlf_date) {
                book.sherlf_date = dayjs(book.sherlf_date).format('YYYY-MM-DD')
              }
              if (book.revise_date) {
                book.revise_date = dayjs(book.revise_date).format('YYYY-MM-DD')
              }
            })
          }
          setGenre(res.data.obgenre[0])
          setUsage(res.data.usagename[0])
          setClientData(res.data.obseller[0])
          setBookData(res.data.obData[0])
          setType(res.data.booktype[0])
        } catch (error) {
          console.error('Error fetching book data:', error)
        }
      }

      fetchBookData()
    }
  }, [book_id])
  // 依賴 book_id, 當 book_id 變動時重新執行

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>

          </div>
          <div className='col-8 col-xl-7'>
            <div className=' rounded-2 shadow-sm d-flex flex-column '>
              <div>
                <ul className={styles.oldlist}>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setOldbooklist('pay')
                      }}
                    >
                      購買
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setOldbooklist('b')
                      }}
                    >
                      書籍介紹
                    </button>
                  </li>
                </ul>
              </div>
              <div className={styles.oldbookname3}>
                <div className={styles.imagecontainer1}>
                  <img
                    src={`http://localhost:3002/public/img/oldbookimgs/${bookData.book_img_id}`}
                    // src={`http://localhost:3002/public/img/Rectangle213.png`}
                  />
                </div>
              </div>

              <div className={`rounded-2 shadow-sm ${styles.oldbookimg}`}>
                {/*顯示購買的地方 */}
                {oldbooklist === 'pay' && (
                  <div className={styles.oldbookmain}>
                    <div className={styles.a1}>
                      <h4 className={styles.oldbookname}>{bookData.b_title}</h4>
                      <CollectButton2  oldBookId={bookData.book_id} />
                    </div>
                    <div className={styles.a2}>
                      {/* <div className='odbkcontent'>
<span className='odbkcontent1'>書籍類別</span>
&nbsp;&nbsp;&nbsp;{type.b_type_name}{' '}
</div> */}
                      <div className={styles.odbkcontent}>
                        <span className={styles.odbkcontent1}>價格</span>
                        &nbsp;&nbsp;&nbsp; {bookData.book_price}元
                      </div>
                      <div className={styles.odbkcontent}>
                        {' '}
                        <span className={styles.odbkcontent1}>分類</span>
                        &nbsp;&nbsp;&nbsp;{genre.b_genre_name}{' '}
                      </div>
                      <div className={styles.odbkcontent}>
                        <span className={styles.odbkcontent1}>語言</span>
                        &nbsp;&nbsp;&nbsp; {usage.b_language_name}{' '}
                      </div>
                      <div className={styles.odbkcontent}>
                        <span className={styles.odbkcontent1}>出版商</span>
                        &nbsp;&nbsp;&nbsp; {bookData.b_type_id}{' '}
                      </div>
                      <div className={styles.odbkcontent}>
                        <span className={styles.odbkcontent1}>運送方式</span>
                        &nbsp;&nbsp;&nbsp; 宅配/超商取貨{' '}
                      </div>
                    </div>

                    {/* <div className='a3'>
                      <button className='btn-addAndsub-item subButton'>
                        <i className='fa-solid fa-minus'></i>
                      </button>
                      <input type='text' className='input-box-all' readOnly />
                      <button className='btn-addAndsub-item addButton'>
                        <i className='fa-solid fa-plus'></i>
                      </button>
                    </div> */}
                    <div className={styles.a4}>
                      <h6 className={styles.odbkauthor} title={bookData.author}>
                        作者:
                        <br />
                        {bookData.author}
                      </h6>
                      <h6>
                        出版日期:
                        <br />
                        {bookData.sherlf_date}
                      </h6>
                      <h6>
                        ISBN碼:
                        <br />
                        {bookData.isbn}
                      </h6>
                      {/* <h6>
最後修改日期:
<br />
{bookData.revise_date}
</h6> */}
                    </div>
                    <div className={styles.a5}>
                      <button
                        type='button'
                        onClick={() => {
                          handleAddCart(bookData)
                        }}
                        className={styles.oldbookcar}
                      >
                        加入購物車
                      </button>
<i class="fa-regular fa-heart"></i>
                      {/* <button className='oldbookpay'>直接購買</button> */}
                    </div>
                  </div>
                )}
                {/*介紹的地方 */}
                {oldbooklist === 'b' && (
                  <div className={styles.oldbookintroduce}>
                    {bookData.blurb === ''
                      ? '來這裡找劇透？很遺憾，這位賣家不暴雷！'
                      : bookData.blurb}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='d-none d-xl-block col'>
            {/*------------------------------------------------ */}

            {/* 這個賣場沒用了 :) 白寫了 :):):):):) */}

            {/* <div className='sellerbox'>
<div className='sellermain'>
<div className='sellerimage'>
<img src='https://image.cache.storm.mg/styles/smg-800x533-fp/s3/media/image/2020/01/31/20200131-052418_U17017_M588719_cd2e.jpg?itok=s0SyFjTD'
/>
</div>
<div className='sellername'>
<h5>{clientData.client_name}</h5>
<div className='astore'>
<Link href={'/store/' + bookData.client_id}>賣場</Link>
</div>
</div>
</div>
<div className='sellerstar'>
<AiOutlineStar className='star-icon' />
<AiOutlineStar className='star-icon' />
<AiOutlineStar className='star-icon' />
<AiOutlineStar className='star-icon' />
<AiOutlineStar className='star-icon' />
<div className='star-icontext'>4/5</div>
</div>
<div className='sellertwobutton'>
<div className='contact_button'>
<a href=''>
<b>私訊</b>
</a>
</div>
<div className='follow_button'>
<a href=''>
<b>關注</b>
</a>
</div>
</div>
</div> */}
            {/*----------------------------------------- */}
          </div>
        </div>
      </div>
    </>
  )
}
