import React from 'react'

const ProductDes = ({product}) => {

  return (
    <div>
      <div
      className="
       w-full
       mt-25
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
      <h2 className="text-2xl font-bold mb-5">
        Product Description
      </h2>

      <div className="space-y-4">
  {product?.productDesc
    ?.split("•")
    .filter(item => item.trim() !== "")
    .map((item, index) => (
      <div key={index} className="flex gap-3">
        <span className="text-lg font-bold">•</span>
        <p className="text-[#000000] font-semibold leading-8">
          {item.trim()}
        </p>
      </div>
    ))}
</div>
    </div>
    </div>
  )
}

export default ProductDes
