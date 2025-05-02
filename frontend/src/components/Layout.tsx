// components/Layout.tsx
import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { useRouter } from "next/router"; // To dynamically hide sidebar on certain pages if needed

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const { pathname } = useRouter();

  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      {/* Show MobileSidebar based on state */}
      {isComponentVisible ? (
        <MobileSidebar toggleComponentVisibility={toggleComponentVisibility} />
      ) : null}

      {/* Desktop Sidebar */}
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
