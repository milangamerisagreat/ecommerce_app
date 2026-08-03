import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";

const Cart = () => {
  const cart = useSelector((store) => store.product.cart);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = totalPrice > 299 ? 0 : 10;
  const tax = totalPrice * 0.05; // 5%
  const total = totalPrice + shipping + tax;
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const API = "http://localhost:5000/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update` , {productId, type},{
        headers: {
          Authorization:`Bearer ${accessToken}`
        }
      })

      if(res.data.success) {
        dispatch(setCart(res.data.cart.items))
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemove = async (productId) => {
  try {
    const res = await axios.delete(`${API}/remove`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        productId,
      },
    });

    if (res.data.success) {
      dispatch(setCart(res.data.cart.items));
      toast.success("product removed from cart");
    }
  } catch (error) {
   
    console.log(error);
  }
};

  return (
    <div className="pt-20 bg-[#00ff0d31] min-h-screen">
      {cart?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#303030] mb-7">
            {" "}
            Shopping Cart{" "}
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.map((product, index) => {
                return (
                  <Card className="bg-[#ffffffb2]" key={index}>
                    <div className="flex items-center justify-between gap-6 p-4 ">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <img
                          src={product?.productId?.productImg?.[0].url}
                          alt="phone"
                          className="w-35 h-30"
                        />
                        <div className="flex-1 w-60">
                          <h1 className="font-semibold truncate">
                            {product?.productId?.productName}
                          </h1>
                          <p>₹{product?.productId?.productPrice}</p>
                        </div>
                      </div>
                      <div className="flex gap-5 items-center ">
                        <Button onClick={()=>handleUpdateQuantity(product.productId._id , 'decrease')}>-</Button>
                        <span>{product.quantity}</span>
                        <Button onClick={()=>handleUpdateQuantity(product.productId._id , 'increase')}>+</Button>
                      </div>
                      <p>
                        ₹
                        {product?.productId?.productPrice *
                          product?.quantity}{" "}
                      </p>
                      <p onClick={()=>handleRemove(product?.productId?._id)} className="flex text-[#c0150c] items-center gap-1 cursor-pointer">
                        <Trash2 className="w-4 h-4 " />
                        Remove
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div>
              <Card className="w-100 bg-[#ffffffc0]">
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 ">
                  <div className="flex justify-between ">
                    <span> Subtotal ({cart?.length} items )</span>
                    <span>₹{totalPrice.toLocaleString(`en-IN`)}</span>
                  </div>

                  <div className="flex justify-between ">
                    <span> Shipping </span>
                    <span> ₹{shipping} </span>
                  </div>

                  <div className="flex justify-between ">
                    <span> Tax(%5) </span>
                    <span> ₹{tax.toFixed(2)} </span>
                  </div>
                 
                  <Separator/>

                  <div className="flex justify-between font-bold text-lg">
                    <span> Total </span>
                    <span> ₹{total} </span>
                  </div>

                  <div className="space-y-3 pt-4 ">
                    <div className="flex space-x-2">
                     <Input placeholder="Promo code"/>
                     <Button className="hover:cursor-pointer"> Apply </Button>
                    </div>
                    <Button onClick={()=>navigate('/addresss')} className="w-full hover:bg-[#0c722e] hover:cursor-pointer mt-3 py-5"> PLACE ORDER </Button>
                    <Button variant='outline' className="w-full bg-transparent border px-6 border-[#000000]"> <Link to="/products">Continue Shopping</Link> </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground pt-4 ">
                   <p> * Free shipping on orders over 299 </p>
                   <p> * 30-days return policy</p>
                   <p> * Secure checkout with SSL encryption</p>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text=center">
           {/* icon */}
           <div className="bg-[#1ebd2b2a] p-6 rounded-full ">
            <ShoppingCart className="w-16 h-16 text-[#00ff0881]"/>
           </div>
           {/* title */}
           <h2 className="mt-6 text-2xl font-bold">Your Cart is Empty !</h2>
           <p className="mt-2 "> Looks like you haven't added anything to your cart yet !</p>
           <Button onClick={()=>navigate("/products")} className="hover:cursor-pointer mt-6 bg-[#008100] rounded-xl hover:bg-[#00970d]"> Start Shopping </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
