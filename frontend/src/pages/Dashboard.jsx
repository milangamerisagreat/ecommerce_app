import Sidebar from "@/components/ui/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="ml-75 min-h-screen flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;