import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddresses,
  setSelectedAddress,
  deleteAddress,
  setCart
} from "@/redux/productSlice";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Addresss = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );

  const [showForm, setShowForm] = useState(addresses.length > 0 ? false : true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const newAddresses = [...addresses, formData];

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/addresses",
        {
          addresses: newAddresses,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (data.success) {
        dispatch(setAddresses(data.addresses));
        toast.success("Address added successfully");
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/v1/user/delete-address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (data.success) {
        dispatch(setAddresses(data.addresses));

        toast.success("Address deleted successfully");

        if (data.addresses.length === 0) {
          setShowForm(true);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete address");
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/get-addresses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (data.success) {
          dispatch(setAddresses(data.addresses));
          setShowForm(data.addresses.length === 0);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAddresses();
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/order/create-order`,
        {
          products: cart?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (!data.success) {
        toast.error("something went wrong ");
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        order_id: data.razorpayOrder.id,
        name: "Ecommerce",
        description: "Test Transaction",
        handler: async function (response) {
          try {
            const verifyres = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/order/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            );

            if (verifyres.data.success) {
              toast.success("Payment successful");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment verification failed");
          }
        },
        modal: {
          onDismiss: async function () {
            //handle  user closing the payment modal
            await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/order/verify-payment`,
              {
                razorpay_order_id: null,
                paymentFailed: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            );
            toast.error("Payment failed or cancelled");
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#65FE08",
        },
      };
      
      const rzp = new window.Razorpay(options);

      //listen for payment failure
      rzp.on("payment.failed", async function (response) {
        await axios.post(
          `${import.meta.env.VITE_URL}/api/v1/order/verify-payment}`,
          {
            razorpay_order_id: null,
            paymentFailed: true,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        toast.error("Payment Failed. plese try agian");
      });

      rzp.open();
    } catch (error) {
      console.log(error);
       console.log(error.response);
    console.log(error.response?.data);
      toast.error("Payment failed");
    }
  };

  return (
    <div className=" bg-[#15ff0041] min-h-screen w-screen flex justify-start items-center mt-10">
      <div className="grid grid-cols-2 md:grid-cols-2 items-center gap-150 mt-10 w-200 ml-80">
        <div className="space-y-4 p-6 w-110 border border-[#00000038] rounded-xl bg-[#ffffffd5]">
          {showForm ? (
            <>
              <div className="grid gap-2">
                <Label className="font-bold" htmlFor="fullName">
                  Full Name :
                </Label>
                <Input
                  className="border border-[#00000075]"
                  id="fullName"
                  name="fullName"
                  placeholder="EX - John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold" htmlFor="phone">
                  Phone Number :
                </Label>
                <Input
                  className="border border-[#00000075]"
                  id="phone"
                  name="phone"
                  placeholder="EX - +91 9945353411"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold" htmlFor="email">
                  Email :
                </Label>
                <Input
                  className="border border-[#00000075]"
                  id="email"
                  name="email"
                  placeholder="EX - John@Doe.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label className="font-bold" htmlFor="address">
                  Address :
                </Label>
                <Input
                  className="border border-[#00000075]"
                  id="address"
                  name="address"
                  placeholder="EX - 123 Main St"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold" htmlFor="city">
                    City :
                  </Label>
                  <Input
                    className="border border-[#00000075]"
                    id="city"
                    name="city"
                    placeholder="EX - Ahmedabad"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold" htmlFor="state">
                    State :
                  </Label>
                  <Input
                    className="border border-[#00000075]"
                    id="state"
                    name="state"
                    placeholder="EX - Gujarat"
                    required
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold" htmlFor="zip">
                    Zip Code :
                  </Label>
                  <Input
                    className="border border-[#00000075]"
                    id="zip"
                    name="zip"
                    placeholder="EX - 10001"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold" htmlFor="country">
                    Country :
                  </Label>
                  <Input
                    className="border border-[#00000075]"
                    id="country"
                    name="country"
                    placeholder="EX - india"
                    required
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Address
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((addr, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => dispatch(setSelectedAddress(addr))}
                    className={`w-100 border p-4 rounded-2xl cursor-pointer relative ${selectedAddress === addr ? "border-[#2bff00] bg-[#62ff3b3d]" : "border-[#000000]"}`}
                  >
                    <p className="font-bold">{addr.fullName}</p>
                    <p className="font-medium">{addr.phone}</p>
                    <p className="font-medium">{addr.email}</p>
                    <p className="font-medium">{addr.address}</p>
                    <p className="font-medium">
                      {addr.city},{addr.state},{addr.zip},{addr.country}
                    </p>
                    <Button
                      onClick={() => handleDelete(addr._id)}
                      className="absolute top-2 right-2 bg-transparent text-[#ff2828] cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                );
              })}
              <Button onClick={() => setShowForm(true)} className="w-full">
                Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>

        {/* Right side order summary  */}
        <div>
          <Card className="w-100 border border-[#0000003d] ">
            <CardHeader>
              <CardTitle className="font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">
                  Subtotal ({cart.length}) items
                </span>
                <span className="font-bold">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping</span>
                <span className="font-bold">
                  ₹{shipping.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tax</span>
                <span className="font-bold">
                  ₹{tax.toLocaleString("en-IN")}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-sm text-muted-foreground pt-4">
                <p> * Free shipping on orders over 299 </p>
                <p> * 30-days return policy</p>
                <p> * Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Addresss;
