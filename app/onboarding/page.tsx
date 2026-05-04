"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ToneOption = "casual" | "empathetic" | "precise";

interface ChildData {
  name: string;
  ageMonths: number; // stored in months (0–60)
  tone: ToneOption;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatAge(months: number): string {
  if (months < 12) return `${months} bulan`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m === 0 ? `${y} tahun` : `${y} tahun ${m} bulan`;
}

// ── Step stepper ─────────────────────────────────────────────────────────────

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-[40px]">
      {/* Step 1 */}
      <div className="flex flex-col items-center gap-[6px]">
        <div
          className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-[22px]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: step === 1 ? "#E8956D" : "#FAD8C7",
            color: step === 1 ? "#fff" : "#3D2C2C",
            transition: "all 0.3s",
          }}
        >
          1
        </div>
        <span className="text-[13px] text-[#3D2C2C]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Child info
        </span>
      </div>

      {/* Line */}
      <div
        className="h-[2px] mb-[20px]"
        style={{ width: '140px', background: '#E8956D', borderRadius: '1px' }}
      />

      {/* Step 2 */}
      <div className="flex flex-col items-center gap-[6px]">
        <div
          className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-[22px]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: step === 2 ? "#E8956D" : "#FAD8C7",
            color: step === 2 ? "#fff" : "#3D2C2C",
            transition: "all 0.3s",
          }}
        >
          2
        </div>
        <span className="text-[13px] text-[#3D2C2C]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          All Set
        </span>
      </div>
    </div>
  );
}

// ── Tone Card ─────────────────────────────────────────────────────────────────

const toneOptions: { key: ToneOption; label: string; desc: string }[] = [
  { key: "casual",     label: "Casual",      desc: "Friendly and relaxed" },
  { key: "empathetic", label: "Empathetic",  desc: "Warm and understanding" },
  { key: "precise",    label: "Precise",     desc: "Clear and straightforward" },
];

function ToneCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof toneOptions)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center justify-center gap-[6px] rounded-[16px] px-[12px] py-[18px] border-[1.5px] transition-all duration-200 cursor-pointer"
      style={{
        width: '160px',
        minHeight: '130px',
        background: selected ? "#E8956D" : "#FAD8C7",
        borderColor: selected ? "#c9714d" : "#E8956D",
        transform: selected ? "translateY(-3px)" : "none",
        boxShadow: selected ? "0 6px 16px rgba(232,149,109,0.35)" : "none",
      }}
    >
      <span
        className="text-[20px]"
        style={{
          fontFamily: "'Fredoka One', cursive",
          color: selected ? "#fff" : "#3D2C2C",
        }}
      >
        {option.label}
      </span>
      <span
        className="text-[14px] text-center leading-[1.3]"
        style={{
          fontFamily: "'Fredoka', sans-serif",
          color: selected ? "rgba(255,255,255,0.85)" : "#3D2C2C",
        }}
      >
        {option.desc}
      </span>
    </button>
  );
}

// ── Age Selector ──────────────────────────────────────────────────────────────

function AgeSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  // years 0-5, months 0-11 (but cap at 5y 0m = 60 months)
  const years = Math.floor(value / 12);
  const months = value % 12;

  const setYears = (y: number) => {
    const newVal = Math.min(y * 12 + months, 60);
    onChange(newVal);
  };
  const setMonths = (m: number) => {
    const newVal = Math.min(years * 12 + m, 60);
    onChange(newVal);
  };

  return (
    <div className="flex items-center gap-[12px]">
      {/* Years */}
      <div className="flex items-center gap-[8px]">
        <button
          onClick={() => setYears(Math.max(0, years - 1))}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[20px] bg-[#E8956D] text-white border-none cursor-pointer transition-opacity hover:opacity-80"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          −
        </button>
        <span
          className="w-[28px] text-center text-[22px]"
          style={{ fontFamily: "'Fredoka', sans-serif", color: "#3D2C2C" }}
        >
          {years}
        </span>
        <button
          onClick={() => setYears(Math.min(5, years + 1))}
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[20px] bg-[#E8956D] text-white border-none cursor-pointer transition-opacity hover:opacity-80"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
          disabled={value >= 60}
        >
          +
        </button>
        <span
          className="text-[18px] text-[#3D2C2C]"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          tahun
        </span>
      </div>

      {/* Months — hidden when 5 years (already max) */}
      {years < 5 && (
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => setMonths(Math.max(0, months - 1))}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[20px] bg-[#E8956D] text-white border-none cursor-pointer transition-opacity hover:opacity-80"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            −
          </button>
          <span
            className="w-[28px] text-center text-[22px]"
            style={{ fontFamily: "'Fredoka', sans-serif", color: "#3D2C2C" }}
          >
            {months}
          </span>
          <button
            onClick={() => setMonths(Math.min(11, months + 1))}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[20px] bg-[#E8956D] text-white border-none cursor-pointer transition-opacity hover:opacity-80"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            +
          </button>
          <span
            className="text-[18px] text-[#3D2C2C]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            bulan
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState(0);
  const [tone, setTone] = useState<ToneOption>("casual");
  const [nameError, setNameError] = useState("");

  const handleContinue = () => {
    if (!name.trim()) {
      setNameError("Masukkan nama anak kamu dulu ya!");
      return;
    }
    setNameError("");

    // Simpan ke localStorage (atau kirim ke API sesuai kebutuhan)
    const childData: ChildData = { name: name.trim(), ageMonths, tone };
    localStorage.setItem("childData", JSON.stringify(childData));
    localStorage.setItem("onboardingDone", "true");

    setStep(2);
  };

  const handleExplore = () => {
    router.push("/chat");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#FDF6F0" }}
    >
      {/* Dekor blob kiri atas */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "320px", height: "320px",
          borderRadius: "50%",
          background: "rgba(250,216,199,0.35)",
          top: "-80px", left: "-80px",
          filter: "blur(40px)",
        }}
      />
      {/* Dekor blob kanan bawah */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "280px", height: "280px",
          borderRadius: "50%",
          background: "rgba(232,149,109,0.12)",
          bottom: "-60px", right: "-60px",
          filter: "blur(40px)",
        }}
      />

      {/* Card utama */}
      <div
        className="relative z-10 w-full"
        style={{
          maxWidth: "680px",
          background: "rgba(253,246,240,0.85)",
          border: "1.5px solid #E8956D",
          borderRadius: "24px",
          padding: "48px 56px",
          boxShadow: "0 8px 40px rgba(232,149,109,0.12)",
          backdropFilter: "blur(8px)",
          margin: "0 16px",
        }}
      >
        <Stepper step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div
            style={{
              animation: "fadeSlideIn 0.35s ease",
            }}
          >
            <h1
              className="text-center mb-[6px]"
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "34px",
                color: "#3D2C2C",
                lineHeight: 1.2,
              }}
            >
              Let's get to know your child
            </h1>
            <p
              className="text-center mb-[36px]"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "16px",
                color: "#7a5c5c",
              }}
            >
              This information helps us provide personalized support for your little one.
            </p>

            {/* Name */}
            <div className="mb-[28px]">
              <label
                className="block mb-[8px] text-[18px]"
                style={{ fontFamily: "'Fredoka One', cursive", color: "#3D2C2C" }}
              >
                What's your child's name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value) setNameError("");
                }}
                placeholder="Contoh: Aiden"
                className="w-full rounded-[16px] px-[20px] py-[14px] text-[18px] outline-none border transition-all duration-200"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  background: "#FAD8C7",
                  borderColor: nameError ? "#e05050" : "#E8956D",
                  color: "#3D2C2C",
                  boxShadow: nameError ? "0 0 0 3px rgba(224,80,80,0.15)" : "none",
                }}
              />
              {nameError && (
                <p className="text-[13px] mt-[6px]" style={{ color: "#e05050", fontFamily: "'Fredoka', sans-serif" }}>
                  {nameError}
                </p>
              )}
            </div>

            {/* Age */}
            <div className="mb-[32px]">
              <label
                className="block mb-[12px] text-[18px]"
                style={{ fontFamily: "'Fredoka One', cursive", color: "#3D2C2C" }}
              >
                How old is your child?
              </label>
              <div
                className="w-full rounded-[16px] px-[20px] py-[14px] flex items-center justify-between"
                style={{
                  background: "#FAD8C7",
                  border: "1px solid #E8956D",
                }}
              >
                <AgeSelector value={ageMonths} onChange={setAgeMonths} />
                <span
                  className="text-[15px] ml-[12px] shrink-0"
                  style={{ fontFamily: "'Fredoka', sans-serif", color: "#9a7060" }}
                >
                  {formatAge(ageMonths)}
                </span>
              </div>
              <p
                className="text-[12px] mt-[6px]"
                style={{ fontFamily: "'Fredoka', sans-serif", color: "#b08070" }}
              >
                Rentang usia: 0 bulan – 5 tahun
              </p>
            </div>

            {/* Tone */}
            <div className="mb-[40px]">
              <label
                className="block mb-[14px] text-[18px]"
                style={{ fontFamily: "'Fredoka One', cursive", color: "#3D2C2C" }}
              >
                How should Kiddio respond to you?
              </label>
              <div className="flex gap-[16px] justify-between">
                {toneOptions.map((opt) => (
                  <ToneCard
                    key={opt.key}
                    option={opt}
                    selected={tone === opt.key}
                    onSelect={() => setTone(opt.key)}
                  />
                ))}
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={handleContinue}
              className="w-full py-[16px] rounded-[20px] text-[20px] text-white border-none cursor-pointer transition-all duration-200"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                background: "#E8956D",
                boxShadow: "0 4px 0 #c9714d",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-3px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 7px 0 #c9714d";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 4px 0 #c9714d";
              }}
              onMouseDown={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(2px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 2px 0 #c9714d";
              }}
              onMouseUp={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-3px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 7px 0 #c9714d";
              }}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div
            className="flex flex-col items-center text-center"
            style={{ animation: "fadeSlideIn 0.35s ease" }}
          >
            {/* Ilustrasi ceklis / konfeti sederhana */}
            <div
              className="flex items-center justify-center rounded-full mb-[24px]"
              style={{
                width: "88px", height: "88px",
                background: "linear-gradient(135deg, #FAD8C7, #E8956D)",
                fontSize: "42px",
                boxShadow: "0 6px 24px rgba(232,149,109,0.3)",
              }}
            >
              🎉
            </div>

            <h1
              className="mb-[16px]"
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "40px",
                color: "#3D2C2C",
              }}
            >
              You're All Set!
            </h1>
            <p
              className="mb-[12px]"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "22px",
                color: "#3D2C2C",
                lineHeight: 1.4,
                maxWidth: "380px",
              }}
            >
              Let's start your parenting journey here.
            </p>
            <p
              className="mb-[40px]"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "16px",
                color: "#9a7060",
              }}
            >
              Siap membantu kamu dan <strong>{name}</strong> 💛
            </p>

            <button
              onClick={handleExplore}
              className="px-[60px] py-[16px] rounded-[20px] text-[20px] text-white border-none cursor-pointer transition-all duration-200"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                background: "#E8956D",
                boxShadow: "0 4px 0 #c9714d",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-3px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 7px 0 #c9714d";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 4px 0 #c9714d";
              }}
              onMouseDown={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(2px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 2px 0 #c9714d";
              }}
              onMouseUp={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-3px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 7px 0 #c9714d";
              }}
            >
              Explore Now
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}