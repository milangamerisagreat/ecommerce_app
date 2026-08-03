import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ForgetPass = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {

  if (!email) {
    navigate("/login");
  }

}, []);

const [step, setStep] = useState(() => {

  return localStorage.getItem("otpVerified")
    ? 2
    : 1;
});
const [timeLeft, setTimeLeft] = useState(() => {

  const expiry = localStorage.getItem("otpExpiry");

  if (!expiry) return 0;

  const remaining = Math.floor(
    (Number(expiry) - Date.now()) / 1000
  );

  return remaining > 0 ? remaining : 0;

});
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;
useEffect(() => {

  if (timeLeft <= 0) return;

  const timer = setInterval(() => {

    setTimeLeft((prev) => prev - 1);

  }, 1000);

  return () => clearInterval(timer);

}, [timeLeft]);



const [formData, setFormData] = useState({
  otp: "",
  newPassword: "",
  confirmPassword: "",
});
const [showPassword, setShowPassword] = useState(false);

const handleChange = (e) => {

  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

};

const verifyOTP = async (e) => {

  e.preventDefault();
  if (timeLeft <= 0) {
  return toast.error("OTP expired");
}

  try {

    const { data } = await axios.post(
      `http://localhost:5000/api/v1/user/verify-otp/${email}`,
      {
        otp: formData.otp,
      }
    );

    toast.success(data.message);
    localStorage.setItem("otpVerified", "true");
    setStep(2);

  } catch (error) {

    toast.error(error.response?.data?.message);

  }

};

const resendOTP = async () => {

  try {

    const { data } = await axios.post(
      "http://localhost:5000/api/v1/user/forgot-password",
      {
        email,
      }
    );

    toast.success(data.message);

    const newExpiry = Date.now() + 2 * 60 * 1000;

    localStorage.setItem("otpExpiry", newExpiry);

    setTimeLeft(120);

  } catch (error) {

    toast.error(error.response?.data?.message);

  }

};

const resetPassword = async (e) => {

  e.preventDefault();

  try {

    const { data } = await axios.post(
      `http://localhost:5000/api/v1/user/reset-password/${email}`,
      {
        newPassword: formData.newPassword,
  confirmPassword: formData.confirmPassword,
      }
    );

    toast.success(data.message);

    localStorage.removeItem("otpVerified");

    localStorage.removeItem("otpExpiry");

    navigate("/login");

  } catch (error) {

    toast.error(error.response?.data?.message);

  }

};

  return (
    
      <div className="min-h-screen flex items-center justify-center bg-[#2bff0027]">

  {step === 1 && (

    <form
      onSubmit={verifyOTP}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
    >

      <h1 className="text-2xl font-bold mb-6">
        Verify OTP
      </h1>

      <div className="space-y-2">

        <Label>Enter OTP</Label>

        <Input
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="Enter OTP"
        />

      </div>
<p className="text-sm text-gray-500 mt-4">

  OTP expires in{" "}

  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}

</p>

{timeLeft <= 0 && (

  <button
    type="button"
    onClick={resendOTP}
    className="text-blue-500 text-sm mt-3 hover:underline"
  >
    Send OTP Again
  </button>

)}
      <Button
        type="submit"
        className="w-full mt-6"
      >
        Verify OTP
      </Button>

    </form>

  )}

  {step === 2 && (

  <form
    onSubmit={resetPassword}
    className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
  >

    <h1 className="text-2xl font-bold mb-6">
      Reset Password
    </h1>

    <div className="space-y-4">

      <div className="space-y-2">

        <Label>New Password</Label>

        <div className="space-y-2">

  

  <div className="relative">

    <Input
      type={showPassword ? "text" : "password"}
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
      placeholder="Enter new password"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    >

      {showPassword ? <FaEye /> : <FaEyeSlash />}

    </button>

  </div>

</div>
      </div>

      <div className="space-y-2">

        <Label>Confirm Password</Label>

        <Input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />

      </div>

    </div>

    <Button
      type="submit"
      className="w-full mt-6"
    >
      Reset Password
    </Button>

  </form>

)}

</div>
    
  )
}

export default ForgetPass
