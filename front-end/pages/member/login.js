// New login
import React, { useState } from 'react'
import DetailBtn from '@/components/share/detail-btn'
import axios from 'axios'
import Link from 'next/link'
import { useAuthJWT } from '@/hooks/use-auth-jwt'
import LineLogo from '@/components/icons/line-logo'
import GoogleLogo from '@/components/icons/google-logo'
import FacebookLogo from '@/components/icons/facebook-logo'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

export default function UserTestJWT() {
  const parseJwt = (token) => {
    const base64Payload = token.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64')
    return JSON.parse(payload.toString())
  }

  const [error, setError] = useState('')
  const { setAuthJWT, authJWT } = useAuthJWT()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [passwd, setPasswd] = useState('')


  const handleLogin = async () => {
    setError('')

    if (!email) {
      setError('帳號不能為空')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('請輸入有效的email格式')
      return
    }

    if (!passwd) {
      setError('密碼不能為空')
      return
    }

    try {
      const res = await axios.post(
        'http://localhost:3002/member/auth-jwt/login',
        {
          email: email,
          passwd: passwd,
        },
        {
          withCredentials: true, // save cookie in browser
        },
      )

      if (res.data.message === 'success') {
        setAuthJWT({
          isAuth: true,
          userData: parseJwt(res.data.accessToken),
        })
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '登入成功',
          timer: 1000,
        }).then(() => {
          router.push('/')
        })
      } else if (res.data.message === 'fail') {
        setError('帳號或密碼錯誤')
      }
    } catch (error) {
      console.error('登入錯誤', error)
      setError('發生錯誤，請稍後再試')
    }
  }

  return (
    <>
      <div className='row login-block'>
        <div className='col-12 login-main-block'>
          <div className='pixel-border-yellow py-4 px-5'>
            <div className='login-header'>
              <div className='d-flex align-items-center me-auto'>
                <i className='fa-solid fa-right-to-bracket font-m me-2'></i>
                <h4>會員登入</h4>
              </div>
              {/* 協助按鈕 */}
              <button
                type='button'
                className='font-sm'
                data-bs-toggle='modal'
                data-bs-target='#adModal'
              >
                <i className='fa-solid fa-circle-question me-2'></i>
                協助 ?
              </button>
              {/* Modal */}
              <div
                className='modal fade'
                id='adModal'
                tabIndex={-1}
                aria-labelledby='adModalLabel'
                aria-hidden='true'
              >
                <div className='modal-dialog modal-dialog-centered text-black'>
                  <div className='yellow-alert pixel-border-yellow'>
                    <div className='modal-header'>
                      <h4
                        className='modal-title fs-5 fw-bold'
                        id='adModalLabel'
                      >
                        如何加入書營 ?
                      </h4>
                      <button
                        type='button'
                        className='btn-close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                      />
                    </div>
                    <div className='modal-body'>***</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='login-input mt-4 mb-3'>
              <label className='me-3 pt-2 text-nowrap' htmlFor='email'>
                信箱
              </label>
              <div className='w-100'>
                <div className='input-group flex-nowrap' data-bs-theme='dark'>
                  <input
                    type='email'
                    id='email'
                    className='form-control'
                    placeholder='電子郵件地址'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='login-input mb-1'>
              <label className='me-3 pt-2 text-nowrap' htmlFor='password'>
                密碼
              </label>
              <div className='w-100'>
                <div
                  className='input-group flex-nowrap align-items-center'
                  data-bs-theme='dark'
                >
                  <input
                    type='password'
                    id='password'
                    className='form-control rounded-2'
                    placeholder='密碼'
                    onChange={(e) => setPasswd(e.target.value)}
                  />
                  <Link href='/member/forget-password' className='font-sm ms-3'>
                    忘記密碼？
                  </Link>
                </div>
              </div>
            </div>
            {/* 錯誤訊息 */}
            <div className='text-danger text-start mt-2'>
              <strong>{error}</strong>
            </div>
            <div className='d-flex text-start'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='gridCheck1'
                />
                <label
                  className='form-check-label font-sm text-d-purple fw-bold'
                  htmlFor='gridCheck1'
                >
                  保持登入狀態
                </label>
              </div>
            </div>
            <div className='d-flex fw-bold mt-4'>
              <button
                className='col pixel-border-purple login-next'
                onClick={handleLogin}
              >
                登入
              </button>
              <Link
                className='col pixel-border-orange sign-up'
                href='/member/register'
              >
                還不是會員？ 立即註冊!
              </Link>
            </div>
            <div className='terms-of-use font-sm text-d-purple'>
              如登入，即代表同意本站
              <Link href='/about'>隱私權政策</Link>和
              <Link href='/about'>使用條款</Link>。
            </div>
          </div>
          <div className='quick-login-block boder-pixel'>
            <div className='quick-login mb-3'>快速登入</div>
            <div className='row mb-2'>
              <div className='col-sm-12 text-start'>
                <div className='d-flex justify-content-center'>
                  <LineLogo className='mx-3' />
                  <Link href='/member/google-login'>
                  <GoogleLogo className='mx-3' />
                  </Link>
                  <FacebookLogo className='mx-3' />
                </div>
              </div>
            </div>
          </div>
          <div className='decorative-color-block-purple'>
            <div className='decorative-color-block-purple-in'>
              <img src='http://localhost:3002/public/img/書營標準字.png' />
            </div>
          </div>
          <div className='decorative-color-block-pink'>
            <div className='decorative-color-block-pink-in'>
              <h4 className='mb-3 pixel-font-chinese'>歡迎來書營</h4>
              <span>
                瀏覽無盡知識海洋，盡在書營。尋找、閱讀、啟發，一站滿足您的閱讀渴望！
              </span>
            </div>
          </div>
          <div className='decorative-color-block-c-purple'>
            <div className='decorative-color-block-c-purple-in'></div>
          </div>
        </div>
      </div>
    </>
  )
}
