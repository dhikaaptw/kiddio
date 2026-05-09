"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  MessageSquare,
  Settings,
  Moon,
  HeartPulse,
  Smile,
  Utensils,
  Users,
  ArrowRight,
  LogOut,
} from "lucide-react";

const QUICK_TOPICS = [
  { id: "sleep", label: "Sleep Tips", icon: Moon },
  { id: "nutrition", label: "Feeding & Nutrition", icon: Utensils },
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "behavior", label: "Behavior & Emotions", icon: Smile },
  { id: "advice", label: "Parental Advice", icon: Users },
];

export default function Homepage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleStartChat = (topic?: string) => {
    const url = topic
      ? `/chat?topic=${encodeURIComponent(topic)}`
      : "/chat";
    router.push(url);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-brand-bg font-['Fredoka'] text-brand-text">
      <aside className="w-56 lg:w-64 bg-brand-card border-r border-brand-orange flex flex-col px-4 py-6 fixed h-full z-20 shrink-0">
        <div className="font-['Fredoka_One'] text-3xl lg:text-4xl text-brand-orange mb-10 mt-1 px-2 cursor-default">
          Kiddio
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 px-3 py-2.5 bg-brand-peach rounded-xl text-base font-normal w-full shadow-sm">
            <Home size={20} className="text-brand-orange shrink-0" />
            Home
          </button>

          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-peach/50 rounded-xl text-base font-normal transition-all w-full"
          >
            <MessageSquare size={20} className="shrink-0" />
            Chat
          </button>

          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-brand-peach/50 rounded-xl text-base font-normal transition-all w-full"
          >
            <Settings size={20} className="shrink-0" />
            Settings
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-base font-normal transition-all"
        >
          <LogOut size={20} className="shrink-0" />
          Logout
        </button>
      </aside>

      <main className="ml-56 lg:ml-64 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 lg:px-10 lg:py-10">
          {/* Header */}
          <header className="mb-8">
            <h2 className="font-['Fredoka_One'] text-3xl lg:text-4xl mb-1">
              Hi, Parents!
            </h2>
            <p className="text-base lg:text-lg text-brand-text/70">
              How can I support you today?
            </p>
          </header>

          <section className="mb-10">
            <h3 className="font-['Fredoka_One'] text-xl lg:text-2xl mb-4">
              Quick Topics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleStartChat(topic.label)}
                  className="flex flex-col items-center justify-center aspect-square bg-brand-bg border border-brand-orange rounded-2xl p-4 hover:scale-105 hover:shadow-md transition-all group cursor-pointer"
                >
                  <topic.icon
                    size={32}
                    className="mb-2 text-brand-orange group-hover:scale-110 transition-transform"
                  />
                  <span className="font-['Fredoka_One'] text-sm text-center leading-tight">
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-brand-peach border border-brand-orange rounded-3xl p-7 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-sm">
              <h3 className="font-['Fredoka_One'] text-2xl lg:text-3xl mb-3 leading-snug">
                Start a conversation with Kiddio
              </h3>
              <p className="text-sm lg:text-base opacity-90">
                Ask anything about your child and get personalized support.
              </p>
            </div>

            <button
              onClick={() => handleStartChat()}
              className="bg-brand-orange text-white px-7 py-3 rounded-2xl text-base font-['Fredoka'] flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Chat <ArrowRight size={20} />
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}