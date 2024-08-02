import React from 'react'
import styles from './pageination.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function PageInation({ currentPage, totalPages, onPageChange }) {


  return (
    <>
      <nav
        className={`${styles.PageInationBlock} br-bg-purple py-2`}
        aria-label='Page navigation'
      >
        <ul
          className={`pagination ${styles.pagination} justify-content-center`}
        >
          <li className='page-item mx-2 pixel-box--white-s'>
            <Link
              className='page-link'
              href='#'
              onClick={() => onPageChange((currentPage = 1))}
              aria-label='Previous'
            >
              <i className='fa-solid fa-backward'></i>
            </Link>
          </li>
          <li className='page-item mx-2 pixel-box--white-s'>
            <Link
              className={`page-link ${currentPage <= 1 ? 'disabled' : ''}`}
              href='#'
              onClick={(e) => {
                if (currentPage <= 1) {
                  e.preventDefault()
                  return
                }
                onPageChange(currentPage - 1)
              }}
              aria-label='Previous'
            >
              <i className='fa-solid fa-caret-left'></i>
            </Link>
          </li>
          {[...Array(totalPages).keys()].map((page) => (
            <li
              className={`page-item mx-2 pixel-box--white-s ${
                currentPage === page + 1 ? 'active' : ''
              }`}
              key={page + 1}
            >
              <Link
                className='page-link'
                href='#'
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page + 1)
                }}
              >
                {page + 1}
              </Link>
            </li>
          ))}
          <li className='page-item mx-2 pixel-box--white-s'>
            <Link
              className='page-link'
              href='#'
              onClick={() => onPageChange(currentPage + 1)}
              aria-label='Next'
            >
              <i class='fa-solid fa-caret-right'></i>
            </Link>
          </li>
          {/* 前往最後一頁 */}
          <li className='page-item mx-2 pixel-box--white-s'>
            <Link
              className='page-link'
              href='#'
              onClick={() => onPageChange(totalPages)}
              aria-label='Next'
            >
              <i className='fa-solid fa-forward'></i>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
