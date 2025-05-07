import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { useRouter } from "next/router";
import { AiOutlineMenu } from "react-icons/ai"; // Menu icon

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { pathname } = useRouter();

  // Toggle the visibility of the MobileSidebar
  const toggleComponentVisibility = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  // Detect screen size (mobile or not)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // If the width is less than 768px, it's considered mobile
    };

    handleResize(); // Initial check on component mount
    window.addEventListener("resize", handleResize); // Recheck on window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup the event listener on unmount
    };
  }, []);

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      {/* Mobile Menu Icon */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={toggleComponentVisibility}
            className="text-white p-2 rounded-full bg-[#6f42c1] hover:bg-none focus:outline-none"
          >
            <AiOutlineMenu className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Show MobileSidebar if on mobile device and visible */}
      {isMobile && isComponentVisible ? (
        <MobileSidebar toggleComponentVisibility={toggleComponentVisibility} />
      ) : null}

      {/* Desktop Sidebar */}
      <div className="dark hidden flex-shrink-0 bg-gray-900 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
