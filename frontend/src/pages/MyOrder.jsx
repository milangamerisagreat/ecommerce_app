import OrderCard from "@/components/ui/OrderCard";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState();
  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/order/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  
  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <>
     <OrderCard userOrder={userOrder}/>
    </>
  );
};

export default MyOrder;
