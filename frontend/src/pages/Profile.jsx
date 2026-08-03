import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Address from "@/components/ui/Address";
import MyOrder from "@/pages/MyOrder";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "profile",
  );
  const [securityView, setSecurityView] = useState(() => {
    return localStorage.getItem("securityView") || "main";
  });
  const user = useSelector((state) => state.user.user);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipcode: "",
    phoneNo: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);

      if (formData.profilepic) {
        form.append("profilepic", formData.profilepic);
      }

      const { data } = await axios.put(
        "http://localhost:5000/api/v1/user/update-profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      dispatch(setUser(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));

      setPreview(data.user.profilepic);

      setFormData((prev) => ({
        ...prev,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        profilepic: file,
      }));
    }
  };

  const handleForgotPassword = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/forgot-password",
        {
          email: user.email,
        },
      );

      toast.success(data.message);

      localStorage.removeItem("otpVerified");

      localStorage.setItem("otpExpiry", Date.now() + 2 * 60 * 1000);

      navigate("/forgot-password", {
        state: {
          email: user.email,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/v1/user/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      toast.success(data.message);

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        zipcode: user.zipcode || "",
        phoneNo: user.phoneNo || "",
        profilepic: user.profilepic || "",
      });
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("securityView", securityView);
  }, [securityView]);

  return (
    <div className="pt-15">
      <div className="min-h-screen bg-[#2bff004f] flex justify-center pt-16 px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-md border
    
    ${
      activeTab === "profile"
        ? "bg-white/40 border-white/40 text-black shadow-lg"
        : "bg-white/10 border-white/20 text-gray-700 hover:bg-white/20"
    }
            `}
            >
              Profile
            </button>

            <button
              onClick={() => setActiveTab("address")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-md border
    
    ${
      activeTab === "address"
        ? "bg-white/40 border-white/40 text-black shadow-lg"
        : "bg-white/10 border-white/20 text-gray-700 hover:bg-white/20"
    }
  `}
            >
              Address
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-md border
    
    ${
      activeTab === "orders"
        ? "bg-white/40 border-white/40 text-black shadow-lg"
        : "bg-white/10 border-white/20 text-gray-700 hover:bg-white/20"
    }
            `}
            >
              Orders
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-md border
    
    ${
      activeTab === "security"
        ? "bg-white/40 border-white/40 text-black shadow-lg"
        : "bg-white/10 border-white/20 text-gray-700 hover:bg-white/20"
    }
  `}
            >
              Security
            </button>
          </div>

          {activeTab === "profile" && (
            <form
              className="bg-white rounded-3xl border shadow-sm p-8"
              onSubmit={handleProfileUpdate}
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                    <img
                      src={
                        preview ||
                        user?.profilepic ||
                        "https://placehold.co/200x200/png"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-semibold">Account</h1>

                <p className="text-gray-500 mt-2 leading-6">
                  Make changes to your account here. Click save when you're
                  done.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="space-y-2">
                  <Label>First Name</Label>

                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Last Name</Label>

                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>

                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <Button className="rounded-xl px-6" type="submit">
                  Save changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === "orders" && <MyOrder />}

          {activeTab === "security" && (
            <>
              {securityView === "main" && (
                <div className="bg-white rounded-3xl border shadow-sm p-8">
                  <h1 className="text-2xl font-semibold">Security</h1>

                  <p className="text-gray-500 mt-2 leading-6">
                    Manage your password and security settings.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="border rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold">Change Password</h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Update your account password
                        </p>
                      </div>

                      <Button onClick={() => setSecurityView("changePassword")}>
                        Manage
                      </Button>
                    </div>

                    <div className="border rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold">Payment Methods</h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Manage your saved cards
                        </p>
                      </div>

                      <Button>Manage</Button>
                    </div>
                  </div>
                </div>
              )}

              {securityView === "changePassword" && (
                <div className="bg-white rounded-3xl border shadow-sm p-8">
                  <h1 className="text-2xl font-semibold">Change Password</h1>

                  <p className="text-gray-500 mt-2">
                    Update your account password
                  </p>

                  <div className="mt-8 space-y-6">
                    <div className="space-y-2">
                      <Label>Old Password</Label>

                      <Input
                        type="password"
                        name="oldPassword"
                        placeholder="Enter old password"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>New Password</Label>

                      <Input
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm Password</Label>

                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Forgot Password?
                    </button>

                    <div className="flex gap-3">
                      <Button onClick={handleChangePassword}>
                        Save Password
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setSecurityView("main")}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "address" && <Address user={user} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
