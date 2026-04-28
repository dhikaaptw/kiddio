"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrasi gagal");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Terjadi kesalahan, coba lagi");
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: "100%",
    border: focusedField === field ? "2px solid #E8956D" : "1px solid #E8956D",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "15px",
    fontFamily: "'Fredoka', sans-serif",
    color: "#3D2C2C",
    outline: "none",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box" as const,
    transition: "all 0.2s ease",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(232,149,109,0.15)" : "none",
  });

  return (
    <div
      style={{
        backgroundColor: "#FDF6F0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fredoka', sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8956D",
          borderRadius: "20px",
          padding: "32px 44px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 8px 32px rgba(232,149,109,0.12)",
        }}
      >
        <div
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "36px",
            color: "#E8956D",
            textAlign: "center",
            marginBottom: "2px",
          }}
        >
          Kiddio
        </div>

        <p
          style={{
            fontSize: "15px",
            color: "#9E7E7A",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Make a new account and start your parenting journey with us!
        </p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "16px",
                color: "#3D2C2C",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("name")}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "16px",
                color: "#3D2C2C",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("email")}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "16px",
                color: "#3D2C2C",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle("password")}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#FFE5E5",
                border: "1px solid #ffcccc",
                borderRadius: "10px",
                padding: "10px 14px",
                color: "#CC0000",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#E8956D",
              color: "#FFFFFF",
              fontFamily: "'Fredoka One', cursive",
              fontSize: "18px",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s ease",
              boxShadow: "0 4px 0px #c9714d",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 0px #c9714d";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 0px #c9714d";
            }}
            onMouseDown={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(2px)";
                e.currentTarget.style.boxShadow = "0 2px 0px #c9714d";
              }
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 0px #c9714d";
            }}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            fontSize: "15px",
            color: "#3D2C2C",
            textAlign: "center",
            marginTop: "18px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#E8956D",
              fontFamily: "'Fredoka One', cursive",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}