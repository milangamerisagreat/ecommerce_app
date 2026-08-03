import React from 'react'
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Order = () => {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#b9f3a7] via-[#d8ffd1] to-[#c7f5b8] flex items-center justify-center px-6">

      {/* Background Blur Circles */}
      <div className="absolute w-80 h-80 bg-[#74d94c]/20 rounded-full blur-[120px] top-10 left-20"></div>
      <div className="absolute w-96 h-96 bg-[#9be86a]/20 rounded-full blur-[140px] bottom-10 right-20"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/30 bg-white/20 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] overflow-hidden">

        {/* Top Gradient */}
        <div className="h-2 w-full bg-linear-to-r from-lime-400 via-green-500 to-lime-300"></div>

        <div className="p-10 flex flex-col items-center text-center">

          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-lime-500/20 flex items-center justify-center border border-lime-400/40 shadow-lg">
            <CheckCircle2
              size={60}
              className="text-lime-600"
              strokeWidth={2.5}
            />
          </div>

          <h1 className="text-4xl font-extrabold text-[#183A16] mt-6">
            Order Placed!
          </h1>

          <p className="mt-4 text-[#365235] text-lg leading-relaxed max-w-md">
            Thank you for shopping with us. Your order has been placed
            successfully and is being processed.
          </p>

          <div className="mt-8 w-full space-y-4">

            <Button
              onClick={() => navigate("/")}
              className="w-full h-12 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-semibold text-base transition-all duration-300"
            >
              Continue Shopping
            </Button>

            <Button
              variant="outline"
              onClick={()=> navigate("/profile")}
              className="w-full h-12 rounded-xl border-lime-600 bg-white/30 backdrop-blur-md text-lime-800 hover:bg-lime-600 hover:text-white transition-all duration-300"
            >
              View My Orders
            </Button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Order
