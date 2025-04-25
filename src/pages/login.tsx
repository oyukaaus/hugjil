// pages/login.tsx
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1); // Step 1: Phone input, Step 2: OTP input
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = () => {
    if (phone) {
      sendOTP(phone);
      setStep(2); // Move to OTP input step
    }
  };

  const handleOtpSubmit = () => {
    verifyOTP(otp);
    if (isAuthenticated) {
      router.push("/new-chat"); // Redirect to the home page
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center items-center bg-login-image">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo and Tagline */}
        <div className="text-center mb-6">
          <img
            src="https://thumbs.dreamstime.com/b/minsk-belarus-openai-chatgpt-logo-artifical-chatbot-system-chat-bot-button-web-app-phone-icon-symbol-editorial-vector-273253289.jpg" // Replace with your logo image path
            alt="Logo"
            className="w-24 mx-auto mb-4"
          />
          <p className="text-lg font-semibold text-gray-700">
            Хөгжил
          </p>
        </div>

        {/* Step 1: Phone Number Input */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Утасны дугаар"
                className="w-full p-4 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handlePhoneSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              OTP илгээх
            </button>
          </>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP код"
                className="w-full p-4 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              OTP баталгаажуулах
            </button>
          </>
        )}

        {/* Registration Prompt */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Та бүртгэл үүсгэж амжсан уу?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline"
            >
              Бүртгүүлэх
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
