import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineMessage, AiOutlinePlus, AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [chatList, setChatList] = useState<any[]>([]);

  const [phoneNumber, setPhone] = useState("");
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem("phone") || "";
      setPhone(phone);
    }
  }, []);

  const loadChatList = () => {
    if (typeof window !== "undefined") {
      const chat = localStorage.getItem(`hugjil_chat_history_${phoneNumber}`);
      console.log("chat: ", chat)
      const parsedChatList = chat ? JSON.parse(chat) : [];
      const userMessages = parsedChatList.filter((item: any) => item.role === "user");
      console.log("user: ", userMessages)
      setChatList(userMessages);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadChatList();
    }
  }, [isAuthenticated]);

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

  console.log("chatlist: ", chatList)

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <Link
          href="/chat"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20"
        >
          <AiOutlinePlus className="h-4 w-4" />
          Шинэ чат
        </Link>

        {/* Render chat history from localStorage */}
        <ul>
          {chatList && chatList.length > 0 ? (
            chatList.map((item: any, index: number) => (
              <li
                key={index}
                className="text-white p-1 cursor-pointer "
              >
                {item.content && item.content.length > 20
                  ? item.content.slice(0, 20) + "..."
                  : item.content}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400">No chats available</li>
          )}
        </ul>
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
        </div>
        <Link
          href="/clear-conversations"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          onClick={(e) => {
            e.preventDefault(); // Prevent the default Link behavior
            clearConversations(); // Clear the conversations
          }}
        >
          <AiOutlineMessage className="h-4 w-4" />
          Чатны түүх цэвэрлэх
        </Link>
        <Link
          href="/plan"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <AiOutlineUser className="h-4 w-4" />
          Үнийн санал
        </Link>

        <Link
          href="/settings"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <AiOutlineSetting className="h-4 w-4" />
          Тохиргоо
        </Link>

        <Link
          href="/help"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <BiLinkExternal className="h-4 w-4" />
          Тусламж
        </Link>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <MdLogout className="h-4 w-4" />
            Гарах
          </button>
        ) : (
          <Link
            href="/login"
            className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <MdLogout className="h-4 w-4" />
            Нэвтрэх
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
