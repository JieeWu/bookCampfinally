import { useState, useEffect } from 'react'
import MemberSide from '@/components/member/member-side'
import Breadcrumb2 from '@/components/share/guide-pagination'
import MemberMiddle from '@/components/member/member-middle'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Swal from 'sweetalert2'

import { useAuthJWT } from '@/hooks/use-auth-jwt' // 要使用jwt的會員認證

export default function MemberPage() {
  // 如果該頁面有需要了解更多按鈕，把useState變更為true，並填寫下方資料
  const [status, setStatus] = useState(false)
  const { authJWT } = useAuthJWT() // 取得jwt的會員認證狀態
  const router = useRouter()
  const client_id = authJWT.userData.client_id

  const [formData, setFormData] = useState({
    email: '',
    passwd: '',
    client_name: '',
    gender: '',
    birthday: '',
    phone: '',
    client_address: '',
  })

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/member/users/${client_id}`,
        )
        const memberData = response.data

        // 更新 formData 状态
        setFormData(memberData.user)
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchMemberData()
  }, [client_id]) // 将 client_id 添加为依赖项，以确保在该值变化时重新获取数据

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // 更新確認密碼
    if (name === 'passwd') {
      setFormData((prevData) => ({
        ...prevData,
        passwdrecheck: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!checkForm()) {
      return
    }

    console.log(formData)
    try {
      const response = await axios.put(
        `http://localhost:3002/member/users/${client_id}`,
        formData,
      )

      console.log(response.data)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '修改成功',
        timer: 1000,
      }).then(() => {
        router.push('/member')
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const checkForm = () => {
    if (formData.email === '') {
      alert('請填寫您的信箱!')
      return false
    }

    if (formData.client_name === '') {
      alert('請填寫您的姓名!')
      return false
    }

    if (formData.gender !== '男' && formData.gender !== '女') {
      alert('請選擇您的性別!')
      return false
    }

    if (formData.birthday === '') {
      alert('請填寫您的生日!')
      return false
    }

    if (formData.phone === '') {
      alert('請填寫您的電話!')
      return false
    }

    if (formData.client_address === '') {
      alert('請填寫您的地址!')
      return false
    }

    return window.confirm('確定要送出嗎？')
  }

  // const [sideValue, setSideValue] = useState('')
  if (!authJWT.isAuth) {
    return (
      <>
        <div className='mt-5 not-login'>
          <div className='not-login-img'>
            <img src='/img/dead.png' className='w-100' />
          </div>
          {/* <div className='my-2'>您尚未登入會員喔</div> */}
          <Link
            href='/member/login'
            className='px-5 my-5 main-btn pixel-border-yellow-s not-login-text'
            type='button'
          >
            請先登入會員
          </Link>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className='row'>
          <div className='col-2 d-none d-md-flex px-0'>
            {/* 第一種為不跳轉頁面的切換方式 */}
            {/* <MemberSide setSideValue={setSideValue} /> */}
            <MemberSide />
          </div>
          <div className='col-12 col-md-10 col-xl-8'>
            <div className='mb-5'>
              <Breadcrumb2 />
              <MemberMiddle
                TitleIcon='fa-solid fa-user me-2' // 標題icon
                TitleName='修改資料' // 標題
                Remark='' // 標題旁備註
                setStatus={setStatus}
                status={status}
                DetailIcon='' // 按鈕icon
                DetailName='' // 按鈕名稱
                TextTitle='' // 內容標題
                Text='' // 內容說明
              >
                <div className='d-flex justify-content-end text-white font-sm p-3 pb-0'>
                  <span className='register-star'>*</span> 表示為必填的欄位
                </div>
                <div className='p-3 pt-0'>
                  <form
                    className='d-flex flex-wrap text-white'
                    onSubmit={handleSubmit}
                    encType='multipart/form-data'
                  >
                    <div className='col-6 px-4'>
                      <div className='fix-data-file'>
                        <label htmlFor='email'>
                          <i className='fa-regular fa-envelope me-2'></i>
                          電子郵件
                        </label>
                        <input
                          className={`form-control invalid`}
                          name='email'
                          type='email'
                          id='email'
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-6 px-4'>
                      <div className='fix-data-file'>
                        <label htmlFor='client_name'>
                          <i className='fa-solid fa-file-signature me-2'></i>
                          姓名
                        </label>
                        <input
                          className={`form-control invalid`}
                          name='client_name'
                          type='text'
                          id='client_name'
                          value={formData.client_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-6 px-4'>
                      <div className='fix-data-file'>
                        <label htmlFor='gender'>
                          <i className='fa-solid fa-person-half-dress me-2'></i>
                          姓別
                        </label>
                        <div className='btn-group'>
                          <input
                            className='btn-check'
                            name='gender'
                            type='radio'
                            value='男'
                            id='gender-male'
                            checked={formData.gender === '男'}
                            onChange={handleChange}
                            autoComplete='off'
                          />
                          <label
                            className='btn btn-outline-primary'
                            htmlFor='gender-male'
                          >
                            男
                          </label>
                          <span> </span>
                          <input
                            className='btn-check'
                            name='gender'
                            type='radio'
                            value='女'
                            id='gender-female'
                            checked={formData.gender === '女'}
                            onChange={handleChange}
                            autoComplete='off'
                          />
                          <label
                            className='btn btn-outline-primary'
                            htmlFor='gender-female'
                          >
                            女
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='col-6 px-4'>
                      <div className='fix-data-file'>
                        <label htmlFor='birthday'>
                          <i className='fa-solid fa-cake-candles me-2'></i>生日
                        </label>
                        <input
                          className={`form-control invalid`}
                          name='birthday'
                          type='date'
                          id='birthday'
                          value={formData.birthday}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-6 px-4'>
                      <div className='fix-data-file'>
                        <label htmlFor='phone'>
                          <i className='fa-solid fa-phone me-2'></i>電話
                        </label>
                        <input
                          className={`form-control invalid`}
                          name='phone'
                          type='text'
                          id='phone'
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='col-6 px-4'>
                      <div className='fix-data-file'>
                        <label htmlFor='client_address'>
                          <i className='fa-solid fa-map-location-dot me-2'></i>
                          住址
                        </label>
                        <input
                          className={`form-control invalid`}
                          name='client_address'
                          type='text'
                          id='client_address'
                          size='40'
                          value={formData.client_address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className='fix-btn-group'>
                      <button
                        className='main-btn pixel-border-yellow mx-4'
                        type='button'
                        name='Submit'
                        onClick={() => window.history.back()}
                      >
                        回上一頁
                      </button>
                      <input
                        className='main-btn pixel-border-yellow mx-4'
                        type='submit'
                        name='Submit2'
                        value='確認變更'
                      />
                    </div>
                  </form>
                </div>
              </MemberMiddle>
            </div>
          </div>
          <div className='col d-none d-xl-flex'></div>
        </div>
      </>
    )
  }
}
