import React from 'react'
import styles from './bot.module.css'

export default function Botbutton({ actionProvider }) {
  const options = [
    { text: '來書營?', handler: () => actionProvider.handleBookCamp(), id: 1 },
    { text: '如何成為會員',handler: () => actionProvider.handleBook(), id: 2 },
    { text: '我的訂單', handler: () => {}, id: 3 },
    { text: '天天簽到', handler: () => {}, id: 4 },
    { text: '忘記密碼', handler: () => {}, id: 5 },
  ]

  const optionsMarkup = options.map((option) => (
    <div className={styles['button-container']} key={option.id}>
    <button
      className={styles['learning-option-button']}
      onClick={option.handler}
    >
      {option.text}
    </button>
  </div>
  ))

  return (
    <div className={styles['learning-options-container']}>{optionsMarkup}</div>
  )
}
