import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useChat } from "@/context/ChatContext";
import { useSharedState } from "@/context/SharedStateContext";

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { clearChats } = useChat();
  const router = useRouter();
  const [userId, setUserID] = useState("");
  const [chatlist, setChatList] = useState([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);
  const { selectedId, setSelectedId } = useSharedState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") || "";
      setUserID(storedUserId);
    }
  }, []);

  const loadChatList = async () => {
    if (!userId) return;
    setLoadingChatHistory(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/conversations/${userId}`
      );
      setChatList(response.data);
    } catch (error) {
      console.error("Failed to load chat history", error);
    } finally {
      setLoadingChatHistory(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadChatList();
    }
  }, [isAuthenticated, userId]);

  const callChat = (conversationId: string | number) => {
    if (!conversationId) return;
    router.push(`/chat?cId=${conversationId}`);
  };

  const clearConversations = async () => {
    const confirmClear = window.confirm("Та чатны түүхийг устгахдаа итгэлтэй байна уу?");
    if (!confirmClear) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/conversations/${userId}`);
      clearChats();
      alert("Чатны түүх амжилттай устгагдлаа.");
    } catch (error) {
      console.error("Чатны түүхийг устгаж чадсангүй:", error);
      alert("Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  const startNewChat = () => {
    router.push({ pathname: "/chat" });
  };

  if (!isAuthenticated) return null; // 👈 Optional: Hide sidebar if not authenticated

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2 w-full">
        <button
          onClick={startNewChat}
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 border border-white/20 w-full"
        >
          <AiOutlinePlus className="h-4 w-4" />
          Шинэ чат
        </button>

        <ul className="max-h-90 overflow-y-auto pr-2 mt-20 hide-scrollbar">
          {loadingChatHistory ? (
            <li className="text-center text-gray-400">Loading chats...</li>
          ) : chatlist.length > 0 ? (
            chatlist.map((item: any) => (
              <li
                key={item.id}
                onClick={() => callChat(item.id)}
                className={`p-1 cursor-pointer text-white ${router.query.cId === item.id?.toString() ? "bg-gray-600 rounded" : ""}`}
              >
                {item.topic}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400">No chats available</li>
          )}
        </ul>

        <Link
          href="/clear-conversations"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          onClick={(e) => {
            e.preventDefault();
            clearConversations();
          }}
        >
          <AiOutlineMessage className="h-4 w-4" />
          Чатны түүх цэвэрлэх
        </Link>

        <Link
          href="/help"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <BiLinkExternal className="h-4 w-4" />
          Тусламж
        </Link>

        <button
          onClick={() => {
            const confirmLogout = window.confirm("Та гарахдаа итгэлтэй байна уу?");
            if (confirmLogout) logout();
          }}
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <MdLogout className="h-4 w-4" />
          Гарах
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
