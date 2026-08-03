import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/order/all",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch admin Orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return <div className="text-center py-20">Loading all Orders....</div>;
  }

  return (
    <div className="mt-15 bg-[#15ff0041] w-full min-h-screen p-15">
      <div className="pr-2 flex flex-col gap-3 bg-[#ffffffff] rounded-3xl border shadow-sm">
        <div className="w-full p-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-semibold">Admin - All Orders</h1>
          </div>
          {orders?.length === 0 ? (
            <p className="space-y-6 text-2xl ">No Orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-[#777575] text-left text-sm">
                <thead className="bg-[#918e8e36]">
                  <tr>
                    <th className="px-4 py-2 border">Order ID</th>
                    <th className="px-4 py-2 border">User</th>
                    <th className="px-4 py-2 border">Products</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order._id} className="hover:bg-[#6d6d6d2d]">
                      <td className="px-4 py-2 border">{order._id}</td>
                      <td className="px-4 py-2 border">
                        {order?.user?.firstName} {order?.user?.lastName} <br />{" "}
                        <span className="text-xs text-[#575757]">
                          {order?.user?.email}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        {order.products.map((p, idx) => (
                          <div key={idx}>
                            <p className="font-medium">
                              {p.productId?.productName}
                            </p>

                            <p className="text-xs text-gray-600">
                              Qty : {p.quantity}
                            </p>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2 border font-semibold">
                        {" "}
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2 border">
                        <span
                          className={`p-1 rounded-lg border border-[#0000003d] font-semibold ${order?.status === "Paid" ? "bg-[#00ff4042]" : order?.status === "Failed" ? "bg-[#b62d2dab]" : "bg-[#ff000065]"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
