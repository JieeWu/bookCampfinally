import React from 'react'
import styles from './front-title.module.css'

export default function FrontTitle({ title, icon }) {
  return (
    <>
      <div className={styles.titleTheme}>
        <div className='w-100 d-flex align-items-center justify-content-end'>
          <div className={`${styles.sBlock} me-3`}></div>
          <div className={styles.sLine}></div>
        </div>
        <h3 className='text-nowrap mx-2 mx-md-4 fw-bold'>
          <i className={icon}></i>
          {title}
        </h3>
        <div className='w-100 d-flex align-items-center'>
          <div className={styles.sLine}></div>
          <div className={`${styles.sBlock} ms-3`}></div>
        </div>
      </div>
    </>
  )
}
