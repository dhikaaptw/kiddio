"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

function SendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2L11 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="#3D2C2C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="#3D2C2C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="#3D2C2C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <polyline
        points="3 6 5 6 21 6"
        stroke="#FF4D4D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
        stroke="#FF4D4D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AIIcon() {
  return (
    <div className="w-12 h-12 rounded-full bg-[#E8956D] flex items-center justify-center flex-shrink-0 shadow-md">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z"
          stroke="white"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  );
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm Kiddio, your parenting assistant 👋 How can I help you today?",
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dotsOpenId, setDotsOpenId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("kiddio_sessions");

    if (stored) {
      const parsed: ChatSession[] = JSON.parse(stored);
      setSessions(parsed);

      if (parsed.length > 0) {
        setActiveId(parsed[0].id);
      }
    } else {
      createNewSession(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [sessions, activeId]);

  function saveSessions(updated: ChatSession[]) {
    localStorage.setItem("kiddio_sessions", JSON.stringify(updated));
    setSessions(updated);
  }

  function createNewSession(initial = false) {
    const id = generateId();

    const newSession: ChatSession = {
      id,
      title: "New Chat",
      messages: [WELCOME_MESSAGE],
      createdAt: Date.now(),
    };

    const updated = initial ? [newSession] : [newSession, ...sessions];

    saveSessions(updated);
    setActiveId(id);
  }

  function deleteSession(id: string) {
    const updated = sessions.filter((s) => s.id !== id);

    saveSessions(updated);

    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
      } else {
        createNewSession(true);
      }
    }

    setDotsOpenId(null);
  }

  const activeSession = sessions.find((s) => s.id === activeId);

  async function sendMessage() {
    if (!input.trim() || loading || !activeSession) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
    };

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    const withUser = {
      ...activeSession,
      messages: [...activeSession.messages, userMsg],
      title:
        activeSession.title === "New Chat"
          ? userMsg.content.slice(0, 40)
          : activeSession.title,
    };

    const updatedSessions = sessions.map((s) =>
      s.id === activeId ? withUser : s
    );

    saveSessions(updatedSessions);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "This is a demo response. Your AI response will appear here.",
      };

      const finalSession = {
        ...withUser,
        messages: [...withUser.messages, assistantMsg],
      };

      saveSessions(
        updatedSessions.map((s) =>
          s.id === activeId ? finalSession : s
        )
      );

      setLoading(false);
    }, 1200);
  }

  return (
    <div
      className="h-screen w-screen flex overflow-hidden bg-[#FDF6F0]"
      style={{
        fontFamily: "Fredoka, Inter, sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Fredoka+One&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .kiddio-textarea:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }

        .kiddio-textarea {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
      `}</style>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside
          className="h-full flex flex-col border-r border-[#ECD9CC] bg-[#FFF7F2]"
          style={{
            width: 320,
          }}
        >
          {/* HEADER */}
          <div className="px-6 pt-6 pb-5 flex items-center justify-between">
            <span
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                fontSize: 32,
                color: "#3D2C2C",
              }}
            >
              Chat History
            </span>

            <button
              onClick={() => setSidebarOpen(false)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#FAD8C7] hover:scale-105 transition"
            >
              <CloseIcon />
            </button>
          </div>

          {/* SESSIONS */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="relative">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setActiveId(s.id);
                    setDotsOpenId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveId(s.id);
                      setDotsOpenId(null);
                    }
                  }}
                  className="w-full rounded-[18px] px-5 py-5 flex items-center gap-4 transition-all cursor-pointer"
                  style={{
                    background:
                      s.id === activeId ? "#FAD8C7" : "#FFF1E7",
                    border:
                      s.id === activeId
                        ? "1.5px solid #EFC1A8"
                        : "1.5px solid #F3DDD0",
                  }}
                >
                  <ChatIcon />

                  <span
                    className="truncate flex-1 text-left"
                    style={{
                      color: "#3D2C2C",
                      fontSize: 20,
                      fontFamily: "'Fredoka', sans-serif",
                    }}
                  >
                    {s.title}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDotsOpenId(
                        dotsOpenId === s.id ? null : s.id
                      );
                    }}
                    className="p-1 rounded-full hover:bg-[#E8956D]/20 transition text-[#3D2C2C]"
                  >
                    <DotsIcon />
                  </button>
                </div>

                {dotsOpenId === s.id && (
                  <div
                    className="absolute right-0 top-[74px] z-50 rounded-[16px] shadow-lg py-3 px-4"
                    style={{
                      background: "#FFF7F2",
                      border: "1px solid #E8B89B",
                    }}
                  >
                    <button
                      onClick={() => deleteSession(s.id)}
                      className="flex items-center gap-2"
                      style={{
                        color: "#FF4D4D",
                        fontFamily: "'Fredoka', sans-serif",
                        fontSize: 18,
                      }}
                    >
                      <TrashIcon />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* NEW CHAT */}
          <div className="p-6">
            <button
              onClick={() => createNewSession()}
              className="w-full h-[60px] rounded-[20px] transition hover:scale-[1.01]"
              style={{
                background: "#E8956D",
                color: "white",
                fontSize: 22,
                fontWeight: 500,
                fontFamily: "'Fredoka', sans-serif",
                boxShadow: "0 10px 24px rgba(232,149,109,0.18)",
              }}
            >
              New chat +
            </button>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <div className="flex flex-col flex-1 h-full relative">
        {/* NAVBAR */}
        <div
          className="h-[76px] px-8 flex items-center"
          style={{
            borderBottom: "1px solid #F2D8CA",
            background: "rgba(253,246,240,0.92)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#FAD8C7] transition"
              >
                <MenuIcon />
              </button>
            )}

            <span
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: "#3D2C2C",
                fontFamily: "'Fredoka', sans-serif",
              }}
            >
              Kiddio
            </span>
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[980px] mx-auto px-8 pt-10 pb-40">
            {activeSession?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-4 mb-8 ${msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                {msg.role === "assistant" && <AIIcon />}

                <div
                  className="px-7 py-5 rounded-[28px]"
                  style={{
                    background:
                      msg.role === "user"
                        ? "#FAD8C7"
                        : "#FFF7F1",
                    border:
                      msg.role === "assistant"
                        ? "1.5px solid #F3D6C4"
                        : "1.5px solid transparent",
                    color: "#3D2C2C",
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 400,
                    fontSize: "20px",
                    lineHeight: "34px",
                    maxWidth:
                      msg.role === "user" ? "520px" : "640px",
                    boxShadow:
                      "0 4px 18px rgba(232,149,109,0.08)",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 items-end justify-start mb-8">
                <AIIcon />

                <div
                  className="px-6 py-5 rounded-[28px]"
                  style={{
                    background: "#FFF7F1",
                    border: "1.5px solid #F3D6C4",
                  }}
                >
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full animate-bounce"
                        style={{
                          background: "#E8956D",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="sticky bottom-0 px-8 pb-8 pt-5 bg-gradient-to-t from-[#FDF6F0] via-[#FDF6F0] to-transparent">
          <div className="w-full max-w-[980px] mx-auto">
            <div
              className="w-full overflow-hidden flex items-end gap-4 px-7 py-5 rounded-[32px] backdrop-blur-sm"
              style={{
                background: "rgba(255,255,255,0.96)",
                border: "1.5px solid #EBCFBE",
                boxShadow:
                  "0 8px 30px rgba(232,149,109,0.10)",
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);

                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 220) +
                    "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask Kiddio anything..."
                className="kiddio-textarea flex-1 bg-transparent resize-none overflow-y-auto placeholder:text-[#B08D80] outline-none ring-0 border-0"
                style={{
                  fontSize: 20,
                  color: "#3D2C2C",
                  fontFamily: "'Fredoka', sans-serif",
                  lineHeight: "34px",
                  maxHeight: 220,
                  outline: "none",
                  boxShadow: "none",
                  WebkitAppearance: "none",
                }}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex-shrink-0 w-[58px] h-[58px] rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: "#E8956D",
                  boxShadow:
                    "0 8px 20px rgba(232,149,109,0.24)",
                }}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}