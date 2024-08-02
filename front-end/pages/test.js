import axios from 'axios'
import React from 'react'

export default function test() {
  const data = async () => {
    await axios
      .post(
        'https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&&servicetype=1&url=https://localhost:3000/cvs_callback',
      )
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <button onClick={data}>123213213</button>

      <style jsx>
        {`
          .test2 {
            margin-top: 50px;
            height: 74px;
            background-color: var(--main-darkpurple);
            box-shadow:
              0px 4px 0px 0px #9b6cff,
              -4px -4px 0px 0px #9b6cff,
              4px -4px 0px 0px #9b6cff,
              4px 0px 0px 0px #9b6cff,
              -4px 0px 0px 0px #9b6cff,
              0px -4px 0px 0px #9b6cff,
              -8px 0px 0px 0px #72ccff,
              8px 0px 0px 0px #72ccff,
              4px 8px 0px 0px #72ccff,
              8px 4px 0px 0px #72ccff,
              -8px 4px 0px 0px #72ccff,
              -4px 8px 0px 0px #72ccff;
          }
        `}
      </style>
    </>
  )
}
