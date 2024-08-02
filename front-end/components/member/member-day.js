import React, { useState } from 'react';

export default function Home() {
  const [signedDate, setSignedDate] = useState(null); // 只有在簽到時才會有值

  const daysInMonth = 31; // 根據當月天數設定
  const startDay = 1; // 設置每月第一天是星期幾
  const daysPerWeek = 7; 
  const calendarDays = []; 

  const getDayStatus = (date) => {
    if (date === signedDate) {
      return 'signed';
    } else if (date >= new Date().getDate()) {
      return 'future'; // 未來日期
    } else {
      return 'expired'; // 過去日期
    }
  };

  const handleSignIn = async() => {
    setSignedDate(new Date().getDate()); 
    const response = await axios.post("http://localhost:3002/member/sign")
    console.log(response.data)
  };

  for (let i = 1; i <= daysInMonth; i++) {
    const dayStatus = getDayStatus(i);
    const currentDayOfWeek = (i + startDay - 1) % daysPerWeek;

    calendarDays.push(
      <div
        key={i}
        className={`day ${dayStatus}`} // 設置日期狀態
        style={{ gridColumn: currentDayOfWeek + 1 }} // 設置日期位置
      >
        {i}
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">每日簽到</h1>
      <div className="calendar">
        {calendarDays}
      </div>
      <button className="signInButton" 
      onClick={handleSignIn}
      >
        簽到
      </button>
    </div>
  );
}
