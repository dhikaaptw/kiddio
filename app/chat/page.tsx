"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Message = { role: "user" | "ai"; text: string };
type Chat = { id: string; title: string; messages: Message[] };

const QUICK_TOPICS = ["Sleep Tips", "Feeding & Nutrition", "Health", "Behavior & Emotions", "Parental Advice"];

const AiAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-brand-peach flex items-center justify-center shrink-0 mt-1">
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" fill="#E8956D" opacity="0.2"/>
      <path d="M6 8h10M6 11h10M6 14h6" stroke="#E8956D" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </div>
);

const UserAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-brand-peach flex items-center justify-center shrink-0 mt-1">
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="4" fill="#E8956D"/>
      <path d="M3 19C3 15.5 6.5 13 11 13C15.5 13 19 15.5 19 19" stroke="#E8956D" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </div>
);

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <AiAvatar />
      <div className="bg-brand-card border border-brand-peach rounded-[4px_16px_16px_16px] px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <AiAvatar />}
      <div className={`max-w-[60%] px-4 py-3 text-brand-text leading-relaxed whitespace-pre-line text-base wrap-break-word min-w-0 ${
        isUser
          ? "bg-brand-peach rounded-[16px_4px_16px_16px]"
          : "bg-brand-card border border-brand-peach rounded-[4px_16px_16px_16px]"
      }`}>
        {msg.text}
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
}

function ChatItem({ chat, active, onSelect, onDelete }: {
  chat: Chat; active: boolean; onSelect: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={onSelect}
      className={`flex items-center justify-between rounded-[16px] px-4 py-3 cursor-pointer transition-colors ${
        active ? "bg-brand-peach" : "bg-brand-card border border-brand-peach hover:bg-brand-peach/50"
      }`}>
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M4 6C4 4.9 4.9 4 6 4H26C27.1 4 28 4.9 28 6V20C28 21.1 27.1 22 26 22H10L4 28V6Z" stroke="#3D2C2C" strokeWidth="1.8"/>
          <circle cx="11" cy="13" r="1.2" fill="#3D2C2C"/>
          <circle cx="16" cy="13" r="1.2" fill="#3D2C2C"/>
          <circle cx="21" cy="13" r="1.2" fill="#3D2C2C"/>
        </svg>
        <span className="text-lg text-brand-text truncate max-w-32.5">{chat.title}</span>
      </div>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setOpen(!open)}
          className="bg-transparent border-none cursor-pointer px-1 text-brand-text text-xl hover:text-brand-orange">
          ⋯
        </button>
        {open && (
          <div className="absolute right-0 top-8 bg-brand-bg border border-brand-orange rounded-[16px] py-2 z-50 min-w-32.5 shadow-lg">
            <button onClick={() => { onDelete(); setOpen(false); }}
              className="w-full bg-transparent border-none cursor-pointer px-4 py-2 flex items-center gap-2 text-red-500 text-base hover:bg-red-50">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    const loadChats = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      const res = await fetch("/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.chats && data.chats.length > 0) {
        const loadedChats = data.chats.map((c: any) => ({
          id: c.id,
          title: c.title,
          messages: [],
        }));
        setChats(loadedChats);
        setActiveChatId(loadedChats[0].id);
        loadMessages(loadedChats[0].id, token);
      }
    };
    loadChats();
  }, []);

  const loadMessages = async (chatId: string, token: string) => {
    const res = await fetch(`/api/chats/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.messages) {
      setChats((prev) => prev.map((c) => c.id === chatId
        ? { ...c, messages: data.messages.map((m: any) => ({
            role: m.role === "user" ? "user" : "ai",
            text: m.content,
          })) }
        : c
      ));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    const token = localStorage.getItem("token")!;
    loadMessages(chatId, token);
  };

  const handleNewChat = async () => {
    const token = localStorage.getItem("token")!;
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const data = await res.json();

    if (data.chat) {
      const newChat: Chat = { id: data.chat.id, title: data.chat.title, messages: [] };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
  };

  const handleDeleteChat = async (id: string) => {
    const token = localStorage.getItem("token")!;
    await fetch(`/api/chats/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const remaining = chats.filter((c) => c.id !== id);
    setChats(remaining);
    if (activeChatId === id) {
      setActiveChatId(remaining[0]?.id ?? null);
      if (remaining[0]) loadMessages(remaining[0].id, token);
    }
  };

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || !activeChatId) return;

    const token = localStorage.getItem("token")!;

    setChats((prev) => prev.map((c) => c.id === activeChatId
      ? { ...c, messages: [...c.messages, { role: "user", text: msg }],
          title: c.title === "New Chat" ? msg.slice(0, 30) : c.title }
      : c
    ));
    setInput("");
    setLoading(true);

    const res = await fetch(`/api/chats/${activeChatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: msg }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.message) {
      setChats((prev) => prev.map((c) => c.id === activeChatId
        ? { ...c, messages: [...c.messages, { role: "ai", text: data.message.content }] }
        : c
      ));
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-brand-bg font-sans">

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <aside className="flex flex-col shrink-0 w-72 bg-brand-bg border-r border-brand-border px-4 py-6 relative">
          <button onClick={() => setSidebarOpen(false)}
            className="absolute top-6 right-4 w-11 h-11 bg-brand-peach rounded-full flex items-center justify-center text-xl text-brand-text hover:bg-brand-orange hover:text-white transition-colors cursor-pointer border-none">
            ‹
          </button>

          <h2 className="font-display text-3xl text-brand-text mb-5 mt-1">Chat History</h2>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
            {chats.length === 0 && (
              <p className="text-brand-muted text-sm text-center mt-4">Belum ada chat</p>
            )}
            {chats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} active={activeChatId === chat.id}
                onSelect={() => handleSelectChat(chat.id)}
                onDelete={() => handleDeleteChat(chat.id)} />
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button onClick={handleNewChat}
              className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white text-lg rounded-btn py-3 px-4 flex items-center justify-center gap-2 transition-colors border-none cursor-pointer">
              New Chat +
            </button>
            <button onClick={() => router.push("/settings")} title="Settings"
              className="w-14 h-14 rounded-btn flex items-center justify-center shrink-0 transition-colors cursor-pointer border-none hover:bg-brand-peach"
              style={{ background: "var(--color-brand-card)", border: "1.5px solid var(--color-brand-orange)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN ── */}
      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-peach flex-wrap">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="w-11 h-11 bg-brand-peach rounded-full flex items-center justify-center text-xl text-brand-text hover:bg-brand-orange hover:text-white transition-colors shrink-0 border-none cursor-pointer">
              ›
            </button>
          )}
          <div className="flex gap-2 flex-wrap flex-1">
            {QUICK_TOPICS.map((label) => (
              <button key={label} onClick={() => handleSend(label)}
                className="bg-brand-card border border-brand-orange rounded-pill px-4 py-2 text-sm text-brand-text whitespace-nowrap hover:bg-brand-peach transition-colors cursor-pointer">
                {label}
              </button>
            ))}
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-peach flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#E8956D"/>
              <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" stroke="#E8956D" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {(!activeChat || activeChat.messages.length === 0) && (
            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted text-lg gap-3 opacity-70 mt-20">
              <span className="text-5xl">💬</span>
              Start a conversation! Ask me anything about parenting.
            </div>
          )}
          {activeChat?.messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-6 pb-5 pt-3 flex items-center gap-3">
          <div className="flex-1 bg-white border border-brand-orange rounded-[16px] flex items-center px-5 h-14">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border-none outline-none bg-transparent font-sans text-lg text-brand-text placeholder:text-brand-muted" />
          </div>
          <button onClick={() => handleSend()}
            className="w-14 h-14 bg-brand-orange hover:bg-brand-orange-dark rounded-full flex items-center justify-center shrink-0 transition-colors border-none cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <path d="M3 13L23 4L14 23L12 14L3 13Z" fill="white"/>
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}