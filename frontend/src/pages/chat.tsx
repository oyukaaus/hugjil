import { useEffect, useRef, useState, FormEvent } from "react";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useRouter } from "next/router";

import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import { processMarkdownText } from "@/utils/markdown-utils";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import copy from '../assets/img/copy.png'; 
import Image from 'next/image';

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  /* ──────────────────────── state ──────────────────────── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [guestCount, setGuestCount] = useState(0);
  const [userId, setUserId] = useState<number>(1);

  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(
    (router.query.cId as string) ?? null
  );

  /* ──────────────────────── refs ──────────────────────── */
  const wsRef = useRef<WebSocket | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useAutoResizeTextArea();

  /* ──────────────────────── context ──────────────────────── */
  const { addChat } = useChat();
  const { isAuthenticated } = useAuth();

  /* ────────────────────── helpers ─────────────────────── */
  const scrollToEnd = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

  const appendMsg = (msg: Message) =>
    setMessages((prev) => [...prev, { ...msg, content: processMarkdownText(msg.content) }]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      const parsedId = parseInt(storedUser, 10);
      if (!isNaN(parsedId)) {
        setUserId(parsedId);
      }
    }
  }, []);
  
  useEffect(() => {
    const id = router.query.cId as string | undefined;
  
    if (!id) {
      // no chat selected  →  show blank screen
      setConversationId(null);
      setMessages([]);
      wsRef.current?.close();
      return;
    }
  
    if (id !== conversationId) {
      setConversationId(id);          // load the newly selected thread
      wsRef.current?.close();         // a fresh WebSocket will be opened by the other effect
    }
  }, [router.query.cId]);
  
  /* ───────────────────── load history ───────────────────── */
  useEffect(() => {
    const fetchHistory = async () => {
      if (!conversationId) return setMessages([]);
      console.log("conv: ", conversationId)
      try {
        const rows = isAuthenticated
          ? (await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/messages/${conversationId}`)).data
          : JSON.parse(localStorage.getItem("hugjil_chat_history_guest") || "[]");

        setMessages(
          rows.map((m: any) => ({
            role: m.role,
            content: processMarkdownText(m.content),
          }))
        );
      } catch {
        setErr("Failed to load messages.");
      }
    };

    fetchHistory();
  }, [conversationId, isAuthenticated]);

  /* ─────────────────── websocket lifecycle ─────────────────── */
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.close();

    const ws = new WebSocket("ws://222.121.66.49:1217/");
    wsRef.current = ws;

    ws.onopen = () => {
      if (conversationId) ws.send(JSON.stringify({ init: true, conversationId }));
    };

    ws.onmessage = async ({ data }) => {
      const payload = JSON.parse(data);
      if (payload.status === "connected" || payload.init === "success") return;

      const reply: Message = { role: "assistant", content: payload.response || "No response" };
      appendMsg(reply);

      if (isAuthenticated && conversationId) {
        try {
          const { data: saved } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/message`, {
            conversationId,
            content: reply.content,
            role: reply.role,
          });
          addChat(saved);
        } catch {
          console.error("Save assistant message failed");
        }
      }
      setLoading(false);
    };

    ws.onerror = () => setLoading(false);
    ws.onclose = () => setLoading(false);

    return () => ws.close();
  }, [conversationId, isAuthenticated]);

  /* ───────────────── scroll on new message ──────────────── */
  useEffect(scrollToEnd, [messages]);

  /* ───────────────────── send handler ───────────────────── */
  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return setErr("Асуултаа оруулна уу");

    if (!isAuthenticated && guestCount >= 10)
      return setErr("Нэвтэрч ороод үргэлжлүүлэн ашиглана уу.");

    setErr("");
    setGuestCount((c) => c + (!isAuthenticated ? 1 : 0));

    const userMsg: Message = { role: "user", content: input.trim() };
    appendMsg(userMsg);
    setInput("");
    setLoading(true);

    /* create conversation first time */
    let id = conversationId;
    if (!id && isAuthenticated) {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/conversation`, {
        userId,
        topicName: userMsg.content,
      });
      id = String(data.id);
      setConversationId(id);
      router.replace({ query: { cId: id } }, undefined, { shallow: true });
    }

    /* save user message */
    if (isAuthenticated && id)
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/message`, {
        conversationId: id,
        content: userMsg.content,
        role: userMsg.role,
      });

    /* send to websocket */
    wsRef.current?.readyState === WebSocket.OPEN
      ? wsRef.current.send(JSON.stringify({ conversationId: id, message: userMsg.content }))
      : setLoading(false);
  };

  /* ─────────────────────── render ──────────────────────── */
  const LoadingDots = () => (
    <div className="flex space-x-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-ping" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-ping delay-100" />
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-ping delay-200" />
    </div>
  );

  return (
    <div className="flex flex-col h-full w-[60%] mx-auto">
      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length ? (
          messages.map((m, i) => {
            const isUser = m.role === "user";
            let text = m.content;
            if (text.startsWith('"') && text.endsWith('"')) text = JSON.parse(text);

            return (
              <div >
              <div key={i} className={`group relative max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap
                ${isUser ? "ml-auto border bg-[#e6e5e9] text-gray-800 rounded"
                          : "mr-auto bg-[#eef1f3] text-gray-800 dark:bg-gray-700 dark:text-gray-100"}`}>
                <ReactMarkdown>{text.replace(/\n+/g, "\n")}</ReactMarkdown>
              </div>
                {!isUser && (
                  <button style={{marginTop:5, height:20, width:20, }}
                    onClick={() => navigator.clipboard.writeText(text)}
                    className="flex items-end  gap-1 
                       bg-white text-xs text-gray-600 
                       dark:text-gray-300 lex "
                  >
                    <Image src={copy} alt="Copy icon" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            {/* <span className="mb-4 text-sm">
              Model: {selectedModel.name} <BsChevronDown className="inline ml-2" />
            </span> */}
            <h1 className="text-2xl font-semibold">Хөгжил GPT</h1>
          </div>
        )}

        {loading && (
          <div className="max-w-[80%] px-4 py-2 rounded-lg bg-[#eef1f3] text-gray-800 dark:bg-gray-700">
            <LoadingDots />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* input */}
      <form
        onSubmit={handleSend}
        className="sticky bottom-0 border-t bg-white dark:bg-gray-900 p-4"
      >
        <div className="flex gap-2">
          <textarea
            ref={textAreaRef}
            rows={1}
            value={input}
            disabled={loading}
            placeholder="Send a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            className="flex-1 resize-none bg-transparent focus:ring-0 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2 rounded-md bg-[#6f42c1] text-white disabled:opacity-50"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
        {err && <p className="mt-1 text-xs text-red-500">{err}</p>}
      </form>
    </div>
  );
};

export default Chat;
