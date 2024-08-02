import React,{useState, useEffect} from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useAuthJWT } from '@/hooks/use-auth-jwt'
import { useRouter } from 'next/router'

export default function MemberSide() {
  const { setAuthJWT, authJWT } = useAuthJWT()
  const router = useRouter()
  const [loadAvatar, setLoadAvatar] = useState('')
  
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

  return (
    <>
      <aside className='management-block'>
        {/* 會員資訊 */}
        <div className='member-information'>
          <figure className='round-avatar'>
            {/* <img
              src='/img/test/1000_F_543133978_1yU08gMOtkUPq1zcepCEoc4d4dBcYdyL.png'
              width='100%'
              alt=''
            /> */}
            {loadAvatar === null ? (
              <img
                src={`http://localhost:3002/public/img/member/default.png`}
                alt='avatar'
                width='100%'
              />
            ) : (
              <Link href='/member'>
              <img
                src={`http://localhost:3002/public/img/member/${loadAvatar}`}
                alt='avatar'
                width='100%'
              />
              </Link>
            )}
          </figure>
          <div className='d-flex flex-wrap align-items-center ms-2'>
            <div className='fw-bold me-2'>{authJWT.userData.client_name}</div>
            <span className='fw-bold font-s'>歡迎回到會員中心</span>
          </div>
        </div>
        {/* 功能管理區 */}
        <div className='member-options' id='accordion'>
          <button
            className='member-main-btn pixel-purple c-bg-purple'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#collapse'
            aria-expanded='false'
            aria-controls='collapse'
          >
            會員資訊
            <i className='fa-solid fa-caret-down'></i>
          </button>
          <div
            className='collapse w-100'
            id='collapse'
            data-bs-parent='#accordion'
          >
            <div className='card card-body member-details'>
              <ul>
                <li>
                  <Link href='/member/update'>修改資料</Link>
                </li>
                <li>
                  <Link href='/member/reset-password'>修改密碼</Link>
                </li>
                <li>
                  <Link href='/member/mycollect'>我的收藏</Link>
                </li>
              </ul>
            </div>
          </div>
          <button
            className='member-main-btn pixel-purple c-bg-purple'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#collapse1'
            aria-expanded='false'
            aria-controls='collapse1'
          >
            消費紀錄
            <i className='fa-solid fa-caret-down'></i>
          </button>
          <div
            className='collapse w-100'
            id='collapse1'
            data-bs-parent='#accordion'
          >
            <div className='card card-body member-details'>
              <ul>
                <li>
                  <Link href='/member/order'>訂單紀錄</Link>
                </li>
                <li>
                  <Link href='#/'>點數查詢</Link>
                </li>
              </ul>
            </div>
          </div>
          <button
            className='member-main-btn pixel-purple c-bg-purple'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#collapse2'
            aria-expanded='false'
            aria-controls='collapse2'
          >
            優惠券
            <i className='fa-solid fa-caret-down'></i>
          </button>
          <div
            className='collapse w-100'
            id='collapse2'
            data-bs-parent='#accordion'
          >
            <div className='card card-body member-details'>
              <ul>
                <li>
                  <Link href='/member/coupon/coupon'>我的優惠券</Link>
                </li>
                <li>
                  <Link href='/member/coupon/coupon-record'>優惠券紀錄</Link>
                </li>
              </ul>
            </div>
          </div>
       
          <button
            className='member-main-btn pixel-purple c-bg-purple'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#collapse3'
            aria-expanded='false'
            aria-controls='collapse3'
          >
            賣家中心
            <i className='fa-solid fa-caret-down'></i>
          </button>
          
         
          <div
            className='collapse w-100'
            id='collapse3'
            data-bs-parent='#accordion'
          >
            <div className='card card-body member-details'>
              <ul>
              <li>
                  <Link href='/member/seller'>賣家中心首頁</Link>
                </li>
                <li>
                  <Link href='/member/seller/ad'>我的廣告</Link>
                </li>
                <li>
                  <Link href='/member/seller/ad-record'>廣告紀錄</Link>
                </li>
                
              </ul>
            </div>
          </div>
          <button
            className='member-main-btn pixel-purple c-bg-purple'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#collapse4'
            aria-expanded='false'
            aria-controls='collapse4'
          >
            文章資訊
            <i className='fa-solid fa-caret-down'></i>
          </button>
          <div
            className='collapse w-100'
            id='collapse4'
            data-bs-parent='#accordion'
          >
            <div className='card card-body member-details'>
              <ul>
                <li>
                  <Link href='#/'>我的文章</Link>
                </li>
                <li>
                  <Link href='#/'>收藏文章</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='footer mt-auto'>
          {/* 登出按鍵 */}
          {/* <button
            className='pixel-border-yellow m-bg-yellow w-100 fw-bold py-1'
            type='button'
          >
            登出
          </button> */}

          <button
            className='pixel-border-yellow m-bg-yellow w-100 fw-bold py-1'
            onClick={async () => {
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
            }}
          >
            登出
          </button>
        </div>
      </aside>
    </>
  )
}
