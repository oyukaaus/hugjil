// LoginPage.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { sendOTP, verifyOTP } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = async () => {
    const success = await sendOTP(phone);
    if (success) {
      setStep(2);
    } else {
      alert("OTP илгээхэд алдаа гарлаа");
    }
  };

  const handleOtpSubmit = async () => {
    const success = await verifyOTP(otp);
    console.log("success: ", success)
    if (success) {
      router.push("/chat");
    } else {
      // alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-700">Нэвтрэх</p>
        </div>

        {step === 1 && (
          <>
            <div className="mb-6">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full p-4 bg-gray-100 border rounded-md"
              />
            </div>
            <button
              onClick={handlePhoneSubmit}
              className="w-full py-3 bg-[#6f42c1] text-white rounded-md"
            >
               OTP илгээх
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-4 bg-gray-100 border rounded-md"
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              OTP баталгаажуулах
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
