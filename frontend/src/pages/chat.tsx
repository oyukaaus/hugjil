import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsChevronDown } from "react-icons/bs";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = (props: any) => {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhone] = useState("");

  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const selectedModel = DEFAULT_OPENAI_MODEL;
  // Setup WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://222.121.66.49:1217/");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      const newMessage: Message = {
        content: data.response || "No response",
        role: "assistant",
      };

      setConversation((prev) => {
        const updated = [...prev, newMessage];
        saveToLocalStorage(updated);
        return updated;
      });

      setIsLoading(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setErrorMessage("WebSocket connection error");
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Load phone from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const phone = localStorage.getItem("phone") || "";
      setPhone(phone);
    }
  }, []);

  // Restore saved conversation
  useEffect(() => {
    if (!phoneNumber) return;
    const savedChat = localStorage.getItem(`hugjil_chat_history_${phoneNumber}`);
    if (savedChat) {
      const parsed = JSON.parse(savedChat);
      setConversation(parsed);
      setShowEmptyChat(parsed.length === 0);
    }
  }, [phoneNumber]);

  // Scroll to bottom on message
  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Autosize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "24px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [message, textAreaRef]);

  const saveToLocalStorage = (newConversation: Message[]) => {
    if (!phoneNumber) return;
    localStorage.setItem(`hugjil_chat_history_${phoneNumber}`, JSON.stringify(newConversation));
  };

  const sendMessage = async (e: any) => {
    e.preventDefault();

    if (message.trim().length < 1) {
      setErrorMessage("Please enter a message.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const userMessage: Message = { content: message, role: "user" };

    const updated = [...conversation, userMessage];
    setConversation(updated);
    saveToLocalStorage(updated);
    setMessage("");
    setShowEmptyChat(false);

    // Send message via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }));
    } else {
      console.error("WebSocket is not connected.");
      setErrorMessage("Unable to send message. WebSocket disconnected.");
      setIsLoading(false);
    }
  };

  const handleKeypress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
  <ReactMarkdown>{msg.content}</ReactMarkdown>
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
        <div ref={bottomOfChatRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={sendMessage} className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <textarea
              style={{
                height: "24px",
                maxHeight: "200px",
                overflowY: "hidden",
              }}
            ref={textAreaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeypress}
            placeholder="Send a message..."
                className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
        {errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default Chat;
