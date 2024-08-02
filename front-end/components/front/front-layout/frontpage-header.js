import { useState, useEffect, useContext } from 'react'
// import BombMenu from '@/components/public-version/bomb-menu'
import MainHeader from '@/components/public-version/main-header/header'
import MainNavbarV2 from '@/components/public-version/main-header/navbar-v2'
import MainNavbar from '@/components/public-version/main-header/navbar'
import styles from './front-page-header.module.css'
import FrontpageBounce from '@/components/front/front-layout/frontpage-bounce'
import { useAuthJWT } from '@/hooks/use-auth-jwt' // 取得jwt的會員認證狀態
import { useRouter } from 'next/router'
import { CartContext } from '@/hooks/cartContext'

//防止未登入狀態進入ICON
import IsLoggedIn from '@/components/isLoggedIn'
import IsLoggedInCart from '@/components/isLoggedIn-cart'

import MainFooter from '@/components/public-version/main-header/footer'
import axios from 'axios'
import Link from 'next/link'
import Swal from 'sweetalert2'
// import { useRouter } from 'next/navigation'

export default function FrontPageHeader({ children }) {
  const [showMainHeader, setShowMainHeader] = useState(false)
  const { authJWT, setAuthJWT } = useAuthJWT() // 取得jwt的會員認證狀態
  const [searchValue, setSearchValue] = useState('') //大搜尋
  const [loadAvatar, setLoadAvatar] = useState('')
  const [randomBook, setRandomBook] = useState([])
  // 購物車狀態
  const { cartItem, setCartItem } = useContext(CartContext)
  const router = useRouter()
  //首頁隨機抓取八本書的書名
  useEffect(() => {
    const getBook = async () => {
      await axios
        .get('http://localhost:3002/share/TWlanguage/randomBook')
        .then((res) => {
          setRandomBook(res.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
    getBook()
  }, [])

  useEffect(() => {
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/cart/check', {
            withCredentials: true,
          })
          .then((res) => {
            // 購物車所有產品
            setCartItem(res.data.cart)
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
    }
    data()

    const handleScroll = () => {
      const scrollThreshold = 200
      const screenWidthThreshold = 768 // 指定的螢幕寬度閾值
      const shouldShowHeader =
        window.scrollY > scrollThreshold ||
        window.innerWidth <= screenWidthThreshold
      setShowMainHeader(shouldShowHeader)
    }

    const handleResize = () => {
      handleScroll() // 每次調整視窗大小時重新計算是否應該顯示 Header
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize) // 監聽視窗大小調整事件
    handleScroll() // 初始化時執行一次

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // 確保有值
        if (authJWT.userData && authJWT.userData.client_id) {
          const response = await axios.get(
            `http://localhost:3002/member/avatar/${authJWT.userData.client_id}`,
          )
          setLoadAvatar(response.data.avatar)
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchAvatar()
  }, [authJWT.userData.client_id])

  const headerStyle = {
    transform: showMainHeader ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 1s ease',
    // 其他您需要變更的樣式屬性
  }
  //監聽事件 按下Enter 可以搜尋
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      // 使用router.push進行導航
      router.push(`/newbook?query=${encodeURIComponent(searchValue)}`)
    }
  }

  // 登入按鈕滑入顯示
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleLogout = async () => {
    const res = await axios.post(
      'http://localhost:3002/member/auth-jwt/logout',
      {},
      {
        withCredentials: true, // save cookie in browser
      },
    )

    console.log(res.data)

    if (res.data.message === 'success') {
      setAuthJWT({
        isAuth: false,
        userData: {
          id: 0,
          name: '',
          username: '',
          r_date: '',
        },
      })
    }
    // window.alert('已登出，返回首頁')
    router.push('/')
  }


  // 請先登入
  const handleLinkClick = (e) => {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: '請先登入',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/member/login')
      }
    })
  }

  return (
    <>
      <header className={styles.fHeader}>
        <div className={styles.fHeaderUp}>
          <div className={styles.logo}>
            <Link href='#'>
              <img src='/img/test/書營標準字.png' width='110px' alt='' />
            </Link>
            <div className={`${styles.search} d-none d-md-flex ms-3`}>
              <input
                placeholder='找啥書?'
                type='text'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Link href={`/newbook?query=${encodeURIComponent(searchValue)}`}>
                <button type='submit'>搜尋</button>
              </Link>
            </div>
          </div>
          <ul className={`${styles.titleUl} d-none d-md-flex`}>
            <li>
              <Link href='#'>關於我們</Link>
            </li>
            <li>
              {authJWT.isAuth !== false ?
                <Link href='/member/coupon/coupon'>好康優惠</Link>
                :
                <Link href="#" onClick={(e) => { handleLinkClick(e) }}>好康優惠</Link>
              }
            </li>
            <li>
              <Link href='/forum'>交流討論</Link>
            </li>
          </ul>
          {/* 等政傑寫 */}
          <div className='d-flex flex-column position-relative'>
            {authJWT.isAuth ? (
              <Link
                href='/member/'
                className='main-btn pixel-border-yellow-s login-btn d-md-flex p-0'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className='px-3'>歡迎!</span>

                <div className='member-avatar m-0'>
                  <img
                    src={`http://localhost:3002/public/img/member/${loadAvatar}`}
                  />
                </div>
              </Link>
            ) : (
              <Link
                href='/member/login'
                className='main-btn pixel-border-yellow-s login-btn d-md-block'
              >
                登入/註冊
              </Link>
            )}
            <div
              className={`loginbtn-optionblock ${isHovered ? 'd-block' : 'd-none'
                }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ul className='w-auto'>
                <li>
                  <Link className='pixel-border-yellow-s' href='/member/'>
                    會員中心
                  </Link>
                </li>
                <li>
                  <button
                    className='pixel-border-yellow-s'
                    onClick={handleLogout}
                  >
                    登出
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* 等政傑寫 */}
        </div>
        <div className={styles.fHeaderDown}>
          <div className={styles.adBtn}>
            {/* <li>
                <Link href='#'>熱門關鍵字</Link>
              </li> */}
            <ul>
              {randomBook.length > 0
                ? randomBook.map((v, i) => {
                  return (
                    <>
                      <li>
                        <Link href={`/newbook/${v.book_id}`}>{(v.b_title).substring(0, 8)}</Link>
                      </li>
                    </>
                  )
                })
                : ''}
            </ul>
          </div>
          <div className='d-flex flex-xl-nowrap ms-2'>
            <IsLoggedIn href='/member/seller' icon='fa-solid fa-question' />
            <IsLoggedIn
              href='/member/mycollect'
              icon='fa-solid fa-heart'
              color='#ff245b'
            />
            <IsLoggedInCart href='/cart' icon='fa-solid fa-cart-shopping' />
            {/* <button
              className={`${styles.blockBtn} bg-white pixel-box--white font- ms-3`}
              type='button'
              data-bs-toggle='offcanvas'
              data-bs-target='#offcanvasRight_front'
              aria-controls='offcanvasRight'
            >
              <i className='fa-solid fa-bars'></i>
            </button>
            <BombMenu id={'front'} /> */}
          </div>
        </div>
      </header>

      {showMainHeader && (
        <header className='sticky-top' style={headerStyle}>
          <MainHeader />
          <MainNavbarV2 />
        </header>
      )}
      <main>
        <div className='container-fluid'>{children}</div>
      </main>
      <MainFooter />
      <FrontpageBounce />
    </>
  )
}
