import { Input } from "@/components/ui/input";
import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import user from "../../assets/user.jpg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase()) ||
      user.email.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase),
  );

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/user/get-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className=" bg-[#15ff0041] p-20  min-h-screen ">
      <div className="flex relative p-5 mt-3 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl rounded-xl">
        <Search className="absolute ml-69 text-[#000000cc] top-7" size={17} />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-[#000000af] w-75"
          placeholder="Search User..."
        />
      </div>
      <div className="grid grid-cols-3 gap-7 mt-7">
        {filteredUsers.map((user, index) => {
          return (
            <div
              key={index}
              className="p-5 rounded-lg mt-5 bg-linear-to-br from-[#53ff0f62] to-[#4444442f] backdrop-blur-2xl border border-[#0000003b] shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user?.profilepic || user}
                  alt=""
                  className="rounded-full w-16 aspect-square object-cover border border-[#000000]"
                />
                <div className="w-full">
                  <h1 className="font-bold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <h3>{user?.email}</h3>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <Button
                  onClick={() =>
                    navigate(`/dashboard/users/${user._id}`, {
                      state: { user },
                    })
                  }
                >
                  <Edit />
                  Edit
                </Button>
                <Button onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)}>
                  <Eye />
                  Show Order
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
