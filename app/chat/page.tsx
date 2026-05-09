"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Bot, User, MessageCircle, Settings, Send, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, Home } from "lucide-react";

type Message = { role: "user" | "ai"; text: string };
type Chat = { id: string; title: string; messages: Message[] };

const Avatar = ({ ai }: { ai?: boolean }) => (
  <div className="w-9 h-9 rounded-full bg-brand-peach flex items-center justify-center shrink-0 mt-1">
    {ai ? <Bot size={20} color="#E8956D" strokeWidth={2} /> : <User size={20} color="#E8956D" strokeWidth={2} />}
  </div>
);

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <Avatar ai />
      <div className="bg-brand-card border border-brand-peach rounded-[4px_16px_16px_16px] px-4 py-3 flex gap-1 items-center h-11">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar ai />}
      <div className={`max-w-[60%] px-4 py-3 text-brand-text leading-relaxed text-base min-w-0 wrap-break-word ${isUser ? "bg-brand-peach rounded-[16px_4px_16px_16px]" : "bg-brand-card border border-brand-peach rounded-[4px_16px_16px_16px]"}`}>
        {isUser ? <p>{msg.text}</p> : (
          <ReactMarkdown components={{
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            ul: ({ children }) => <ul className="list-disc pl-4 mt-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mt-1">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          }}>{msg.text}</ReactMarkdown>
        )}
      </div>
      {isUser && <Avatar />}
    </div>
  );
}

function ChatItem({ chat, active, onSelect, onDelete }: { chat: Chat; active: boolean; onSelect: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={onSelect} className={`flex items-center justify-between rounded-2xl px-4 py-3 cursor-pointer transition-colors ${active ? "bg-brand-peach" : "bg-brand-card border border-brand-peach hover:bg-brand-peach/50"}`}>
      <div className="flex items-center gap-3 min-w-0">
        <MessageCircle size={22} color="#3D2C2C" strokeWidth={1.8} className="shrink-0" />
        <span className="text-base text-brand-text truncate">{chat.title}</span>
      </div>
      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setOpen(!open)} className="bg-transparent border-none cursor-pointer px-1 text-brand-text hover:text-brand-orange">
          <MoreHorizontal size={20} />
        </button>
        {open && (
          <div className="absolute right-0 top-8 bg-brand-bg border border-brand-orange rounded-2xl py-2 z-50 min-w-28 shadow-lg">
            <button onClick={() => { onDelete(); setOpen(false); }} className="w-full bg-transparent border-none cursor-pointer px-4 py-2 flex items-center gap-2 text-red-500 text-sm hover:bg-red-50">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topicHandled, setTopicHandled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isCreatingChat = useRef(false);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const token = () => localStorage.getItem("token")!;

  const loadMessages = async (chatId: string) => {
    const res = await fetch(`/api/chats/${chatId}/messages`, { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) return;
    const text = await res.text();
    if (!text) return;
    const { messages } = JSON.parse(text);
    if (messages) setChats((prev) => prev.map((c) => c.id === chatId
      ? { ...c, messages: messages.map((m: any) => ({ role: m.role === "user" ? "user" : "ai", text: m.content })) }
      : c
    ));
  };

  const sendMessage = async (msg: string, chatId: string) => {
    setChats((prev) => prev.map((c) => c.id === chatId
      ? { ...c, messages: [...c.messages, { role: "user", text: msg }], title: c.title === "New Chat" ? msg.slice(0, 30) : c.title }
      : c
    ));
    setLoading(true);
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ content: msg }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.message) setChats((prev) => prev.map((c) => c.id === chatId
      ? { ...c, messages: [...c.messages, { role: "ai", text: data.message.content }] }
      : c
    ));
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { router.push("/login"); return; }
    fetch("/api/chats", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then(({ chats: data }) => {
        if (!data?.length) return;
        const loaded = data.map((c: any) => ({ id: c.id, title: c.title, messages: [] }));
        setChats(loaded);
        
        const firstChatId = loaded[0].id;
        setActiveChatId(firstChatId);
        loadMessages(firstChatId);
      });
  }, []);

  useEffect(() => {
    if (topicHandled) return;
    const topic = searchParams.get("topic");
    if (!topic) return;

    if (isCreatingChat.current) return;
    isCreatingChat.current = true;

    setTopicHandled(true);
    const t = localStorage.getItem("token");
    if (!t) return;

    fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ title: topic }),
    })
      .then((r) => r.json())
      .then(({ chat }) => {
        if (!chat) return;
        const newChat: Chat = { id: chat.id, title: chat.title, messages: [] };
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(chat.id);
        sendMessage(topic, chat.id);
        router.replace("/chat");
      });
  }, [searchParams, topicHandled, router]);

  useEffect(() => {
    if (activeChatId) {
      const currentChat = chats.find(c => c.id === activeChatId);
      if (currentChat && currentChat.messages.length === 0) {
        loadMessages(activeChatId);
      }
    }
  }, [activeChatId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeChat?.messages]);

  const handleNewChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const { chat } = await res.json();
    if (chat) {
      const newChat: Chat = { id: chat.id, title: chat.title, messages: [] };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
  };

  const handleDeleteChat = async (id: string) => {
    await fetch(`/api/chats/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token()}` } });
    const remaining = chats.filter((c) => c.id !== id);
    setChats(remaining);
    if (activeChatId === id) {
      setActiveChatId(remaining[0]?.id ?? null);
      if (remaining[0]) loadMessages(remaining[0].id);
    }
  };

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || !activeChatId) return;
    setInput("");
    await sendMessage(msg, activeChatId);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-bg font-sans">
      {sidebarOpen && (
        <aside className="flex flex-col shrink-0 w-64 bg-brand-bg border-r border-brand-border px-4 py-5 relative">
          <button onClick={() => setSidebarOpen(false)} className="absolute top-5 right-4 w-9 h-9 bg-brand-peach rounded-full flex items-center justify-center text-brand-text hover:bg-brand-orange hover:text-white transition-colors cursor-pointer border-none">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-display text-2xl text-brand-text mb-4 mt-1">Chat History</h2>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
            {chats.length === 0 && <p className="text-brand-muted text-sm text-center mt-4">No chats yet</p>}
            {chats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} active={activeChatId === chat.id}
                onSelect={() => { setActiveChatId(chat.id); loadMessages(chat.id); }}
                onDelete={() => handleDeleteChat(chat.id)} />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleNewChat} className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white text-base rounded-btn py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-none cursor-pointer">
              New Chat +
            </button>
            <button onClick={() => router.push("/settings")} title="Settings"
              className="w-12 h-12 rounded-btn flex items-center justify-center shrink-0 cursor-pointer border border-brand-orange bg-brand-card hover:bg-brand-peach transition-colors">
              <Settings size={20} strokeWidth={1.8} color="var(--color-brand-text)" />
            </button>
          </div>
        </aside>
      )}

      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-peach">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 bg-brand-peach rounded-full flex items-center justify-center text-brand-text hover:bg-brand-orange hover:text-white transition-colors shrink-0 border-none cursor-pointer">
              <ChevronRight size={20} />
            </button>
          )}
          <button onClick={() => router.push("/home")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-brand-text border border-brand-orange bg-brand-card hover:bg-brand-peach transition-colors cursor-pointer shrink-0">
            <Home size={16} strokeWidth={2} /> Home
          </button>
          <div className="flex-1" />
          <Avatar />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {(!activeChat || activeChat.messages.length === 0) && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted text-base gap-2 opacity-70 mt-16">
              Start a conversation! Ask me anything about parenting.
            </div>
          )}
          {activeChat?.messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-5 pb-4 pt-3 flex items-center gap-3">
          <div className="flex-1 bg-white border border-brand-orange rounded-2xl flex items-center px-4 h-12">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border-none outline-none bg-transparent font-sans text-base text-brand-text placeholder:text-brand-muted" />
          </div>
          <button onClick={() => handleSend()} className="w-12 h-12 bg-brand-orange hover:bg-brand-orange-dark rounded-full flex items-center justify-center shrink-0 transition-colors border-none cursor-pointer">
            <Send size={20} color="white" fill="white" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return <Suspense fallback={null}><ChatPageInner /></Suspense>;
}