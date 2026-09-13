import OrderCard from "@/components/ui/OrderCard";
import api from "@/lib/api";
import axios from "axios";
import React, { useEffect, useState } from "react";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState();
  const accessToken = localStorage.getItem("accessToken");

  const getUserOrders = async () => {
    try {
      const res = await api.get(
        `/order/myorder`,
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
