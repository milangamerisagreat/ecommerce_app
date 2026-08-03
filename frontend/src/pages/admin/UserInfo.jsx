import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const UserInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const location = useLocation();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipcode: "",
    role: "",
    profilepic: "",
  });

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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("address", formData.address);
      form.append("city", formData.city);
      form.append("zipcode", formData.zipcode);
      form.append("role", formData.role);

      if (formData.profilepic) {
        form.append("profilepic", formData.profilepic);
      }

      const { data } = await axios.put(
        `http://localhost:5000/api/v1/user/admin/update-user/${user._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      setPreview(data.user.profilepic);

      setFormData((prev) => ({
        ...prev,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        address: data.user.address,
        city: data.user.city,
        zipcode: data.user.zipcode,
        role: data.user.role,
        profilepic: data.user.profilepic,
      }));

      toast.success("Profile Updated");
      navigate(-1);
    } catch (error) {
      console.log(error);
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
        role: user.role || "",
        profilepic: user.profilepic || "",
      });
    }
  }, [user]);

  return (
    <div className="bg-[#15ff0041] p-20  min-h-screen">
      <div className="max-w-10xl">
        <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl rounded-xl">
          <div className="flex justify-between gap-10">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold text-2xl mb-6">Update Profile</h1>
          </div>
          <div>
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

                <div className="space-y-2">
                  <Label>Address</Label>

                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter Address"
                  />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>

                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Zip Code</Label>

                  <Input
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    placeholder="Enter Zip Code"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <Button className="rounded-xl px-6" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
