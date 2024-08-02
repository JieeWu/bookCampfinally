import React, { useEffect, useState, useContext } from 'react'
import FrontTitle from '@/components/share/front-title'
import CommodityPage from '@/components/share/commodity/commodity-page'
import FilterNav from '@/components/share/filter-nav'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import styles from '@/styles/oldbook/odbk-page.module.css'
import CollectButton from '@/components/oldbook/CollectButton'
import PageInation from '@/components/share/pageination'
import Swal from 'sweetalert2'
import { CartContext } from '@/hooks/cartContext'

export default function AllNewBook() {
  const router = useRouter()
  const [oldbook, setOldbook] = useState([])
  const [sortOrder, setSortOrder] = useState('')
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1)
  const { b_genre_id, book_language, query } = router.query
  
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
    const fetchBooks = async (page = currentPage) => {
        let endpoint = `http://localhost:3002/perpage?page=${page}`;
        
        if (query && router.isReady) {
            endpoint = `http://localhost:3002/hotsearch`;
        } else if (b_genre_id) {
            endpoint = `http://localhost:3002/obgenre/${b_genre_id}?page=${page}`;
        } else if (book_language) {
            endpoint = `http://localhost:3002/obgenre/language/${book_language}?page=${page}`;
        }

        try {
            const params = query && router.isReady ? { term: query } : {};
            const res = await axios.get(endpoint, { params });

            if (b_genre_id || book_language || (query && router.isReady)) {
                setOldbook(res.data.oldbook || res.data);
            } else {
                setOldbook(res.data.data);
            }
        setTotalPages(res.data.totalPages);

        } catch (ex) {
            console.error('Error fetching books:', ex);
        }
    };

    fetchBooks();
}, [b_genre_id, book_language, query, router.isReady, currentPage]);


  // 搜尋
  const handleSearch = async (searchTerm) => {
    console.log("handleSearch called with:", searchTerm);
    try {
      const response = await axios.get('http://localhost:3002/hotsearch', {
        params: { term: searchTerm },
      });
      setOldbook(response.data);
    } catch (err) {
      console.log(err);
    }
}

  // useEffect(() => {
  //   console.log("useEffect triggered", query, router.isReady);
  //   if (query && router.isReady) {
  //     handleSearch(query);
  //   }
  // }, [query, router.isReady]);

  // 價錢排序
  
  let sortedBooks = [...oldbook]
  if (sortOrder === 'asc') {
    sortedBooks.sort((a, b) => a.book_price - b.book_price)
  } else if (sortOrder === 'desc') {
    sortedBooks.sort((a, b) => b.book_price - a.book_price)
  }
  function handlePageChange(newPage) {
    setCurrentPage(newPage)
  }
  

  return (
    <>
      <div className='newbook-top'>
        <FrontTitle icon='fa-solid fa-book-bookmark me-2' title='書類名稱' />
        <div className='mt-4 px-4'>
          <FilterNav setSortOrder={setSortOrder} sortOrder={sortOrder} />
          <div className='row px-2'>
            {sortedBooks && sortedBooks.length > 0 ? (
              sortedBooks.map((v) => {
                if (v.book_status_id == 2) return null
                return (
                  <div className='col-3' key={v.book_id}>
                    <div
                      className={`${styles.commodityCard} pixel-box--white m-1 my-2`}
                    >
                      <Link href={'/newbook/' + v.book_id}>
                        <img
                          className={styles.commodityImg}
                          src={`http://localhost:3002/public/img/oldbookimgs/${v.book_img_id}`}
                        />
                      </Link>
                      <div className='mt-auto position-relative'>
                        <CollectButton oldBookId={v.book_id} />
                        <h6 className='fw-bold px-2'>{v.b_title}</h6>
                        <div className={styles.priceArea}>
                          <div className='d-bg-purple text-yellow pixel-d-purple w-100 p-1'>
                            <i className='bi bi-coin mx-1'></i>
                            <i className='fa-solid fa-circle-dollar-to-slot me-2'></i>
                            {v.book_price}元
                          </div>
                          <button
                            type='button'
                            className={styles.addButton}
                            onClick={() => {
                              handleAddCart(v)
                            }}
                          >
                            <i className='fa-solid fa-cart-plus'></i>
                          </button>
                          {/* <button type='button' className={styles.addButton}>
                            <i className='fa-solid fa-plus'></i>
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className={`mt-5 ${styles.cartEmptyDiv}`}>
                <div className='imgBoxSize1'>
                  <img src='/img/dead.png'  />
                </div>
                <div className='erbook'>
                  找不到您輸入的內容，重新搜尋看看？？
                </div>
              </div>
            )}
          </div>
          <PageInation
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}
