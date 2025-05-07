import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiOutlineMessage, AiOutlinePlus, AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import axios from "axios";

const MobileSidebar = (props: any) => {
  const { toggleComponentVisibility } = props;
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [chatList, setChatList] = useState<any[]>([]);

  const loadChatList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/chat/conversations/1`);
      console.log("Respo: ", response)
      setChatList(response.data);
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadChatList();
    }
  }, [isAuthenticated]);

  const callChat = async (conversationId: any) => {
    router.push(`/chat?cId=${conversationId}`);
    toggleComponentVisibility();
  };

  const clearConversations = () => {
    const confirmClear = window.confirm("Та чатны түүхийг устгахдаа итгэлтэй байна уу?");
    if (confirmClear) {
      const chat = localStorage.getItem("hugjil_chat_history");
      if (chat) {
        const parsedChatList = JSON.parse(chat);
        const filteredChat = parsedChatList.filter((item: any) => item.role !== "user");
        localStorage.setItem("hugjil_chat_history", JSON.stringify(filteredChat));
        setChatList([]); // Clear the UI list of user messages
      }
    }
  };

  return (
    <div id="headlessui-portal-root">
      <div data-headlessui-portal="">
        <div className="relative z-40" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100 scrollbar-trigger "></div>
          <div className="fixed inset-0 z-40 flex">
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 translate-x-0 scrollbar-trigger">
              <div className="absolute top-0 right-0 -mr-12 pt-2 opacity-100 ">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  tabIndex={0}
                  onClick={toggleComponentVisibility}
                >
                  <span className="sr-only">Хаах</span>
                  <IoMdClose className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Mobile Sidebar Content */}
              <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                {/* New Chat Button */}
                <button
                  onClick={async () => {
                    try {
                      const phone = localStorage.getItem("phone");
                      if (!phone) {
                        alert("Хэрэглэгч олдсонгүй");
                        return;
                      }
                      router.push(`/chat?cId=0`);
                      toggleComponentVisibility()
                    } catch (error) {
                      console.error("Шинэ чат үүсгэхэд алдаа гарлаа:", error);
                    }
                  }}
                  className=" mt-16 flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20 w-full"
                >
                  <AiOutlinePlus className="h-4 w-4" />
                  Шинэ чат
                </button>

                {/* Menu Toggle */}

                {/* Submenu (Visible when isMenuOpen is true) */}
                <div className="pl-5 space-y-2">
                  {/* <button
                    onClick={() => {
                      router.push("/plan");
                      toggleComponentVisibility();
                    }}
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm w-full text-left"
                  >
                    Үнийн санал
                  </button>

                  <button
                    onClick={() => {
                      router.push("/settings");
                      toggleComponentVisibility();
                    }}
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm w-full text-left"
                  >
                    Тохиргоо
                  </button> */}

                  <button
                    onClick={() => {
                      router.push("/help");
                      toggleComponentVisibility();
                    }}
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white text-sm w-full text-left"
                  >
                    Тусламж
                  </button>
                </div>

                {/* Menu Links */}
                <Link
                  href="/clear-conversations"
                  className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default navigation
                    // Clear conversation logic here
                    clearConversations(); // your own logic
                    toggleComponentVisibility(); // close the menu
                  }}
                >
                  <AiOutlineMessage className="h-4 w-4" />
                  Чатны түүх цэвэрлэх
                </Link>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout(); // your own logout function
                      toggleComponentVisibility(); // close the menu
                    }}
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                  >
                    <MdLogout className="h-4 w-4" />
                    Гарах
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                    onClick={() => {
                      toggleComponentVisibility(); // close the menu on login click
                    }}
                  >
                    <MdLogout className="h-4 w-4" />
                    Нэвтрэх
                  </Link>
                )}
                <ul className="ml-5 mt-5 text-white text-[14px] border border-spacing-1 border-r-0 border-l-0 max-h-90 overflow-y-auto pr-2">
                  <p className="text-[14px] mt-5">Чатны түүх</p>
                  {chatList && chatList.length > 0 ? (
                    chatList.map((item: any, index: number) => (
                      <li
                        key={index}
                        className="text-white p-1 cursor-pointer"
                        onClick={() => callChat(item.id)}
                      >
                        {item.topic && item.topic.length > 20
                          ? item.topic.slice(0, 20) + "..."
                          : item.topic}
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-400">No chats available</li>
                  )}
                </ul>

              </nav>
            </div>
            <div className="w-14 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
