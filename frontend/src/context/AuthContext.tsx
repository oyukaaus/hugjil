// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  sendOTP: (phone: string) => void;
  verifyOTP: (otp: string) => void;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // Check localStorage on mount to determine if the user is authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const sendOTP = (phone: string) => {
    console.log(`OTP sent to ${phone}`);
    setPhoneNumber(phone); // Store phone number temporarily
  };

  const verifyOTP = (otp: string) => {
    if (otp === "123456") {
      setIsAuthenticated(true);
      console.log("OTP verified!");
    } else {
      console.log("Invalid OTP");
    }
  };

  const login = (userId: string) => {
    setIsAuthenticated(true);
    // Persist authentication state in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userId', userId);
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Remove authentication state from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('phone');
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
