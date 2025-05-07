import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlineMessage, AiOutlinePlus, AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useChat } from "@/context/ChatContext";

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  // const [chatList, setChatList] = useState<any[]>([]);
  const { chatList, addChat, clearChats } = useChat();
  const router = useRouter();


  const [phoneNumber, setPhone] = useState("");
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem("phone") || "";
      setPhone(phone);
    }
  }, []);
  useEffect(() => {
    if (!isAuthenticated) {
      const localChats = localStorage.getItem("hugjil_chat_history_guest");
      if (localChats) {
        try {
          const parsedMessages = JSON.parse(localChats); // Flat array
          const userMessages = parsedMessages.filter((msg: any) => msg.role === "user");
  
          userMessages.forEach((msg: any, index: number) => {
            addChat({
              id: index,            // Generate an ID (you can use a better one if available)
              topic: msg.content,   // Show message content as topic
            });
          });
        } catch (e) {
          console.error("Failed to parse local chat history:", e);
        }
      }
    }
  }, [isAuthenticated]);
  


  const loadChatList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/chat/conversations/1`);
      console.log("Respo: ", response)
      response.data.forEach((chat: any) => addChat(chat));
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  const callChat = async (conversationId: any) => {
    router.push(`/chat?cId=${conversationId}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadChatList();
    }
  }, [isAuthenticated]);


  const clearConversations = () => {
    const confirmClear = window.confirm("Та чатны түүхийг устгахдаа итгэлтэй байна уу?");
    if (confirmClear) {
      localStorage.removeItem("hugjil_chat_history");
      clearChats();
    }
  };
  console.log("chatlist: ", chatList)

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <button
          onClick={async () => {
            try {
              const phone = localStorage.getItem("phone");
              if (!phone) {
                alert("Хэрэглэгч олдсонгүй-");
                router.push(`/chat?cId=0`);
                return;
              }
            } catch (error) {
              console.error("Шинэ чат үүсгэхэд алдаа гарлаа:", error);
            }
          }}
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20 w-full"
        >
          <AiOutlinePlus className="h-4 w-4" />
          Шинэ чат
        </button>
        {/* Render chat history from localStorage */}
        <ul className="max-h-90 overflow-y-auto pr-2 mt-20 hide-scrollbar">
          {!isAuthenticated && chatList.length > 0 ? (
            chatList.map((item: any, index) => (
              <li
                key={index}
                onClick={() => callChat(item.id)}
                className={`p-1 cursor-pointer text-white `}
              >
                {item.topic}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400"></li>
          )}
        </ul>7

        <ul className="max-h-90 overflow-y-auto pr-2 mt-20 hide-scrollbar">
          {isAuthenticated && chatList && chatList.length > 0 ? (
            chatList.map((item: any, index: number) => (
              <li
                key={item.id}
                onClick={() => callChat(item.id)}
                className={`p-1 cursor-pointer text-white ${router.query.cId == item.id?.toString() ? "bg-gray-700 rounded" : ""
                  }`}
              >
                {item.topic}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-400"></li>
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
        {/* <Link
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
        </Link> */}

        <Link
          href="/help"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <BiLinkExternal className="h-4 w-4" />
          Тусламж
        </Link>

        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
              // setChatList([]);    
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
