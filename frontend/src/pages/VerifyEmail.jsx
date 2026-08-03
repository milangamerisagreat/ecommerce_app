import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
         const response = await axios.post(`http://localhost:5000/api/v1/user/verify`,{},{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setStatus("✅ Email verified Successfully!");
          setTimeout(() => {
            navigate("/login");
          },2000);
        }
    } catch (error) {
      console.log(error);
      setStatus(" ❌ Verification failed. Please try again.");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);
  

  return (
    <div className="relative w-full h-full bg-[#75bb76] overflow-hidden ">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#ffffff] p-8 rounded-lg shadow-2xl w-[90%] max-w-md text-center">
          <h2 className="text-xl font-semibold text-[#000000] mb-0">{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;