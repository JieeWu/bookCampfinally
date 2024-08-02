import '../node_modules/bootstrap/dist/css/bootstrap.css'

/* ----- frontEnd CSS ----- */
import '@/styles/globals.css'
import '@/styles/header.css'
import '@/styles/navbar.css'

import '@/styles/cart/cart.css'
import '@/styles/member/member.css'

import '@/styles/button.css'
import '@/styles/animation.css'
import '@/styles/input.css'
import '@/styles/decorate.css'
import '@/styles/pixelStyle.css'

// oldbook
// import '@/styles/oldbook/store.css' 沒有賣場就不用這個了:)
// import '@/styles/oldbook/SellerHome.css'
// import '@/styles/oldbook/OrderManagement.css'
// import '@/styles/oldbook/oldbook.css'
import '@/styles/oldbook/Mycommodity.css'
// import '@/styles/oldbook/oldbooklist.css'
// import '@/styles/oldbook/add.css'
import '@/styles/button.css'
import '@/styles/input.css'
import '@/styles/decorate.css'
import '@/styles/pixelStyle.css'
import '@/styles/cart/cart.css'
import '@/styles/chat-app.css'

// member
import '@/styles/member/member.css'
import '@/styles/member/login.css'
import '@/styles/member/register.css'

//book
import '@/styles/chat-app.css'
import '@/styles/newbook/newbook.css'


/* state、hooks */
import { useEffect, useState } from 'react'
import { CartContext } from '@/hooks/cartContext'
import { AuthProviderJWT } from '@/hooks/use-auth-jwt'

import MainHeader from '@/components/public-version'
import FrontPageHeader from '@/components/front/front-layout/frontpage-header'

/* Redux儲存庫 */
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/Redux/store'

export default function App({ Component, pageProps }) {

  // 該會員-所有的產品
  const [cartItem, setCartItem] = useState([])
  // 該會員-訂單資料寫入
  const [orderCH, setOrderCH] = useState([])

  const getLayout =
    Component.getLayout ||
    ((page) => {
      switch (page.type.name) {
        case 'Home':
          return <FrontPageHeader>{page}</FrontPageHeader>
        default:
          return <MainHeader>{page}</MainHeader>
      }
    })
  return (
    <>
      <AuthProviderJWT>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CartContext.Provider
              value={{
                cartItem,
                setCartItem,
                orderCH,
                setOrderCH,
              }}
            >
              {getLayout(<Component {...pageProps} />)}
            </CartContext.Provider>
          </PersistGate>
        </Provider>
      </AuthProviderJWT>
    </>
  )
}
