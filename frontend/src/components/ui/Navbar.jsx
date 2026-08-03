import React from 'react'
import { useState } from "react";
import logo from '../../assets/logo4.png'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import {Button} from './Button'
import axios from 'axios'
import { useDispatch , useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const user = useSelector((state) => state.user.user);
  const admin = user?.role === "admin" ? true : false
  const {cart} = useSelector(store=>store.product )
  

  const loginHandler = () => {
    setTimeout(() => {
      navigate(`/login`);
    }, 500);
  }

  const token = localStorage.getItem("accessToken");
  
const handleConfirmLogout = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    console.log("TOKEN:", token);

    if (token) {
      await axios.post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(setUser(null));

      setShowModal(false);
      navigate("/", { replace: true });
    }
  } catch (error) {
    const message = error?.response?.data?.message;

    if (
      message === "Token expired" ||
      message === "Invalid token" ||
      error?.response?.status === 401
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      dispatch(setUser(null));

      navigate("/", { replace: true });
    } else {
      console.log(error?.response?.data || error.message);
    }
  } finally {
    setLoading(false);
  }
};


const handleCancel = () => {
  setShowModal(false);
};

  return (
    <>
    <header className="bg-linear-to-l from-[#d3ffc6f6] to-[#8e99ff] w-full fixed top-0 z-20 border-b border-[#424242]">
      <div className="w-full flex items-center justify-between px-6">
  
  {/* logo */}
  <div>
    <img src={logo} alt="logo" className="w-17.5 h-15 " />
  </div>

  {/* nav content center aligned */}
  <nav className="flex gap-10 justify-between items-center pr-14">
         <ul className="flex gap-7 items-center text-xl font-bold text-[#000000] ">
           <Link className="hover:text-[#222222] hover:underline" to="/"><li>
            Home
            </li></Link>

            <Link className="hover:text-[#222222] hover:underline font-bold"  to="/products"><li>
            Products
            </li></Link>
           {
            user && <Link className="hover:text-[#222222] hover:underline" to="/profile"><li> Hello {user.firstName} </li></Link>
           }
           {
            admin && <Link className="hover:text-[#222222] hover:underline" to="/dashboard/sales"><li>Dashboard</li></Link>
           }

         </ul>
         <Link to="/cart" className="relative ">
           <ShoppingCart />
            <span className="bg-[#e760b3] rounded-full absolute text-[#ffffff] -top-3 -right-5 px-2">
              {cart?.length || 0}
            </span>
           
         </Link>
         {
          user ? <Button onClick={() => setShowModal(true)} className="bg-[#e24ba8] hover:bg-[#c04080] text-[#ffffff] cursor-pointer"> {loading ? "Logging out..." : "Logout"}</Button> : <Button onClick={loginHandler} className=" bg-linear-to-tl from-[#2600ff] to-[#ff0080] hover:from-[#2d2ab9] hover:to-[#af3271] text-[#ffffff] cursor-pointer ">Login</Button>
         }
       </nav>


</div>
    </header>

    {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      onClick={handleCancel}
    ></div>

    <div className="relative bg-white border border-green-200 rounded-2xl shadow-xl w-[90%] max-w-sm p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-2">
        Confirm Logout
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to logout from your account?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmLogout}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  </div>
  
)}
</>
    
  )
}

export default Navbar
