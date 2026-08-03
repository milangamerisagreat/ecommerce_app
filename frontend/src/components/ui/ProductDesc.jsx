import React from 'react'
import { Input } from './input'
import { Button } from './button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'

const ProductDesc = ({product}) => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  
   const addToCart = async (productId) => {
    try {
        const response = await axios.post("http://localhost:5000/api/v1/cart/add",{productId}, {
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.data.success){
            toast.success("product added to cart")
            dispatch(setCart(response.data.cart.items))
            
        }
    } catch (error) {
     console.error(error)
    }
  } 

  return (
    <div className="flex flex-col gap-4 ">
      <div
  className="
    w-full
    h-125
p-6
rounded-3xl
bg-linear-to-br
from-[#53ff0f41]
to-[#44444431]
backdrop-blur-2xl
border border-white/30
shadow-2xl
space-y-4
      "
>
  <h1 className="text-3xl font-bold">
    {product?.productName}
  </h1>

  <p className="text-gray-600">
    {product?.category} | {product?.brand}
  </p>

  <h2 className="text-2xl font-bold text-[#4e4e4e]">
    ₹{product?.productPrice}/-
  </h2>

<div className='flex gap-2 items-center w-75 font-2xl'>
  <p> Quantitiy : </p>
  <Input type="number" className='border border-[#000000] bg-transparent w-13' defaultValue={1}/>
</div>
<Button onClick={()=>addToCart(product?._id)} className="rounded-4xl">Add to Cart</Button>

</div>
</div>
  )
}

export default ProductDesc
