import React, { useState, useEffect, useRef } from 'react'
import styles from './chat-room.module.css'
import io from 'socket.io-client'
import { useAuthJWT } from '../../hooks/use-auth-jwt'
import Swal from 'sweetalert2'
export default function chatRoom() {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [user, setUser] = useState('')
  const [image, setImage] = useState(null)
  const messageAreaRef = useRef(null)
  const [showEmojis, setShowEmojis] = useState(false)
  const [isProcess, setIsProcess] = useState(false)
  const avatarUrl = 'http://localhost:3002/img/member/'
  const emojis = [
    '😀',
    '😂',
    '😊',
    '🥰',
    '😎',
    '🤩',
    '😊',
    '🤔',
    '😄',
    '😃',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😇',
    '😉',
    '😍',
    '🥰',
    '😋',
    '😎',
    '😌',
    '😏',
    '🙃',
    '😐',
    '😑',
    '😶',
    '😒',
    '🙄',
    '😬',
    '🤐',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🥴',
    '🥺',
    '😢',
    '😥',
    '😰',
    '😭',
    '😓',
    '😪',
    '😴',
    '🙄',
    '🤷‍♂️',
    '🤷‍♀️',
    '🤦‍♂️',
    '🤦‍♀️',
    '🙆‍♂️',
    '🙆‍♀️',
    '🙅‍♂️',
    '🙅‍♀️',
    '🙋‍♂️',
    '🙋‍♀️',
    '🤯',
    '😥',
    '🤬',
    '😈',
    '👿',
    '💀',
    '☠️',
    '💩',
    '🤡',
    '👻',
    '👽',
    '👾',
    '🤖',
    '🎃',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
    '🤲',
    '👐',
    '🙌',
    '👏',
    '🤝',
    '👍',
    '👎',
    '👊',
    '✊',
    '🤛',
    '🤜',
    '🤞',
    '✌️',
    '🤟',
    '🤘',
    '👌',
    '👈',
    '👉',
    '👆',
    '👇',
    '☝️',
    '✋',
    '🤚',
    '🖐',
    '🖖',
    '🤏',
    '✍️',
    '👋',
    '👏',
    '🙏',
    '💪',
    '🦵',
    '🦶',
    '👂',
    '👃',
    '👣',
    '👀',
    '👁️‍🗨️',
    '🧠',
    '🦷',
    '🗣',
    '👅',
    '👄',
    '💋',
    '🌍',
    '🌎',
    '🌏',
    '🌐',
    '🌑',
    '🌒',
    '🌓',
    '🌔',
    '🌕',
    '🌖',
    '🌗',
    '🌘',
    '🌙',
    '🌚',
    '🌛',
    '🌜',
    '🌝',
    '🌞',
    '🌟',
    '⭐️',
    '🌠',
    '🌤️',
    '⛅️',
    '🌥️',
    '☁️',
    '🌦️',
    '🌧️',
    '⛈️',
    '🌩️',
    '🌨️',
    '❄️',
    '☃️',
    '⛄️',
    '🌬️',
    '💨',
    '🌪️',
    '🌫️',
    '🌈',
    '☔️',
    '💧',
    '💦',
    '☂️',
    '🌊',
  ]

  const { authJWT, setAuthJWT } = useAuthJWT()
  console.log()
  // const scrollToBottom = () => {
  //   if (messageAreaRef.current) {
  //     messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
  //   }
  // }
  // useEffect(() => {
  //   scrollToBottom() // 確保在新增訊息後捲動到最底部
  // }, [chat])
  // const handleEmojiClick = (emoji) => {
  //   setMessage((prevMessage) => prevMessage + emoji)
  //   setShowEmojis(false)
  // }
  // useEffect(() => {
  //   const newSocket = io.connect('http://localhost:3002')
  //   setSocket(newSocket)

  //   newSocket.on('message', (message) => {
  //     setChat((prevChat) => [...prevChat, message])
  //   })

  //   return () => {
  //     newSocket.close()
  //   }
  // }, [])
  // useEffect(() => {
  //   if (socket) {
  //     socket.on('message', (message) => {
  //       console.log('Received:', message)
  //     })
  //   }
  // }, [socket])

  // const sendMessage = () => {
  //   if (socket) {
  //     if (message == '') {
  //       Swal.fire({
  //         icon: 'error',
  //         title: '請輸入文字',
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //         }
  //       })
  //     } else {
  //       const data = {
  //         userId: authJWT.userData.client_id,
  //         message: message,
  //         avatar: authJWT.userData.avatar,
  //       }
  //       socket.emit('message', data)
  //       setMessage('')
  //     }

  //     // setImage(null)
  //   }
  // }
  return (
    <>
      <div className='d-flex flex-column h-100 ps-2'>
        <div className='truncatedCorner-d-purple position-relative h-100'>
          <div className={styles.subjectLine}>
            <h6>大家一起來聊天！！！</h6>
            <select
              className={`${styles.formSelect} ms-auto out-time-pixel`}
              aria-label='Default select example'
            >
              <option>主題選擇</option>
              <option value='1'>有夠便宜</option>
              <option value='2'>抄襲?</option>
            </select>
          </div>

          <div
            className={styles.messageArea}
            id='messageArea'
            ref={messageAreaRef}
          >
            {chat.map((data, index) => {
              {
                return (
                  <>
                    {data.userId === authJWT.userData.client_id ? (
                      <div className={styles.replyBox2} key={index}>
                        <div className='pixel-box--light--chatRoom p-2 text-wrap me-3'>
                          <span>{data.message} </span>
                        </div>
                        <figure className='round-avatar'>
                          <img
                            src={avatarUrl + `${authJWT.userData.avatar}`}
                            width='100%'
                            alt=''
                          />
                        </figure>
                      </div>
                    ) : (
                      <div className={styles.replyBox}>
                        <figure className='round-avatar'>
                          <img
                            src={avatarUrl + `${data.avatar}`}
                            width='100%'
                            alt=''
                          />
                        </figure>
                        <div className='pixel-box--light p-2 text-wrap ms-3'>
                          {data.message}{' '}
                        </div>
                      </div>
                    )}
                  </>
                )
              }
            })}
          </div>
        </div>
        <div className={`${styles.messageInputBox} my-3`}>
          <div className='d-flex'>
            <button
              className={`${styles.mesSBtn} pixel-border-br-purple`}
              type='button'
              onClick={() => {
                // setShowEmojis(!showEmojis)
              }}
            >
              <i className='fa-solid fa-face-laugh-wink font-m'></i>
            </button>
            {showEmojis && (
              <div className='emoji-picker'>
                {emojis.map((emoji, index) => (
                  <span
                    key={index}
                    // onClick={() => handleEmojiClick(emoji)}
                    className='emoji'
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            )}
            <button
              className={`${styles.mesSBtn} pixel-border-br-purple ms-3`}
              type='button'
            >
              <label
                htmlFor='imageInput'
                className={`${styles.mesSBtn} pixel-border-br-purple`}
              >
                <i className='fa-solid fa-image font-m'></i>
              </label>
              <input type='file' id='imageInput' style={{ display: 'none' }} />
            </button>
          </div>
          <input
            className={`${styles.mesInput} w-100 mx-3`}
            type='text'
            id=''
            placeholder={
              authJWT.userData.id !== 0
                ? '輸入內容'
                : '想聊天嗎？登入即可輸入訊息！！！'
            }
            value={message}
            // onChange={(e) => setMessage(e.target.value)}
            readOnly={authJWT.userData.id !== 0 ? null : true}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isProcess) {
                if (!Swal.isVisible()) {
                  e.preventDefault()
                  // 检查是否有弹出 Swal 弹出框
                  setIsProcess(true)
                  sendMessage()
                }
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setIsProcess(false)
              }
            }}
          />

          <button
            className={`${styles.mesLBtn} pixel-border-br-purple`}
            type='button'
            // onClick={sendMessage}
          >
            <label className='d-flex' htmlFor='contentInput'>
              <span className='d-none d-md-block'>發送</span>
            </label>
            <i
              className='fa-solid fa-paper-plane ms-md-2'
              id='contentInput'
            ></i>
          </button>

          {/* {image && (
            <div className={styles.previewImage}>
              <img src={} alt='選擇的圖片' />
            </div>
          )} */}
        </div>
      </div>
      <style jsx>
        {`
          .emoji-picker {
            position: absolute;
            bottom: 40px; /* 調整這個值以控制距離表情按鈕的距離 */
            left: 0;
            max-width: 200px;
            max-height: 100px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 8px;
            display: flex;
            flex-wrap: wrap;
            z-index: 888;
            overflow: auto;
          }

          .emoji {
            font-size: 20px;
            margin: 5px;
            cursor: pointer;
          }
        `}
      </style>
    </>
  )
}
