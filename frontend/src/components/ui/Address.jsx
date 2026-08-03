import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Address = ({ user }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    address: user?.address || "",
    city: user?.city || "",
    zipcode: user?.zipcode || "",
    phoneNo: user?.phoneNo || "",
    role: user?.role || "",
  });

  useEffect(() => {

  if (user) {

    setFormData({
      address: user?.address || "",
      city: user?.city || "",
      zipcode: user?.zipcode || "",
      phoneNo: user?.phoneNo || "",
      role: user?.role || "",
    });

  }

}, [user]);

  const handleAddressUpdate = async (
  e
) => {

  e.preventDefault();

  try {

    const { data } = await axios.put(
      "http://localhost:5000/api/v1/user/update-address",
      {
        address: formData.address,
        city: formData.city,
        zipcode: formData.zipcode,
        phoneNo: formData.phoneNo,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "accessToken"
          )}`,
        },
      }
    );

    dispatch(setUser(data.user));

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    console.log(data);

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

  return (

    <form
  className="bg-white rounded-3xl border shadow-sm p-8"
  onSubmit={handleAddressUpdate}
>

      <div>
        <h1 className="text-2xl font-semibold">
          Address Details
        </h1>

        <p className="text-gray-500 mt-2 leading-6">
          Manage your address and personal information.
        </p>
      </div>

      <div className="mt-8 space-y-6">

        <div className="space-y-2">
          <Label>Address</Label>

          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>City</Label>

          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Zip Code</Label>

          <Input
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>

          <Input
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Role</Label>

          <Input
            name="role"
            value={formData.role}
            disabled
          />
        </div>

        <Button type="submit">
          Save Changes
        </Button>

      </div>

    </form>
  );
};

export default Address;