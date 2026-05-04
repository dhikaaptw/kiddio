"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/chat");
    } catch {
      setError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  };

  const inputClass = (field: string) => `
    w-full border rounded-[12px] px-[16px] py-[10px] text-[15px] text-[#3D2C2C] outline-none bg-white transition-all duration-200 box-border
    ${focusedField === field ? "border-2 border-[#E8956D] shadow-[0_0_0_3px_rgba(232,149,109,0.15)]" : "border-[#E8956D] shadow-none"}
  `;

  return (
    <div className="bg-[#FDF6F0] min-h-screen flex items-center justify-center p-[20px]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
      <div className="bg-white border border-[#E8956D] rounded-[20px] px-[44px] py-[32px] w-full max-w-[460px] shadow-[0_8px_32px_rgba(232,149,109,0.12)]">
        <div className="text-[36px] text-[#E8956D] text-center mb-[2px]" style={{ fontFamily: "'Fredoka One', cursive" }}>Kiddio</div>
        <p className="text-[15px] text-[#9E7E7A] text-center mb-[24px]">Welcome back, Parents! 👋</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-[14px]">
          <div>
            <label className="text-[16px] text-[#3D2C2C] block mb-[5px]" style={{ fontFamily: "'Fredoka One', cursive" }}>Email</label>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onFocus={() => setFocusedField("email")} 
              onBlur={() => setFocusedField(null)} 
              required 
              className={inputClass("email")} 
            />
          </div>
          <div>
            <label className="text-[16px] text-[#3D2C2C] block mb-[5px]" style={{ fontFamily: "'Fredoka One', cursive" }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onFocus={() => setFocusedField("password")} 
              onBlur={() => setFocusedField(null)} 
              required 
              className={inputClass("password")} 
            />
          </div>

          {error && (
            <div className="bg-[#FFE5E5] border border-[#ffcccc] rounded-[10px] px-[14px] py-[10px] text-[#CC0000] text-[14px] text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#E8956D] !text-white text-[18px] border-none rounded-[14px] py-[14px] mt-[4px] cursor-pointer transition-all duration-200 shadow-[0_4px_0px_#c9714d] hover:-translate-y-[2px] hover:shadow-[0_6px_0px_#c9714d] active:translate-y-[2px] active:shadow-[0_2px_0px_#c9714d] disabled:opacity-70 disabled:cursor-not-allowed" 
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-[15px] text-[#3D2C2C] text-center mt-[18px]">
          Don&apos;t have an account? <Link href="/register" className="text-[#E8956D] no-underline font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}