import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/ui/Navbar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import ForgetPass from "./pages/ForgetPass";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "./redux/userSlice";
import { setCart } from "./redux/productSlice";
import { setProducts } from "./redux/productSlice";
import axios from "axios";
import AdminSales from "./pages/admin/AdminSales";
import AddProducts from "./pages/admin/AddProducts";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import SingleProducts from "./pages/SingleProducts";
import Addresss from "./pages/Addresss";
import Order from "./pages/Order";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        {" "}
        <Navbar /> <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgetPass />,
  },
  {
    path: "/products",
    element: (
      <>
        {" "}
        <Navbar /> <Products />
      </>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <>
        {" "}
        <Navbar /> <SingleProducts />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        {" "}
        <Navbar /> <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/addresss",
    element: (
      <>
        <Navbar /> <Addresss />{" "}
      </>
    ),
  },
  {
    path: "/order-success",
    element: (
      <>
        <Navbar /> <Order/>{" "}
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Navbar />
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "sales",
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProducts />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },
    ],
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) return;

        dispatch(setToken(token));

        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/get-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        dispatch(setUser(data.user));

        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/v1/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.cart) {
          dispatch(setCart(response.data.cart.items));
        }
      } catch (error) {
        console.log("Cart Error:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/product/get-all",
        );

        if (response.data.success) {
          dispatch(setProducts(response.data.products));
        }
      } catch (error) {
        console.log("Products Error:", error);
      }
    };

    fetchUser();
    fetchCart();
    fetchProducts();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
