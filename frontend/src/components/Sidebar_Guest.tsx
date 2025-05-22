import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/router";

const SidebarGuest = () => {
  const router = useRouter();
  const [chatlist, setChatList] = useState([]);
  const [loadingChatHistory, setLoadingChatHistory] = useState(false);

  // Load guest chats from localStorage
  const loadGuestChats = async () => {
    const localChats = localStorage.getItem("hugjil_chat_history_guest");
    if (localChats) {
      try {
        const parsedMessages = JSON.parse(localChats);
        const userMessages = parsedMessages.filter((msg: any) => msg.role === "user");
        setChatList(userMessages);
      } catch (error) {
        console.error("Failed to parse local chat history:", error);
      }
    }
  };

  useEffect(() => {
    loadGuestChats();
  }, []);

  const callChat = (conversationId: string | number) => {
    if (!conversationId) return;
    router.push(`/chat?cId=${conversationId}`);
  };

  const clearConversations = () => {
    const confirmClear = window.confirm("Та чатны түүхийг устгахдаа итгэлтэй байна уу?");
    if (!confirmClear) return;
    localStorage.removeItem("hugjil_chat_history_guest");
    setChatList([]);
    alert("Чатны түүх амжилттай устгагдлаа.");
  };

  const startNewChat = () => {
    router.push({ pathname: "/chat" });
  };

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2 w-full">
        <p style={{color:"white"}}>Зочин</p>
        <button
          onClick={startNewChat}
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20 w-full"
        >
          <AiOutlinePlus className="h-4 w-4" />
          Шинэ чат
        </button>

        <ul className="max-h-90 overflow-y-auto pr-2 mt-20 hide-scrollbar">
          {loadingChatHistory ? (
            <li className="text-center text-gray-400">Уншиж байна...</li>
          ) : chatlist.length > 0 ? (
            chatlist.map((item: any, index: number) => (
              <li
                key={index}
                onClick={() => callChat(index)}
                className={`p-1 cursor-pointer text-white ${router.query.cId === index.toString() ? "bg-gray-600 rounded" : ""
                  }`}
              >
                {item.content}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400">Чатны түүх байхгүй байна.</li>
          )}
        </ul>

        <button
          onClick={clearConversations}
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <AiOutlineMessage className="h-4 w-4" />
          Чатны түүх цэвэрлэх
        </button>

        <Link
          href="/help"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <BiLinkExternal className="h-4 w-4" />
          Тусламж
        </Link>

        <Link
          href="/login"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <MdLogout className="h-4 w-4" />
          Нэвтрэх
        </Link>
      </nav>
    </div>
  );
};

export default SidebarGuest;
