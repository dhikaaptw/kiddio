"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChatIcon, HeartIcon, GrowthIcon, SmileIcon } from "@/components/icons";

export default function LandingPage() {
  const router = useRouter();
  const handleStartChat = () => router.push(localStorage.getItem("token") ? "/chat" : "/login");

  return (
    <div className="bg-[#FDF6F0] min-h-screen w-full overflow-x-hidden">
      
      <Navbar />

      <section className="flex items-center min-h-screen max-w-[1440px] mx-auto px-[80px] md:px-[140px] pt-[80px] overflow-hidden">
        <div className="flex-[0_0_480px] z-[1]">
          <h1 className="text-[58px] leading-[1.1] text-[#3D2C2C] mb-[20px]" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Your AI Companion<br />for Parenting
          </h1>
          <p className="text-[18px] leading-[1.6] text-[#3D2C2C] mb-[36px] max-w-[360px]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Kiddio helps you navigate parenting with information, practical tips, and a caring heart.
          </p>
          <button
            onClick={handleStartChat}
            className="text-[18px] !text-white bg-[#E8956D] border-none rounded-[16px] px-[40px] py-[14px] cursor-pointer transition-all duration-200 shadow-[0_4px_0px_#c9714d] hover:-translate-y-[3px] hover:shadow-[0_7px_0px_#c9714d] active:translate-y-[2px] active:shadow-[0_2px_0px_#c9714d]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Start Now
          </button>
        </div>

        <div className="flex-1 flex justify-end items-center self-stretch overflow-hidden">
          <img src="/images/no_bg_start.png" alt="Mascot" className="h-[85vh] w-[680px] object-contain object-right block -mb-[40px]" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-[60px] py-[60px] max-w-[1440px] mx-auto">
        <h2 className="text-[30px] text-[#3D2C2C] text-center mb-[12px]" style={{ fontFamily: "'Fredoka One', cursive" }}>What Kiddio can do</h2>
        <p className="text-[16px] text-[#3D2C2C] text-center mb-[36px]" style={{ fontFamily: "'Fredoka', sans-serif" }}>Smart, caring support for every stage of your parenting journey.</p>

        <div className="grid grid-cols-4 gap-[20px]">
          {[ 
            { icon: <ChatIcon />, title: "Parenting Q&A", desc: "Get instant answer to your parenting questions." },
            { icon: <HeartIcon />, title: "Personalized Advice", desc: "Advice tailored to your child's needs." },
            { icon: <GrowthIcon />, title: "Growth Tracking", desc: "Track milestones and development." },
            { icon: <SmileIcon />, title: "Emotional Support", desc: "A supportive companion for your parenting journey." }
          ].map((f, i) => (
            <div key={i} className="bg-[#FDF1E5] rounded-[14px] px-[18px] py-[24px] flex flex-col items-center text-center gap-[10px] transition-all duration-250 border-2 border-transparent hover:border-[#E8956D] hover:-translate-y-[5px] hover:shadow-[0_10px_24px_rgba(232,149,109,0.2)]">
              <div className="w-[36px] h-[36px] text-[#E8956D]">{f.icon}</div>
              <div className="text-[16px]" style={{ fontFamily: "'Fredoka One', cursive" }}>{f.title}</div>
              <div className="text-[14px]" style={{ fontFamily: "'Fredoka', sans-serif" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-[60px] pb-[60px] max-w-[1440px] mx-auto">
        <div className="bg-[#FAD8C7] rounded-[16px] px-[60px] py-[40px] flex items-center justify-between relative overflow-hidden">
          <div className="absolute bg-white/30 rounded-full" style={{ width: '160px', height: '160px', left: '-30px', bottom: '-40px', zIndex: 0 }} />
          
          <div className="flex-1 relative z-[1]">
            <h2 className="text-[28px] text-[#3D2C2C] mb-[12px] max-w-[500px] leading-[1.2]" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Start your parenting journey with Kiddio today
            </h2>
            <p className="text-[16px] text-[#3D2C2C]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Ask anything about your child and get personalized support.
            </p>
          </div>

          <div className="shrink-0 relative z-[1]">
            {/* ✅ FIX: sama persis animasinya dengan tombol Start Now */}
            <button
              onClick={handleStartChat}
              className="text-[16px] !text-[#E8956D] bg-white border-none rounded-[16px] px-[28px] py-[12px] cursor-pointer transition-all duration-200 shadow-[0_4px_0px_#e0b8a8] hover:-translate-y-[3px] hover:shadow-[0_7px_0px_#e0b8a8] active:translate-y-[2px] active:shadow-[0_2px_0px_#e0b8a8]"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              Start Chat →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FDF1E5] py-[48px] relative overflow-hidden">
        
        <img 
          src="/images/no_bg_footer.png" 
          alt="leaf" 
          className="absolute right-[-20px] bottom-[-20px] pointer-events-none" 
          style={{ width: '140px', opacity: 0.4, zIndex: 0 }} 
        />

        <div className="max-w-[1440px] mx-auto px-[60px] md:px-[120px] flex justify-between items-start relative z-[1]">
          
          <div className="flex-[0_0_300px]">
            <div className="text-[32px] text-[#E8956D] mb-[10px]" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Kiddio
            </div>
            <p className="text-[14px] text-[#3D2C2C] max-w-[220px] leading-[1.5]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Your AI companion for parenting support, guidance, and care.
            </p>
          </div>

          <div className="flex-1 flex justify-center gap-[120px]">
            <div>
              <div className="text-[16px] text-[#3D2C2C] mb-[10px]" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Product
              </div>
              {/* ✅ FIX: scroll smooth ke section #features */}
              <div
                className="text-[14px] cursor-pointer hover:text-[#E8956D] transition-colors"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Features
              </div>
            </div>

            <div>
              <div className="text-[16px] text-[#3D2C2C] mb-[10px]" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Support
              </div>
              <div className="text-[14px] leading-[2.2]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                <div className="cursor-pointer hover:text-[#E8956D]">Privacy Policy</div>
                <div className="cursor-pointer hover:text-[#E8956D]">Terms of Service</div>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}