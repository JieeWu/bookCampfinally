import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

export default function Editproduct() {
  const [formData, setFormData] = useState({
    b_title: '',
    book_price: '',
    author: '',
    book_quantity: '',
    book_language: '',
    blurb: '',
    book_status_id: '',
    sherlf_date: '', 
    revise_date: '', 
    b_genre_id: '',
    b_type_id: '',
    book_img_id: '',
    isbn: '',
  })
  
  const router = useRouter()
  const { book_id } = router.query // 注意：使用解構賦值從 query 中提取 book_id
  
  useEffect(() => {
    if (book_id) {
      // 發送請求以獲取該商品的資料
      const fetchProductData = async () => {
        try {
          const res = await axios.get(`http://localhost:3002/selleroldbook/${book_id}`)
          const productData = res.data // 假設返回的是一個數組，並取第一項
    
          // 使用取得的商品資料設置表單狀態
          setFormData(productData)
        } catch (error) {
          console.error('Failed to fetch product data', error)
        }
      }
      fetchProductData()
    }
  }, [book_id]) 

  useEffect(() => {
    if (router.isReady && router.query.edit_product) {
      setBookId(Number(router.query.edit_product))
    }
  }, [router.isReady, router.query])

  const [error, setError] = useState({
    b_title: '',
    book_price: '',
    author: '',
    b_type_id: '',
    book_quantity: '',
    book_language: '',
    b_genre_id: '',
  })

  const validateForm = () => {
    let errors = {}

    if (!formData.b_title.trim()) {
      errors.b_title = '請輸入書名'
    }
    if (!formData.book_price) {
      errors.book_price = '請輸入價格'
    }
    if (!formData.isbn) {
      errors.isbn = '請輸入ISBN碼'
    }
    if (!formData.author.trim()) {
      errors.author = '請輸入作者名稱'
    }
    if (!formData.book_quantity || formData.book_quantity === '0') {
      errors.book_quantity = '請輸入數量'
    }
    if (!formData.book_language || formData.book_language === '') {
      errors.book_language = '請選擇語言分類'
    }
    if (!formData.b_genre_id || formData.b_genre_id === '') {
      errors.b_genre_id = '請選擇分類'
    }
    if (formData.book_price > 100000) {
      errors.book_price = '價格不能超過100000'
    }
    if (formData.book_quantity > 10000000000000) {
      errors.book_quantity = '數量不能超過100'
    }
    if (!formData.b_type_id) {
      errors.b_type_id = '請輸入出版商'
    }

    return errors
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setError(errors)

      // 新增的部分: 使用sweetalert2顯示錯誤訊息
      let errorMessages = Object.values(errors).join('<br/>')
      Swal.fire({
        icon: 'error',
        title: '填寫錯誤!',
        confirmButtonText: '知道了',
        html: errorMessages,
      })

      return // 如果有錯誤，則不繼續
    }
    console.log(123)

    try {
      let uploadedFilename = ''
      // 上傳圖片
      if (file) {
        const formDataForImage = new FormData()
        formDataForImage.append('file', file)

        const imageResponse = await axios.post(
          'http://localhost:3002/oldbookupload',
          formDataForImage,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        uploadedFilename = imageResponse.data.filename
        console.log('File uploaded successfully:', uploadedFilename)
      }

      // 更新 formData
      const updatedFormData = {
        ...formData,
        book_img_id: uploadedFilename,
        // client_id
        // client_id: authJWT.userData.id
      }

      console.log(updatedFormData)

      // 提交其他資料
      const response = await axios.put(
        `http://localhost:3002/selleroldbook/${bookId}`,
        updatedFormData,
        {
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        console.log('數據保存成功!', response.data)
      } else {
        console.error('錯誤', response.data)
      }
    } catch (error) {
      console.error('提交數據時出錯', error)
    }
  }
  const handleValidation = (e) => {
    const { name, value } = e.target

    let errorMessage = ''

    if (!value) {
      errorMessage = '此欄位是必填的'
    } else if (name === 'book_quantity' && parseInt(value) > 10000000000000) {
      errorMessage = '數量不能超過10000000000000'
    }
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }))
  }

  //現在時間
  const sherlfDate = new Date()
  const formattedSherlfDate = `${
    sherlfDate.getFullYear() +
    '-' +
    ('00' + (sherlfDate.getMonth() + 1)).slice(-2) +
    '-' +
    ('00' + sherlfDate.getDate()).slice(-2) +
    ' ' +
    ('00' + sherlfDate.getHours()).slice(-2) +
    ':' +
    ('00' + sherlfDate.getMinutes()).slice(-2) +
    ':' +
    ('00' + sherlfDate.getSeconds()).slice(-2)
  }`


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))

    if (name === 'book_quantity') {
      // Validate quantity
      if (parseInt(value) > 100000000) {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: '數量不能超過100',
        }))
      } else if (value === '' || parseInt(value) === 0) {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: '此欄位是必填的',
        }))
      } else {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }))
      }
    } else if (name === 'book_price') {
      // Validate price
      if (parseInt(value) > 100000) {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: '價格不能超過100000',
        }))
      } else if (value === '' || parseInt(value) === 0) {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: '此欄位是必填的',
        }))
      } else {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }))
      }
    } else {
      // Validate other fields
      if (value.trim() === '') {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: '此欄位是必填的',
        }))
      } else {
        setError((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }))
      }
    }
  }
  return (
    <>
      <h3 className='addname'>編輯商品</h3>
      <div className='add '>
        <form onSubmit={handleSubmit}>
          <div className='add2'>
            <label htmlFor='mybook' className='addodboookname'>
              書名:
            </label>
            <input
              type='text'
              placeholder='書名'
              id='mybook'
              name='b_title'
              value={formData.b_title}
              onChange={handleChange}
              onBlur={handleValidation}
              className='form-control'
            />

            <span className='errorname'>{error.b_title}</span>
            <br />
            <label htmlFor='ISBN' className='addodboookname'>
              ISBN碼
            </label>
            <input
              type='number'
              min={1}
              placeholder='ISBN碼'
              id='ISBN'
              name='isbn'
              onChange={handleChange}
              onBlur={handleValidation}
              className='form-control'
            />
            <span className='errorname'>{error.isbn}</span>
            <br />
            <label htmlFor='price' className='addodboookname'>
              價格:
            </label>
            <input
              type='number'
              min={1}
              placeholder='價格'
              id='price'
              name='book_price'
              className='form-control'
              value={formData.book_price}
              onChange={handleChange}
              onBlur={handleValidation}
            />
            <span className='errorname'>{error.book_price}</span>
            <br />
            <label htmlFor='author' className='addodboookname'>
              作者:
            </label>
            <input
              type='text'
              placeholder='作者'
              id='author'
              name='author'
              className='form-control'
              value={formData.author}
              onChange={handleChange}
              onBlur={handleValidation}
            />
            <span className='errorname'>{error.author}</span>
            <br />
            <label htmlFor='quantity' className='quantity addodboookname'>
              數量:
            </label>
            <input
              type='number'
              min={1}
              placeholder='數量'
              id='quantity'
              name='book_quantity'
              className='form-control'
              value={formData.book_quantity}
              onChange={handleChange}
              onBlur={handleValidation}
            />
            <span className='errorname'>{error.book_quantity}</span>
            <br />
            <label htmlFor='use' className='addodboookname'>
              語言分類:
            </label>
            <select
              id='use'
              className='form-select'
              name='book_language'
              value={formData.book_language}
              onChange={handleChange}
              onBlur={handleValidation}
            >
              <option selected value=''>
                請選擇
              </option>
              <option value='1'>繁體中文</option>
              <option value='2'>英文</option>
              <option value='3'>其他外文</option>
            </select>
            <span className='errorname'>{error.book_language}</span>
            <br />

            <label htmlFor='booktype' className='addodboookname'>
              出版商:
            </label>
            <input
              id='booktype'
              type='text'
              name='b_type_id'
              className='form-control'
              value={formData.b_type_id}
              onChange={handleChange}
              onBlur={handleValidation}
            />
            <span className='errorname'>{error.b_type_id}</span>
            <br />

            <label htmlFor='myname' className='bookclass addodboookname'>
              書籍分類:
            </label>
            <select
              id='myname'
              aria-label='Default select example'
              className='form-select'
              name='b_genre_id'
              value={formData.b_genre_id}
              onChange={handleChange}
              onBlur={handleValidation}
            >
              <option selected value=''>
                請選擇
              </option>
              <option value='1'>文學小說</option>
              <option value='2'>商業理財</option>
              <option value='3'>藝術設計</option>
              <option value='4'>人文社科</option>
              <option value='5'>心理勵志</option>
              <option value='6'>自然科普</option>
              <option value='7'>醫療健保</option>
              <option value='8'>生活與風格</option>
              <option value='9'>旅遊</option>
              <option value='10'>輕小說</option>
              <option value='11'>漫畫/圖文書</option>
              <option value='12'>語言學習</option>
              <option value='13'>考試用書</option>
              <option value='14'>電腦資訊</option>
              <option value='15'>其他</option>
            </select>
            <span className='errorname'>{error.b_genre_id}</span>
          </div>

          <div className='push'>
            <input
              className='form-check-input'
              name='book_status_id'
              type='radio'
              id='on'
              value={1} // 上架的值
              checked={formData.book_status_id == 1}
              onChange={handleChange}
            />
            <label htmlFor='on'>上架</label>
            <input
              className='form-check-input'
              name='book_status_id'
              type='radio'
              id='off'
              value={2} // 下架的值
              checked={formData.book_status_id == 2}
              onChange={handleChange}
            />
            <label htmlFor='off'>下架</label>
          </div>

          <div className='addodboookname'>上傳圖片：</div>
          <div>
            <input type='file' onChange={handleFileChange} accept='image/*' />
          </div>

          <label htmlFor='describe' className='addodboookname'>
            簡介:
          </label>
          <textarea
            className='form-control'
            id='describe'
            cols={30}
            rows={8}
            name='blurb'
            value={formData.blurb}
            onChange={handleChange}
          />
          <button type='submit' className='addstore'>
            編輯商品
          </button>
        </form>
      </div>
    </>
  )
}
