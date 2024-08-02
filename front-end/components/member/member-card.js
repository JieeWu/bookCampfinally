import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DetailBtn from '@/components/share/detail-btn'
import axios from 'axios'
import { useAuthJWT } from '@/hooks/use-auth-jwt'
import dayjs from 'dayjs'

const MemberCard = () => {
  const { authJWT } = useAuthJWT()

  const [avatar, setAvatar] = useState('')
  const [loadAvatar, setLoadAvatar] = useState('')
  const birthday = dayjs(authJWT.userData.birthday).format('YYYY-MM-DD') // 轉換日期格式

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

  const handleFileUpload = async (e) => {
    try {
      // 呼叫刪除舊的大頭貼函式
      deleteOldAvatar()
      const avatar = e.target.files[0] // 取得上傳的檔案
      const formData = new FormData() // 建立formData
      formData.append('avatar', avatar) // 將檔案加入formData

      const response = await axios.post(
        `http://localhost:3002/member/avatar/${authJWT.userData.client_id}`,
        formData,
      )

      // 若上傳成功，更新畫面
      if (response.data && response.data.code === '200') {
        setLoadAvatar(response.data.avatar)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  // 先刪除舊的大頭貼
  const deleteOldAvatar = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3002/member/avatar/${authJWT.userData.client_id}`,
      )
      console.log(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <div className='member-card'>
        {/* 會員資訊區塊 */}
        <div className='col-12 col-md-5 d-flex align-items-end'>
          <div className='member-information-block c-bg-purple pixel-border-purple'>
            <div className='avatar-block'>
              <form>
                <label className='' htmlFor='avatar'>
                  {loadAvatar === null ? (
                    <img
                      src={`http://localhost:3002/public/img/member/default.png`}
                      alt='avatar'
                    />
                  ) : (
                    <img
                      src={`http://localhost:3002/public/img/member/${loadAvatar}`}
                      alt='avatar'
                    />
                  )}
                </label>
                <input
                  className='d-none'
                  placeholder=''
                  name='avatar'
                  type='file'
                  id='avatar'
                  value={avatar}
                  accept='image/* '
                  onChange={handleFileUpload}
                  disabled={!loadAvatar}
                />
              </form>
            </div>

            <div className='member-card-block'>
              <div className='member-card-info'>
                <div className='col-6 d-flex align-items-center mt-3'>
                  <strong className='me-2 font-s m-bg-yellow text-d-purple px-2 py-1 rounded-pill'>
                    我的點數
                  </strong>
                  {authJWT.userData.client_point}
                  <span className='ms-2'>點</span>
                </div>
                <div className='col-6 d-flex align-items-center mt-3'>
                  <strong className='me-2 font-s m-bg-yellow text-d-purple px-2 py-1 rounded-pill'>
                    身份驗證
                  </strong>
                  <i className='fa-solid fa-circle-check me-2 text-success'></i>
                  已驗證
                </div>
                <div className='col-6 d-flex align-items-center mt-3'>
                  <strong className='me-2 font-s m-bg-yellow text-d-purple px-2 py-1 rounded-pill'>
                    會員等級
                  </strong>
                  {authJWT.userData.client_level}
                </div>
                <div className='col-6 d-flex align-items-center mt-3'>
                  <strong className='me-2 font-s m-bg-yellow text-d-purple px-2 py-1 rounded-pill'>
                    距離升級
                  </strong>
                  <span className='font-s'>10000 / 9500</span>
                </div>
              </div>
            </div>
            <div className='basic-information mt-3'>
              <h5 className='pixel-font-chinese mb-3 d-flex align-items-center'>
                <i className='fa-solid fa-user me-2'></i>基本資訊
              </h5>
              <div className='member-card-info'>
                <div className='col-6 d-flex align-items-center font-sm'>
                  <strong className='me-2 d-bg-purple px-2 py-1 rounded-pill'>
                    姓名
                  </strong>
                  {authJWT.userData.client_name}
                </div>
                <div className='col-6 d-flex align-items-center font-sm'>
                  <strong className='me-2 d-bg-purple px-2 py-1 rounded-pill'>
                    Email
                  </strong>
                  {authJWT.userData.email}
                </div>
                <div className='col-6 d-flex align-items-center mt-3 font-sm'>
                  <strong className='me-2 d-bg-purple px-2 py-1 rounded-pill'>
                    生日
                  </strong>
                  {birthday}
                </div>
                <div className='col-6 d-flex align-items-center mt-3 font-sm'>
                  <strong className='me-2 d-bg-purple px-2 py-1 rounded-pill'>
                    電話
                  </strong>
                  {authJWT.userData.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 每日簽到區塊 */}
        <div className='col-12 col-md-7'>
          <div className='member-daily-check c-bg-purple pixel-border-purple'>
            <div className='d-flex align-items-center m-bg-purple p-3'>
              <h5 className='pixel-font-chinese d-flex align-items-center'>
                <i className='fa-regular fa-calendar-check me-2'></i>每日簽到
              </h5>
              <div className='ms-auto'>
                <DetailBtn
                  DetailIcon='fa-regular fa-circle-question me-2'
                  DetailName='關於簽到'
                  TextTitle=''
                  Text=''
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MemberCard
