import React from 'react'
import { Truck, ShieldCheck, Headphones } from "lucide-react";

const Features = () => {
    const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      description: "100% secure transactions",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
   <div className="w-full border-t border-b bg-[#b5f3d198] mx-1 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-3"
            >
              {/* Bigger Icon */}
              <div className={`p-4 rounded-full ${item.color}`}>
                <Icon className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Features
