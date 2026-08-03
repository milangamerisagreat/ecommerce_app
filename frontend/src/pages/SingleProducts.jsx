import BreadCrums from '@/components/ui/BreadCrums'
import ProductDesc from '@/components/ui/ProductDesc'
import ProductImg from '@/components/ui/ProductImg'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ProductDes from '@/components/ui/ProductDes'

const SingleProducts = () => {

    const params = useParams()
    const productId = params.id
    const {products} = useSelector(store=>store.product)
    const product = products.find((item)=>item._id === productId)

  return (
    <div className="bg-[#2bff003f]">
    <div className="pt-20 py-10 max-w-7xl min-h-screen mx-auto">
      <BreadCrums product={product}/>
      <div className="mt-10 grid grid-cols-2 items-start">
        <ProductImg images={product?.productImg}/>
        <ProductDesc product={product}/>
         <div className="col-span-2">
    <ProductDes product={product}/>
  </div>
        
      </div>
    </div>
    </div>
  )
}

export default SingleProducts
