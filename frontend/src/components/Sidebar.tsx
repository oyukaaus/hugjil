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
    console.log("isAuthenticated && userId: ", isAuthenticated, userId)
    if (isAuthenticated && userId) {
      loadChatList();
    }
  }, [isAuthenticated, userId, loadChatList]);

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

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-full w-full flex-col border-white/20 bg-[#693cca]">
      {/* top: new-chat & chat list */}
      <div className="flex-1 flex flex-col">
        <button
          onClick={startNewChat}
          className="flex items-center gap-3 rounded-md border border-white/20 px-3 py-3 text-sm text-white hover:bg-gray-500/10 transition-colors duration-200"
        >
          <AiOutlinePlus className="h-4 w-4" />
          Шинэ чат
        </button>

        {/* chat list gets a fixed height (e.g. 18rem) and its own scroll */}
        <ul className="mt-4 h-72 overflow-y-auto pr-2 hide-scrollbar">
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
      </div>
      {/* bottom: links always stick here */}
      <div className="space-y-1 pt-4">
        <Link
          href="/clear-conversations"
          onClick={(e) => {
            e.preventDefault();
            clearConversations();
          }}
          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-white hover:bg-gray-500/10 transition-colors duration-200"
        >
          <AiOutlineMessage className="h-4 w-4" />
          Чатны түүх цэвэрлэх
        </Link>

        <Link
          href="/help"
          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-white hover:bg-gray-500/10 transition-colors duration-200"
        >
          <BiLinkExternal className="h-4 w-4" />
          Тусламж
        </Link>

        <button
          onClick={() => {
            if (window.confirm("Та гарахдаа итгэлтэй байна уу?")) logout();
          }}
          className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-white hover:bg-gray-500/10 transition-colors duration-200"
        >
          <MdLogout className="h-4 w-4" />
          Гарах
        </button>
      </div>
    </div>

  );
};

export default Sidebar;
