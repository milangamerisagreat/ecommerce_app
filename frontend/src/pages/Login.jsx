import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/v1/user/login`,
        formData,
        {},
      );
      if (res.data.success) {
        toast.success(res.data.message);

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        dispatch(setUser(res.data.user));
        dispatch(setToken(res.data.accessToken));
        setTimeout(() => {
          navigate(`/`);
        }, 200);
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPasswordHandler = async () => {
    if (!formData.email) {
      return toast.error("Please enter email first");
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/forgot-password",
        {
          email: formData.email,
        },
      );

      toast.success(data.message);

      localStorage.setItem(
  "otpExpiry",
  Date.now() + 2 * 60 * 1000
);
localStorage.removeItem("otpVerified");
      navigate("/forgot-password", {
        state: {
          email: formData.email,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#537c44] to-[#57d88a]">
      <form onSubmit={submitHandler}>
        <Card className="w-full max-w-lg p-5 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription className="text-base font-semibold text-[#000000]">
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 h-[20%] text-base">
              <div className="grid gap-2 ">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative grid gap-2 ">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <FaEye
                    onClick={() => setShowPassword(false)}
                    className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => setShowPassword(true)}
                    className="w-5 h-5 text-gray-700 absolute right-5 bottom-2"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={forgotPasswordHandler}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 h-[20%]">
            <Button
              type="submit"
              className="w-full  bg-[#60b441] hover:bg-[#2bc45e] "
            >
              {loading ? (
                <>
                  <Loader2 className=" h-4 w-4 animate-spin mr-2" /> please
                  wait...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-[#353535] text-sm">
              not have an account?{" "}
              <Link
                to={"/signup"}
                className="text-[#0089fa] cursor-pointer hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Login;
