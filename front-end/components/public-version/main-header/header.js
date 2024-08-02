import React, { useState, useEffect, useContext } from 'react'
import { useAuthJWT } from '@/hooks/use-auth-jwt' // 取得jwt的會員認證狀態
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { CartContext } from '@/hooks/cartContext'

import IsLoggedIn from '@/components/isLoggedIn'
import IsLoggedInCart from '@/components/isLoggedIn-cart'

export default function MainHeader() {
  // token設定
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const { authJWT, setAuthJWT } = useAuthJWT() // 取得jwt的會員認證狀態
  const [loadAvatar, setLoadAvatar] = useState('')
  const router = useRouter()
  const [user, setUser] = useState([])
  // 購物車狀態
  const { cartItem, setCartItem } = useContext(CartContext);

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

  useEffect(() => {
    //抓取資料
    const data = async () => {
      try {
        await axios
          .get('http://localhost:3002/cart/check', {
            withCredentials: true,
          })
          .then((res) => {
            // 購物車所有產品
            setCartItem(res.data.cart)

          }).catch((error) => {
            console.log(error);
          })
      } catch (error) {
        console.log(error)
      }
    }
    data();
  }, [])


  const getAccount = (e) => {
    setAccount(e.target.value)
  }
  const getPassword = (e) => {
    setPassword(e.target.value)
  }
  const submitData = async () => {
    try {
      const data = { account: account, password: password }
      const res = await axios.post('http://localhost:3002/login', data)
      const token = res.data.data.token
      localStorage.setItem('jwtToken', token)
      setUser(res.data.data)
    } catch (error) {
      console.log(error.message)
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

  //  購物車數量
  // const { allCartItem } = useContext(CartContext)

  return (
    <>
      <div className='header-group'>
        <div className='logo-div'>
          <Link href='/'>
            <img src='/img/logo.jpg' alt='logo' width='100%' />
          </Link>
        </div>
        <div className='header-btn-group'>
          <IsLoggedIn href='/member/seller' icon='fa-solid fa-question' />
          <IsLoggedIn href='/member/mycollect' icon='fa-solid fa-heart' color='#ff245b' />
          <IsLoggedInCart href='/cart' icon='fa-solid fa-cart-shopping' />

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
              <ul>
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
        </div>
      </div>
    </>
  )
}
