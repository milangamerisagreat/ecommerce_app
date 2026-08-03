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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try{
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/v1/user/register`, formData , {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if(res.data.success){
        toast.success(res.data.message);
        navigate('/verify');
        setTimeout(() => {
    navigate(`/verify-email/${res.data.token}`);
  }, 2400);
      }
      
    }
    
    catch(err){
  console.log(err.response?.data);
  toast.error(err.response?.data?.message);
} finally{
  setLoading(false);
}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#537c44] to-[#57d88a]" >
      <form onSubmit={submitHandler} >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 ">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} />
                </div>

                <div className="grid gap-2 ">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="grid gap-2">
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
                    placeholder="Create a password"
                    name="password"
                    type= {showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {showPassword ? <FaEye onClick={()=>setShowPassword(false)} className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" /> : 
                  <FaEyeSlash onClick={()=>setShowPassword(true)} className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" />}
                </div>
                
              </div>
            </div>
      
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={submitHandler} type="submit" className="w-full  bg-[#60b441] hover:bg-[#2bc45e] ">
           {loading? <><Loader2 className=" h-4 w-4 animate-spin mr-2"/> please wait...</> : "Sign Up"}
          </Button>
          <p className="text-[#353535] text-sm">
            Already have an account? <Link to={'/login'} className="text-[#0089fa] cursor-pointer hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
      </form>
    </div>
  );
};

export default SignUp;
