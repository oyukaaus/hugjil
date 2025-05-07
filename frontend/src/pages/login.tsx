// LoginPage.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";  // Import useAuth hook

const LoginPage = () => {
  const { login } = useAuth();  // Get login function from context
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Phone input, Step 2: OTP input
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = async () => {
    if (phone) {
      // const res = await fetch(`https://sms-api.telcocom.mn/sms-api/v1/sms/telco/send?tenantId=637ca1f1e6223943ac10384e&toNumber=${phone}&sms=TEXT`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${process.env.telco_auth_token}`,
      //   },
      // });
      // console.log("res: ", res)
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setStep(2); // Move to OTP input step
      } else {
        // Handle error (e.g., display message)
      }
    }
  };

  const handleOtpSubmit = async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      // Use the context to handle login
      login(data.userId);  // Persist the user ID and set authentication state in context
      localStorage.setItem("phone", phone);
      // Navigate to chat
      router.push("/chat");
    } else {
      // handle error
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Logo and Tagline */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-700">Login with OTP</p>
        </div>

        {/* Step 1: Phone Number Input */}
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
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              Send OTP
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
                placeholder="Enter OTP"
                className="w-full p-4 bg-gray-100 border rounded-md"
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
