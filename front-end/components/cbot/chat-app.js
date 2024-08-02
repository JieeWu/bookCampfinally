import React, { useState } from 'react'
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
// import styles from '@/styles/chat-app.module.css'
import ActionProvider from './chatbot/ActionProvider'
import MessageParser from './chatbot/MessageParser'
import config from './chatbot/config'
import Botbutton from './chatbot/botbutton'

function ChatApp() {
  const [showBot, toggleBot] = useState(false)

  const saveMessages = (messages, HTMLString) => {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  }

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('chat_messages'))
    return messages
  }
  const validator = (input) => {
    if (input.trim().length > 0) return true
    return false
  }

  return (
    <div className='App'>
      {showBot && (
        <div>
          {/* 聊天機器人的主要組件配置 */}
          <Chatbot
            config={config}
            actionProvider={ActionProvider}
            messageHistory={loadMessages()}
            messageParser={MessageParser}
            saveMessages={saveMessages}
            validator={validator}
          />
        </div>
     
      )}
      {/*觸發聊天機器人顯示或隱藏的按鈕  */}
      <button
        className='customerservice'
        onClick={() => toggleBot((prev) => !prev)}
      ></button>
    </div>
  )
}

export default ChatApp
