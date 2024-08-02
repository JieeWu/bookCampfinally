import React, { useEffect, useContext } from 'react'
import Swal from 'sweetalert2'
import { CartContext } from '@/hooks/cartContext'
export default function CrediCard() {

    const { orderCH } = useContext(CartContext);

    console.log(orderCH);
    useEffect(() => {
        if (orderCH.total <0 ) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '感謝您的訂購！',
                showConfirmButton: true,
            })
                .then(() => {
                    window.location.href = "/"
                })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '訂購失敗！',
                showConfirmButton: true,
            })
                .then(() => {
                    window.location.href = "/"
                })
        }
    }, [])

    return (
        <>

        </>
    )
}
