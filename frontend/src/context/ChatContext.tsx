import { createContext, useContext, useState, ReactNode } from "react";

interface Chat {
  id: number;
  topic: string;
}

interface ChatContextType {
    chatList: Chat[];
    addChat: (newChat: Chat) => void;
    clearChats: () => void; 
  }
  

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [chatList, setChatList] = useState<Chat[]>([]);
  
    const addChat = (newChat: Chat) => {
      setChatList((prevChatList) => [...prevChatList, newChat]);
    };
  
    const clearChats = () => {
      setChatList([]);
    };
  
    return (
      <ChatContext.Provider value={{ chatList, addChat, clearChats }}>
        {children}
      </ChatContext.Provider>
    );
  };
  