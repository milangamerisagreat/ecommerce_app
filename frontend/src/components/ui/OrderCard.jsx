import React from 'react'
import { useNavigate } from 'react-router-dom'


const OrderCard = ({userOrder}) => {
    const navigate= useNavigate()
  return (
   <div className="pr-2 flex flex-col gap-3 bg-[#ffffffff] rounded-3xl border shadow-sm">
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Users Orders</h1>
        </div>
        {userOrder?.length === 0 ? (
          <p className="space-y-6 text-2xl ">No Orders found for this user</p>
        ) : (
          <div className="space-y-6">
            {userOrder?.map((order) => (
              <div key={order._id} className="bg-[#71ce8d2c] border border-[#000000] p-3 rounded-2xl">
                <div className="flex justify-between items-center mb-4 gap-">
                  <h2 className="text-lg font-semibold">
                    Order ID: {" "}
                    <span>{order._id}</span>
                  </h2>
                  <p className="font-semibold">
                    Amount: {" "}
                    <span>{order.currency} {order.amount.toFixed(2)}</span>
                  </p>
                </div>
                
                {/* User Info */}
                <div className="flex justify-between items-center">
                  <div className="mb-4">
                    <p className="font-bold">
                      <span className="font=medium">User: </span> {""}
                      {order.user?.firstName || "Unkonown"} {order.user?.lastName || "Unkonown"}
                    </p>
                    <p className="font-semibold">
                      Email : {order.user?.email || "N/A"} 
                    </p>
                  </div>
                  <span className={`p-1 rounded-lg border border-[#00000093] font-semibold ${order?.status === "Paid" ? "bg-[#00ff4062]" : order?.status === "Failed" ? "bg-[#b62d2dab]" : "bg-[#ff000065]"}`}>{order.status}</span>
                </div>

                {/* Products */}
                <div className="bg-[#ffffffff] rounded-lg border border-[#00000075] p-1 mb-1">
                  <h3 className="font-medium mb-2">Products : </h3>
                  <ul className="space-y-2">
                    {
                      order.products.map((product, index)=>(
                        <li key={index} className="flex justify-between items-center">
                          <img onClick={()=>navigate(`/products/${product?.productId?._id}`)} className="w-16 cursor-pointer" src={product?.productId?.productImg?.[0].url} alt="" />
                          <span className="line-clamp-2">{product?.productId?.productName}</span>
                          <span>{product?.productId?._id}</span>
                          <span className="font-medium">
                             ₹{product?.productId?.productPrice}
                          </span>
                        </li>
                      ))
                    }
                  </ul>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCard
