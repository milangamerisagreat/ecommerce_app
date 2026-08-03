import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({images}) => {
  
  if (!images?.length) {
  return <div>Loading...</div>
}

  const [mainImg, setMainImg] = useState(images?.[0]?.url || "")
  
  return (
    <div className="flex gap-5 w-max">
      <div className="gap-5 flex flex-col">
        {
          images.map((img)=>{
            return <img onClick={()=>setMainImg(img.url)} src={img.url} alt="" className="hover:cursor-pointer w-20 h-20 border border-[#72727280] shadow-lg "/>
          })
        }
      </div>
      <Zoom>
      <div className="w-125 h-125 border border-[#b1b0b08e] shadow-xl bg-[#f1faff] flex items-center justify-center">
    <img
      src={mainImg}
      alt=""
      className="w-full h-full object-contain"
    />
    </div>
    </Zoom>
    </div>
  )
}

export default ProductImg
