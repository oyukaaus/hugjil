// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  sendOTP: (phone: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedPhone = localStorage.getItem('phone');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (storedPhone) setPhoneNumber(storedPhone);
    }
  }, []);

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setPhoneNumber(phone);
        return true;
      }
      return false;
    } catch (error) {
      console.error("sendOTP error:", error);
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    if (!phoneNumber) return false;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      });

      const data = await res.json();
      if (data.message && data.user.id) {
        login(data.user.id);
        localStorage.setItem("phone", phoneNumber);
        return true;
      }
      return false;
    } catch (error) {
      console.error("verifyOTP error:", error);
      return false;
    }
  };

  const login = (userId: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("phone");
    localStorage.removeItem("userId");
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
