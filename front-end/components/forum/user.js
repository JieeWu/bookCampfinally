// user.js
import req from './api'
export const userSignUp = (signUpData) => {
  return req('post', '/user/sign-in', signUpData)
}

export const userLogIn = (logInData) => {
  return req('post', '/user/log-in', logInData)
}

export const userLogOut = () => {
  return req('get', 'http://127.0.0.1:3002/select/question')
}

export const userDelete = (userNo) => {
  return req('delete', '/user/delete', userNo)
}
