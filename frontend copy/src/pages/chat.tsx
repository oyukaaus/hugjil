import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChevronDown } from "react-icons/bs";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useRouter } from "next/router";
import { processMarkdownText } from "@/utils/markdown-utils";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [searchId, setSearchId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const selectedModel = DEFAULT_OPENAI_MODEL;
  const router = useRouter();
  const conversationId = router.query.cId as string;
  const { addChat } = useChat();
  const { isAuthenticated, logout } = useAuth();
  // Load messages when the component mounts or conversationId changes
  useEffect(() => {
    if (conversationId === "0") {
      setConversation([]);
      setSearchId(null);
      return;
    }
    loadMessages();
  }, [conversationId, isAuthenticated]);
  
  const loadMessages = async () => {
    console.log("conversationId: ", conversationId)
    if (!conversationId) {
      setConversation([]);
      setSearchId(null);
      return;
    }
  
    try {
      let messages: Message[] = [];
      if (isAuthenticated) {
        // Fetch messages from the database for authenticated users
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/messages/${conversationId}`);
        messages = response.data.map((msg: any) => ({
          role: msg.role,
          content: processMarkdownText(msg.content),
        }));
      } else {
        // Load messages from localStorage for guest users
        const savedChat = localStorage.getItem(`hugjil_chat_history_guest`);
        if (savedChat) {
          const parsedChat = JSON.parse(savedChat);
          messages = parsedChat.map((msg: Message) => ({
            ...msg,
            content: processMarkdownText(msg.content),
          }));
        }
      }
      setConversation(messages);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setErrorMessage("Failed to load messages. Please try again.");
    }
  };
  
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId, isAuthenticated]);

  // Initialize user data
  useEffect(() => {
    const phone = localStorage.getItem("phone") || "";
    setPhone(phone);
    setUserId(1); // Replace with actual user ID logic
  }, []);

  // Handle WebSocket connection
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const ws = new WebSocket("ws://222.121.66.49:1217/");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      if (searchId) {
        ws.send(
          JSON.stringify({
            init: true,
            conversationId: searchId,
          })
        );
      }
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket received data:", data);

        if (data.status === "connected" || data.init === "success") {
          console.log("WebSocket connection confirmed");
          return;
        }

        const newMessage: Message = {
          content: data.response || "No response",
          role: "assistant",
        };

        updateConversation(newMessage);

        // Save assistant's message to DB if authenticated
        if (userId && searchId) {
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/message`, {
              conversationId: searchId,
              content: newMessage.content,
              role: newMessage.role,
            });
            const newChat = response.data;
            addChat(newChat);
          } catch (error) {
            console.error("Failed to save message to DB:", error);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      } finally {
        setIsLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsLoading(false);
      setErrorMessage("Connection error. Please try again.");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      if (isLoading) {
        setIsLoading(false);
        setErrorMessage("Connection closed. Please try again.");
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [phoneNumber, userId, searchId]);

  // Scroll to the bottom of the chat when the conversation updates
  useEffect(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Save messages to localStorage for guest users
  const saveToLocal = (conv: Message[]) => {
    const key = "hugjil_chat_history_guest";
    try {
      const existing = localStorage.getItem(key);
      let history: Message[] = [];
      if (existing) {
        history = JSON.parse(existing);
      }
      const updatedHistory = [...history, ...conv];
      localStorage.setItem(key, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  };

  // Update the conversation state
  const updateConversation = (msg: Message) => {
    const processedContent = processMarkdownText(msg.content);
    const processedMsg = {
      ...msg,
      content: processedContent,
    };
    setConversation((prev) => {
      const updated = [...prev, processedMsg];
      if (!isAuthenticated) {
        saveToLocal(updated);
      }
      return updated;
    });
  };

  // Send a message via WebSocket
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }

    setErrorMessage("");
    const currentMessage = message.trim();
    const userMessage: Message = { content: currentMessage, role: "user" };

    // Optimistically update conversation with user's message
    const updatedConv = [...conversation, userMessage];
    setConversation(updatedConv);
    if (!isAuthenticated) {
      saveToLocal(updatedConv);
    }

    setMessage("");
    setIsLoading(true);

    try {
      let convId = searchId;

      // Create a new conversation if none exists
      if (!convId && userId) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/conversation`, {
          userId,
          topicName: currentMessage,
        });
        if (res.data?.id) {
          convId = res.data.id;
          setSearchId(convId);
        }
      }

      // Save user's message to DB if authenticated
      if (convId && userId) {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/message`, {
          conversationId: convId,
          content: userMessage.content,
          role: userMessage.role,
        });
      }

      // Send the message through WebSocket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            message: currentMessage,
            conversationId: convId,
          })
        );
      } else {
        setErrorMessage("WebSocket connection not open.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  // Loading dots component
  const LoadingDots = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-ping"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-ping animation-delay-100"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-ping animation-delay-200"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {conversation.length > 0 ? (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={`w-fit max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                msg.role === "user"
                  ? "ml-auto bg-[#693cca] text-white"
                  : "mr-auto bg-[#eef1f3] text-gray-800 dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p className="my-2" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                  li: ({ node, ...props }) => <li className="my-1" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-600 underline" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />
                  ),
                }}
              >
                {msg.content.replace(/\n+/g, "\n")}
              </ReactMarkdown>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="mb-4">
              <span className="text-sm">Model: {selectedModel.name}</span>
              <BsChevronDown className="inline ml-2 text-gray-500" />
            </div>
            <h1 className="text-2xl font-semibold">Hugjil GPT</h1>
          </div>
        )}
        {isLoading && (
          <div className="w-fit max-w-[80%] px-4 py-2 rounded-lg mr-auto bg-[#eef1f3] text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            <LoadingDots />
          </div>
        )}
        <div ref={bottomOfChatRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <textarea
            ref={textAreaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            disabled={isLoading}
            placeholder="Send a message..."
            className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-white bg-[#6f42c1] rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
        {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Chat;