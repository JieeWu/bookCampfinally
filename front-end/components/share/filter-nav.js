import React from 'react'
import styles from './filter-nav.module.css'
import { useRouter } from 'next/router'
export default function FilterNav({ setSortOrder, sortOrder }) {
  return (
    <>
      <div className={`${styles.filterNav} br-bg-purple text-white`}>
        <span>篩選</span>
        <button className={styles.filterBtn}>熱銷</button>
        <button className={styles.filterBtn}>最新</button>
        <label className='me-3 ms-4'>價格</label>
        <select
          className={`${styles.formSelect} d-md-flex out-time-pixel`}
          aria-label='Default select example'
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          // e.target 是觸發這個事件的元素，即 <select> 元素。
          // e.target.value 是 <select> 當前被選中的 <option> 的值。
          // setSortOrder(e.target.value) 則是更新我們的 sortOrder 狀態為 <select> 當前的值。
        >
          <option value=''>預設排序</option>
          <option value='desc'>高到低</option>
          <option value='asc'>低到高</option>
        </select>
        <div className='d-flex input-type ms-auto'>
          <i className='fa-solid fa-bookmark mx-3'></i>
          <input
            className='p-2 d-bg-purple w-100 text-white'
            type='text'
            name=''
            id=''
            placeholder='類別找書?'
          />
        </div>
      </div>
    </>
  )
}
