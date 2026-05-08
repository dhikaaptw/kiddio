"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ToneOption = "casual" | "empathetic" | "precise";

interface ChildData {
  name: string;
  ageMonths: number;
  tone: ToneOption;
}

type ToneOptionItem = {
  key: ToneOption;
  label: string;
  desc: string;
};

function formatAge(months: number): string {
  if (months < 12) return `${months} months`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m === 0 ? `${y} years` : `${y} years ${m} months`;
}

const toneOptions: ToneOptionItem[] = [
  { key: "casual", label: "Casual", desc: "Friendly and relaxed" },
  { key: "empathetic", label: "Empathetic", desc: "Warm and understanding" },
  { key: "precise", label: "Precise", desc: "Clear and straightforward" },
];

function ToneCard({
  option,
  selected,
  onSelect,
}: {
  option: ToneOptionItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-[16px] py-3 px-2 border transition w-full min-h-25
      ${selected
          ? "bg-brand-orange text-white shadow-md border-brand-orange"
          : "bg-brand-peach border-brand-orange text-[#4A352F]"
        }`}
    >
      <span className="text-[16px] font-bold">{option.label}</span>
      <span className="text-[13px] text-center px-1 opacity-90 leading-snug">
        {option.desc}
      </span>
    </button>
  );
}

function AgeSelector({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  const years = value !== null ? Math.floor(value / 12) : 0;
  const months = value !== null ? value % 12 : 0;

  const setYears = (y: number) => {
    if (y === 5) onChange(60);
    else onChange(y * 12 + months);
  };

  const setMonths = (m: number) => {
    onChange(years * 12 + m);
  };

  const selectClass =
    "h-[44px] w-[90px] px-3 rounded-[12px] bg-white border-2 border-[#E8956D] text-[#4A352F] text-[15px] font-semibold outline-none cursor-pointer";

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <select
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          size={1}
          className={selectClass}
          style={{ maxHeight: "none" }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <span className="text-[15px] text-[#4A352F] font-medium">years</span>
      </div>

      {years < 5 && (
        <div className="flex items-center gap-2">
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            size={1}
            className={selectClass}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <span className="text-[15px] text-[#4A352F] font-medium">months</span>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [tone, setTone] = useState<ToneOption | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    age?: string;
    tone?: string;
  }>({});

  const validate = () => {
    const newErrors: { name?: string; age?: string; tone?: string } = {};
    if (!name.trim()) newErrors.name = "Please enter your child's name.";
    if (ageMonths === null) newErrors.age = "Please select your child's age.";
    if (!tone) newErrors.tone = "Please select a response style.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/user/child", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          age: Math.floor(ageMonths! / 12),
          aiStyle: tone === "casual" ? "Casual" : tone === "empathetic" ? "Empathetic" : "Precise",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ name: data.error || "failed to save data"});
        return;
      }

      localStorage.setItem("onboardingComplete", "true");
      setStep(2);

    } catch (error) {
      setErrors({ name: "error occured" });
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="bg-white border border-brand-orange rounded-3xl w-full max-w-200 shadow-sm px-8 md:px-16 pt-10 pb-10">

        {step === 1 && (
          <div className="max-w-150 mx-auto w-full">
            <h1 className="text-[30px] md:text-[34px] font-extrabold text-center mb-2 text-[#4A352F]">
              Let's get to know your child
            </h1>
            <p className="text-[15px] md:text-[16px] text-center mb-8 text-[#4A352F]">
              This information helps us provide personalized support for your little one.
            </p>

            {/* NAME */}
            <div className="w-full mb-5">
              <label className="block mb-2 text-[16px] font-bold text-[#4A352F]">
                What's your child's name?
              </label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Example: Anna"
                className="w-full h-12 px-4 rounded-xl bg-brand-peach border border-brand-orange outline-none text-[#4A352F] text-[16px] placeholder:text     -[#4A352F]/50"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* AGE */}
            <div className="w-full mb-5">
              <label className="block mb-2 text-[16px] font-bold text-[#4A352F]">
                How old is your child?
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-brand-peach border border-brand-orange flex items-center gap-4">
                <AgeSelector
                  value={ageMonths}
                  onChange={(v) => {
                    setAgeMonths(v);
                    setErrors((prev) => ({ ...prev, age: undefined }));
                  }}
                />
                {ageMonths !== null && (
                  <span className="text-[14px] font-semibold text-[#4A352F] ml-auto">
                    {formatAge(ageMonths)}
                  </span>
                )}
              </div>
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            {/* TONE */}
            <div className="w-full mb-6">
              <label className="block mb-2 text-[16px] font-bold text-[#4A352F]">
                How should Kiddio respond to you?
              </label>
              <div className="grid grid-cols-3 gap-3 w-full">
                {toneOptions.map((t) => (
                  <ToneCard
                    key={t.key}
                    option={t}
                    selected={tone === t.key}
                    onSelect={() => {
                      setTone(t.key);
                      setErrors((prev) => ({ ...prev, tone: undefined }));
                    }}
                  />
                ))}
              </div>
              {errors.tone && (
                <p className="text-red-500 text-sm mt-1">{errors.tone}</p>
              )}
            </div>

            {/* CONTINUE BUTTON*/}
            <div className="flex justify-center pt-2 pb-0">
              <button
                onClick={handleContinue}
                className="w-full max-w-90 h-13 bg-brand-orange hover:bg-[#D67F54] transition text-white text-[18px] font-bold rounded-[16px]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center text-center max-w-125 mx-auto py-6">
            <h1 className="text-[38px] md:text-[44px] font-extrabold mb-4 text-[#4A352F]">
              You're All Set!
            </h1>
            <p className="text-[18px] md:text-[22px] mb-4 text-[#4A352F]">
              Let's start your parenting journey here.
            </p>
            <p className="mb-10 text-brand-muted text-[16px]">
              Ready to help you and{" "}
              <strong className="text-[#4A352F]">{name}</strong> thrive together! 🌟
            </p>

            {/* EXPLORE NOW BUTTON*/}
            <button
              onClick={() => router.push("/chat")}
              className="w-full max-w-90 h-13 bg-brand-orange hover:bg-[#D67F54] transition text-white text-[18px] font-bold rounded-[16px]"
            >
              Explore Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}