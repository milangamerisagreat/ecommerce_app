import { Button } from '@/components/ui/button'
import OrderCard from '@/components/ui/OrderCard'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ShowUserOrders = () => {

  const [userOrder, setUserOrder] = useState(null)
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken")
  const params = useParams()

  const getUserOrders = async () => {
   
    const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/user-order/${params.userId}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    })

    if(res.data.success){
      setUserOrder(res.data.orders)
    }
 
  }

  useEffect(()=>{
    getUserOrders()
  },[])

  return (
    
    <div className='mt-15 bg-[#15ff0041] w-full p-15 min-h-screen'>
      <Button onClick={()=>navigate(-1)} className="mb-5"><ArrowLeft/></Button>
      <OrderCard userOrder={userOrder}/>
    </div>
    
  )
}

export default ShowUserOrders
