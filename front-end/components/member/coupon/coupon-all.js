import { useState } from 'react'
import CouponInput from '@/components/member/coupon/coupon-input'
import CouponUnaccalimed from '@/components/member/coupon/coupon-unaccalimed'
import CouponUnused from '@/components/member/coupon/coupon-unused'


export default function CouponAll({setCartCoupon}) {
  const [status, setStatus] = useState(false)

  const [coupons, setCoupons] = useState([])

  return (
    <>
      {/* 優惠券區塊 */}
      <CouponInput
        setCoupons={setCoupons}
        setStatus={setStatus}
        status={status}
      />
      {status === true ? (
        <CouponUnaccalimed coupons={coupons} setCoupons={setCoupons} />
      ) : (
        <CouponUnused setCartCoupon={setCartCoupon} coupons={coupons} setCoupons={setCoupons} />
      )}
    </>
  )
}
