import React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {toast} from "sonner"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setCart} from "@/redux/productSlice"


const ProductCard = ({ product, loading }) => {
  const { productImg, productName, productPrice } = product;
  const accessToken = localStorage.getItem(`accessToken`)
  const dispatch = useDispatch() 
  const navigate = useNavigate()

  const addToCart = async (productId) => {
    try {
        const response = await axios.post("http://localhost:5000/api/v1/cart/add",{productId}, {
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.data.success){
            toast.success("product added to cart")
            dispatch(setCart(response.data.cart.items))
            
        }
    } catch (error) {
     console.error(error)
    }
  } 
 
  return (
    <div className=" shadow-lg rounded-lg overflow-hidden bg-[#ffffffbb] hover:shadow-xl transition-transform duration-300 hover:scale-102 w-70">
      <div className="w-full h-45  overflow-hidden  ">
        {
          loading ? <Skeleton className="w-full h-full rounded-lg" />:<img
          src={productImg[0]?.url}
          alt={productName}
          className="w-full h-full object-contain  "
        />
        }
        
      </div>
      {
          loading ? <div className="px-2 space-y-1 my-2 "> 
          <Skeleton className="w-3 h-4  " />
          <Skeleton className="w-3 h-4  " />
          <Skeleton className="w-4 h-8  " />
           </div> : <div className="px-2 space-y-1 ">
        <h1 className="font-semibold h-12 line-clamp-2 "> {productName} </h1>
        <h1 className="font-bold"> ₹{productPrice} </h1>
        <Button onClick={() => addToCart(product._id)} className="w-full mb-2 hover:bg-[#128555] hover:text-white transition-colors duration-300 cursor-pointer ">
          <ShoppingCart className="mr-2" size={18} />
          Add to Cart
        </Button>

        <Button onClick={()=>navigate(`/products/${product._id}`)} className="w-full mb-2 hover:bg-[#128555] hover:text-white transition-colors duration-300 cursor-pointer ">
          Buy Now
        </Button>

      </div>
      }
    
      
    </div>
  );
};

export default ProductCard;
