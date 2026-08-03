import React from "react";

const Verify = () => {
  return (
    <div className="relative w-full h-full overflow-hidden ">
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#90c97d] to-[#85e2ac]">
        <div className="bg-[#ffffff] p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-[#000000] mb-0">✅ check your Email</h2>
            <p className="text-[#000000] mt-2 mb-6">We have sent you a verification email. Please check your inbox and click the link to verify your account.</p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
