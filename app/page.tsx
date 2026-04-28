"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChatIcon, HeartIcon, GrowthIcon, SmileIcon } from "@/components/icons";

function StartChatButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: "16px",
        color: "#E8956D",
        backgroundColor: "#FFFFFF",
        border: "none",
        borderRadius: "16px",
        padding: "12px 28px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s ease",
        boxShadow: pressed
          ? "0 1px 0px rgba(0,0,0,0.15)"
          : hovered
            ? "0 8px 20px rgba(0,0,0,0.18)"
            : "0 3px 10px rgba(0,0,0,0.1)",
        transform: pressed
          ? "translateY(4px) scale(0.97)"
          : hovered
            ? "translateY(-3px)"
            : "translateY(0) scale(1)",
        filter: pressed ? "brightness(0.96)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      Start Chat →
    </button>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#FDF1E5",
        borderRadius: "14px",
        padding: "24px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "10px",
        transition: "all 0.25s ease",
        border: hovered ? "2px solid #E8956D" : "2px solid transparent",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 10px 24px rgba(232,149,109,0.2)" : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: "36px", height: "36px", color: "#E8956D" }}>{icon}</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "16px", color: "#3D2C2C" }}>{title}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "14px", color: "#3D2C2C" }}>{desc}</div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  const handleStartChat = () => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "#FDF6F0", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* HERO SECTION */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          minHeight: "100vh",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "80px 0 0 120px",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: "0 0 480px", zIndex: 1 }}>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "58px",
              lineHeight: 1.1,
              color: "#3D2C2C",
              marginBottom: "20px",
            }}
          >
            Your AI Companion<br />for Parenting
          </h1>

          <p
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#3D2C2C",
              marginBottom: "36px",
              maxWidth: "360px",
            }}
          >
            Kiddio helps you navigate parenting with information, practical tips, and a caring heart.
          </p>

          <button
            onClick={handleStartChat}
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "18px",
              color: "#FFFFFF",
              backgroundColor: "#E8956D",
              border: "none",
              borderRadius: "16px",
              padding: "14px 40px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 0px #c9714d",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 7px 0px #c9714d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 0px #c9714d";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(2px)";
              e.currentTarget.style.boxShadow = "0 2px 0px #c9714d";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 7px 0px #c9714d";
            }}
          >
            Start Now
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            alignSelf: "stretch",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/no_bg_start.png"
            alt="Kiddio mascot"
            style={{
              height: "85vh",
              width: "680px",
              objectFit: "contain",
              objectPosition: "center right",
              display: "block",
              marginBottom: "-40px",
            }}
          />
        </div>
      </section>

      {/* WHAT KIDDIO CAN DO SECTION */}
      <section
        id="features"
        style={{ padding: "60px 60px", maxWidth: "1440px", margin: "0 auto" }}
      >
        <h2
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "30px",
            color: "#3D2C2C",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          What Kiddio can do
        </h2>
        <p
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "16px",
            color: "#3D2C2C",
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          Smart, caring support for every stage of your parenting journey.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          <FeatureCard icon={<ChatIcon />} title="Parenting Q&A" desc="Get instant answer to your parenting questions." />
          <FeatureCard icon={<HeartIcon />} title="Personalized Advice" desc="Advice tailored to your child's needs." />
          <FeatureCard icon={<GrowthIcon />} title="Growth Tracking" desc="Track milestones and development." />
          <FeatureCard icon={<SmileIcon />} title="Emotional Support" desc="A supportive companion for your parenting journey." />
        </div>
      </section>

      <section style={{ padding: "0 60px 60px", maxWidth: "1440px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#FAD8C7",
            borderRadius: "16px",
            padding: "40px 60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-30px",
              bottom: "-40px",
              width: "160px",
              height: "160px",
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: "50%",
            }}
          />

          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <h2
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "28px",
                color: "#3D2C2C",
                marginBottom: "12px",
                maxWidth: "500px",
                lineHeight: 1.2,
              }}
            >
              Start your parenting journey with Kiddio today
            </h2>
            <p
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "16px",
                color: "#3D2C2C",
                maxWidth: "420px",
              }}
            >
              Ask anything about your child and get personalized support.
            </p>
          </div>

          <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
            <StartChatButton onClick={handleStartChat} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#FDF1E5", padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <img
          src="/images/no_bg_footer.png"
          alt="footer decoration"
          style={{
            position: "absolute",
            right: "0",
            bottom: "0",
            width: "110px",
            opacity: 0.6,
            zIndex: 0,
          }}
        />
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "0 120px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ flex: "0 0 300px" }}>
            <div
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "32px",
                color: "#E8956D",
                marginBottom: "10px",
              }}
            >
              Kiddio
            </div>
            <p
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "14px",
                color: "#3D2C2C",
                maxWidth: "220px",
                lineHeight: 1.5,
              }}
            >
              Your AI companion for parenting support, guidance, and care.
            </p>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              gap: "120px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "16px",
                  color: "#3D2C2C",
                  marginBottom: "10px",
                }}
              >
                Product
              </div>
              <button
                onClick={scrollToFeatures}
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "14px",
                  color: "#3D2C2C",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8956D")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3D2C2C")}
              >
                Features
              </button>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: "16px",
                  color: "#3D2C2C",
                  marginBottom: "10px",
                }}
              >
                Support
              </div>
              <div
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "14px",
                  color: "#3D2C2C",
                  lineHeight: 2.2,
                }}
              >
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <div
                    key={item}
                    style={{ cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#E8956D")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.color = "#3D2C2C")}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}