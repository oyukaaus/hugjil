// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  sendOTP: (phone: string) => void;
  verifyOTP: (otp: string) => void;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  const sendOTP = (phone: string) => {
    // Simulate sending an OTP (in real scenarios, integrate with an API)
    console.log(`OTP sent to ${phone}`);
    setPhoneNumber(phone); // Store phone number temporarily
  };

  const verifyOTP = (otp: string) => {
    // Simulate OTP verification
    if (otp === "123456") {
      setIsAuthenticated(true);
      console.log("OTP verified!");
    } else {
      console.log("Invalid OTP");
    }
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, phoneNumber, sendOTP, verifyOTP, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
