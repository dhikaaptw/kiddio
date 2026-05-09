"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  MessageCircleMore,
  Heart,
  Sprout,
  Smile,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const handleStartChat = () => router.push(localStorage.getItem("token") ? "/chat" : "/login");

  return (
    <div className="bg-[# FDF6F0] min-h-screen w-full overflow-x-hidden">

      <Navbar />
      <section className="flex items-center min-h-screen max-w-360 mx-auto px-20 md:px-35 pt-20 overflow-hidden">
        <div className="flex-[0_0_480px] z-1">
          <h1 className="text-[58px] leading-[1.1] text-brand-text mb-5" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Your AI Companion<br />for Parenting
          </h1>
          <p className="text-[18px] leading-[1.6] text-brand-text mb-9 max-w-90" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Kiddio helps you navigate parenting with information, practical tips, and a caring heart.
          </p>
          <button
            onClick={handleStartChat}
            className="text-[18px] text-white! bg-brand-orange border-none rounded-[16px] px-10 py-3.5 cursor-pointer transition-all duration-200 shadow-[0_4px_0px_#c9714d] hover:-translate-y-0.75 hover:shadow-[0_7px_0px_#c9714d] active:translate-y-0.5 active:shadow-[0_2px_0px_#c9714d]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Start Now
          </button>
        </div>

        <div className="flex-1 flex justify-end items-center self-stretch overflow-hidden">
          <img src="/images/no_bg_start.png" alt="Mascot" className="h-[85vh] w-170 object-contain object-right block -mb-10" />
        </div>
      </section>

      <section id="features" className="px-15 py-15 max-w-360 mx-auto">
        <h2 className="text-[30px] text-brand-text text-center mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>What Kiddio can do</h2>
        <p className="text-[16px] text-brand-text text-center mb-9" style={{ fontFamily: "'Fredoka', sans-serif" }}>Smart, caring support for every stage of your parenting journey.</p>

        <div className="grid grid-cols-4 gap-5">
          {[
            {
              icon: <MessageCircleMore className="w-12 h-12 stroke-[1.8]" />,
              title: "Parenting Q&A",
              desc: "Get instant answer to your parenting questions."
            },
            {
              icon: <Heart className="w-12 h-12 stroke-[1.8]" />,
              title: "Personalized Advice",
              desc: "Advice tailored to your child's needs."
            },
            {
              icon: <Sprout className="w-12 h-12 stroke-[1.8]" />,
              title: "Growth Tracking",
              desc: "Track milestones and development."
            },
            {
              icon: <Smile className="w-12 h-12 stroke-[1.8]" />,
              title: "Emotional Support",
              desc: "A supportive companion for your parenting journey."
            }
          ].map((f, i) => (
            <div key={i} className="bg-brand-card rounded-[14px] px-4.5 py-6 flex flex-col items-center text-center gap-2.5 transition-all duration-250 border-2 border-transparent hover:border-brand-orange hover:-translate-y-1.25 hover:shadow-[0_10px_24px_rgba(232,149,109,0.2)]">
              <div className="w-9 h-9 text-brand-orange">{f.icon}</div>
              <div className="text-[16px]" style={{ fontFamily: "'Fredoka One', cursive" }}>{f.title}</div>
              <div className="text-[14px]" style={{ fontFamily: "'Fredoka', sans-serif" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-15 pb-15 max-w-360 mx-auto">
        <div className="bg-brand-peach rounded-[16px] px-15 py-10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute bg-white/30 rounded-full" style={{ width: '160px', height: '160px', left: '-30px', bottom: '-40px', zIndex: 0 }} />

          <div className="flex-1 relative z-1">
            <h2 className="text-[28px] text-brand-text mb-3 max-w-125 leading-[1.2]" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Start your parenting journey with Kiddio today
            </h2>
            <p className="text-[16px] text-brand-text" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Ask anything about your child and get personalized support.
            </p>
          </div>

          <div className="shrink-0 relative z-1">
            <button
              onClick={handleStartChat}
              className="text-[16px] text-brand-orange! bg-white border-none rounded-[16px] px-7 py-3 cursor-pointer transition-all duration-200 shadow-[0_4px_0px_#e0b8a8] hover:-translate-y-0.75 hover:shadow-[0_7px_0px_#e0b8a8] active:translate-y-0.5 active:shadow-[0_2px_0px_#e0b8a8]"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              Start Chat →
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-brand-card py-12 relative overflow-hidden">

        <img
          src="/images/no_bg_footer.png"
          alt="leaf"
          className="absolute -right-5 -bottom-5 pointer-events-none"
          style={{ width: '140px', opacity: 0.4, zIndex: 0 }}
        />

        <div className="max-w-360 mx-auto px-15 md:px-30 flex justify-between items-start relative z-1">

          <div className="flex-[0_0_300px]">
            <div className="text-[32px] text-brand-orange mb-2.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Kiddio
            </div>
            <p className="text-[14px] text-brand-text max-w-55 leading-normal" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Your AI companion for parenting support, guidance, and care.
            </p>
          </div>

          <div className="flex-1 flex justify-center gap-30">
            <div>
              <div className="text-[16px] text-brand-text mb-2.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Product
              </div>
              <div
                className="text-[14px] cursor-pointer hover:text-brand-orange transition-colors"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Features
              </div>
            </div>

            <div>
              <div className="text-[16px] text-brand-text mb-2.5" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Support
              </div>
              <div className="text-[14px] leading-[2.2]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                <div className="cursor-pointer hover:text-brand-orange">Privacy Policy</div>
                <div className="cursor-pointer hover:text-brand-orange">Terms of Service</div>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}