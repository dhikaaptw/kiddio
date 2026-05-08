"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AgeUnit = "months" | "years";
type ToneOption = "casual" | "empathetic" | "precise";

interface ChildProfile {
  id?: string;
  name: string;
  ageValue: number;
  ageUnit: AgeUnit;
}

const TONES: { id: ToneOption; label: string; desc: string }[] = [
  { id: "casual",     label: "Casual",     desc: "Friendly and relaxed"      },
  { id: "empathetic", label: "Empathetic", desc: "Warm and understanding"    },
  { id: "precise",    label: "Precise",    desc: "Clear and straightforward" },
];

function ageToMonths(value: number, unit: AgeUnit): number {
  return unit === "months" ? value : value * 12;
}

function monthsToDisplay(m: number): { value: number; unit: AgeUnit } {
  if (m < 12) return { value: m, unit: "months" };
  return { value: Math.floor(m / 12), unit: "years" };
}

function ageLabel(value: number, unit: AgeUnit, long = false): string {
  const w = unit === "months"
    ? (value === 1 ? "month" : "months")
    : (value === 1 ? "year" : "years");
  return long ? `${value} ${w} old` : `${value} ${w}`;
}

function getAuth(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#3D2C2C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ProfileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#E8956D" strokeWidth="2"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#E8956D" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#E8956D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <polyline points="3 6 5 6 21 6" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FF4D4D" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// ── Reusable ──────────────────────────────────────────────────────────────────
function Overlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40"
      style={{ background: "rgba(61,44,44,0.32)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    />
  );
}

function ModalBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed z-50 rounded-3xl shadow-2xl"
      style={{
        background: "#FDF6F0",
        border: "1.5px solid #E8956D",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(600px, 92vw)",
        padding: "40px",
        animation: "fadeUp .22s ease",
      }}
    >
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translate(-50%,-46%)}to{opacity:1;transform:translate(-50%,-50%)}}`}</style>
      {children}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-7 py-6"
      style={{ background: "#FDF1E5", border: "1px solid #E8956D" }}
    >
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const FFO = "'Fredoka One', sans-serif";
  const FF  = "'Fredoka', sans-serif";

  const [child, setChild]         = useState<ChildProfile | null>(null);
  const [tone, setTone]           = useState<ToneOption>("casual");
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState("");

  // modals
  const [showProfile, setShowProfile] = useState(false);
  const [showTone, setShowTone]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);

  // profile draft
  const [draftName, setDraftName]         = useState("");
  const [draftAgeValue, setDraftAgeValue] = useState(1);
  const [draftAgeUnit, setDraftAgeUnit]   = useState<AgeUnit>("years");
  const [savingProfile, setSavingProfile] = useState(false);

  // tone draft
  const [draftTone, setDraftTone] = useState<ToneOption>("casual");
  const [savingTone, setSavingTone] = useState(false);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/children", { headers: getAuth() });
        if (r.ok) {
          const d = await r.json();
          if (d.children?.length) {
            const c = d.children[0];
            const { value, unit } = monthsToDisplay(c.age);
            setChild({ id: c.id, name: c.name, ageValue: value, ageUnit: unit });
          }
        }
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          const s = (u.aiStyle || "casual").toLowerCase() as ToneOption;
          setTone(TONES.find(t => t.id === s) ? s : "casual");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Profile modal ────────────────────────────────────────────────────────────
  function openProfile() {
    setDraftName(child?.name ?? "");
    setDraftAgeValue(child?.ageValue ?? 1);
    setDraftAgeUnit(child?.ageUnit ?? "years");
    setShowProfile(true);
  }

  async function saveProfile() {
    const name = draftName.trim();
    if (!name) return;
    setSavingProfile(true);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: getAuth(),
        body: JSON.stringify({ name, age: ageToMonths(draftAgeValue, draftAgeUnit) }),
      });
      if (res.ok) {
        setChild({ id: child?.id, name, ageValue: draftAgeValue, ageUnit: draftAgeUnit });
        setShowProfile(false);
        flash("Profile saved! ✓");
      } else flash("Failed to save.");
    } catch { flash("Network error."); }
    finally { setSavingProfile(false); }
  }

  // ── Tone modal ───────────────────────────────────────────────────────────────
  function openTone() { setDraftTone(tone); setShowTone(true); }

  async function saveTone() {
    setSavingTone(true);
    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: getAuth(),
        body: JSON.stringify({
          name: child?.name || "My Child",
          age: child ? ageToMonths(child.ageValue, child.ageUnit) : 12,
          aiStyle: draftTone,
        }),
      });
      if (res.ok) {
        setTone(draftTone);
        const stored = localStorage.getItem("user");
        if (stored) localStorage.setItem("user", JSON.stringify({ ...JSON.parse(stored), aiStyle: draftTone }));
        setShowTone(false);
        flash("Preference saved! ✓");
      } else flash("Failed to save.");
    } catch { flash("Network error."); }
    finally { setSavingTone(false); }
  }

  // ── Age stepper ──────────────────────────────────────────────────────────────
  const ageMin = draftAgeUnit === "months" ? 0 : 1;
  const ageMax = draftAgeUnit === "months" ? 11 : 5;
  function stepAge(d: number) {
    setDraftAgeValue(v => Math.min(ageMax, Math.max(ageMin, v + d)));
  }
  function switchUnit(u: AgeUnit) {
    if (u === draftAgeUnit) return;
    setDraftAgeUnit(u);
    setDraftAgeValue(u === "months" ? 6 : 1);
  }

  function confirmDelete() {
    ["token","user","kiddio_sessions","childData"].forEach(k => localStorage.removeItem(k));
    router.push("/login");
  }

  const currentTone = TONES.find(t => t.id === tone)!;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FDF6F0" }}>
        <span style={{ fontFamily: FFO, fontSize: 26, color: "#E8956D" }}>Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FDF6F0", fontFamily: FF }}>

      {/* ── NAV ── */}
      <nav
        className="sticky top-0 z-30 flex items-center gap-4 px-8 md:px-16"
        style={{
          height: 76,
          background: "rgba(253,246,240,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #F2D8CA",
        }}
      >
        <button
          onClick={() => router.push("/chat")}
          className="flex items-center justify-center w-10 h-10 rounded-full transition hover:bg-[#FAD8C7]"
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <ArrowLeft />
        </button>
        <span style={{ fontFamily: FFO, fontSize: 38, color: "#E8956D", lineHeight: 1 }}>Kiddio</span>
        <span style={{ color: "#B08D80", fontSize: 18 }}>/</span>
        <span style={{ color: "#B08D80", fontSize: 18 }}>Settings</span>
      </nav>

      {/* ── PAGE ── */}
      <main className="max-w-[1280px] mx-auto px-8 md:px-16 py-10">
        <h1 style={{ fontFamily: FFO, fontSize: 40, color: "#3D2C2C", marginBottom: 32 }}>Settings</h1>

        {/* top two cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

          {/* About */}
          <SectionCard>
            <p style={{ fontFamily: FFO, fontSize: 24, color: "#3D2C2C", marginBottom: 12 }}>About Kiddio</p>
            <p style={{ fontSize: 16, color: "#3D2C2C", lineHeight: 1.7 }}>
              Kiddio is your AI companion for parenting support, guidance, and information.
            </p>
          </SectionCard>

          {/* Disclaimer */}
          <SectionCard>
            <p style={{ fontFamily: FFO, fontSize: 24, color: "#3D2C2C", marginBottom: 12 }}>Disclaimer</p>
            <p style={{ fontSize: 16, color: "#3D2C2C", lineHeight: 1.7 }}>
              Kiddio provides general information and support for parenting and childcare.
              It is not a substitute for professional medical advice, diagnosis, or treatment.
              Always consult a qualified healthcare professional for concerns about your child&apos;s health.
            </p>
          </SectionCard>
        </div>

        {/* Child Profile */}
        <div className="mb-5">
          <SectionCard>
            <div className="flex items-center gap-5">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 60, height: 60, background: "#FAD8C7" }}
              >
                <ProfileIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: FFO, fontSize: 24, color: "#3D2C2C" }}>Child Profile</p>
                <p style={{ fontSize: 16, color: "#7A5C5C", marginTop: 4 }}>
                  {child
                    ? `${child.name} · ${ageLabel(child.ageValue, child.ageUnit, true)}`
                    : "No profile yet — tap Edit to add one"}
                </p>
              </div>
              <button
                onClick={openProfile}
                style={{
                  fontFamily: FF, fontSize: 20, color: "#E8956D",
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "6px 14px", borderRadius: 10,
                }}
                className="hover:bg-[#FAD8C7] transition flex-shrink-0"
              >
                Edit
              </button>
            </div>
          </SectionCard>
        </div>

        {/* AI Response */}
        <div className="mb-5">
          <SectionCard>
            <div className="flex items-center gap-5">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 60, height: 60, background: "#FAD8C7" }}
              >
                <ChatIcon />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: FFO, fontSize: 24, color: "#3D2C2C" }}>AI Response Preference</p>
                <p style={{ fontSize: 16, color: "#7A5C5C", marginTop: 4 }}>
                  <span style={{ fontFamily: FFO }}>Current: {currentTone.label}</span>
                  {" · "}{currentTone.desc}
                </p>
              </div>
              <button
                onClick={openTone}
                style={{
                  fontFamily: FF, fontSize: 20, color: "#E8956D",
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "6px 14px", borderRadius: 10,
                }}
                className="hover:bg-[#FAD8C7] transition flex-shrink-0"
              >
                Edit
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Account / Delete */}
        <SectionCard>
          <p style={{ fontFamily: FFO, fontSize: 24, color: "#3D2C2C", marginBottom: 16 }}>Account</p>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-4 w-full text-left rounded-2xl px-5 py-4 transition hover:bg-red-50"
            style={{ border: "1.5px solid #FFD0D0", background: "transparent", cursor: "pointer" }}
          >
            <TrashIcon />
            <div>
              <p style={{ fontFamily: FF, fontSize: 20, color: "#FF4D4D", fontWeight: 600 }}>Delete Account</p>
              <p style={{ fontSize: 15, color: "#B08D80", marginTop: 2 }}>
                Once you delete your account, all data will be permanently removed.
              </p>
            </div>
          </button>
        </SectionCard>
      </main>

      {/* ═══════════════════════════════════════════
          MODAL — Edit Child Profile
      ═══════════════════════════════════════════ */}
      {showProfile && (
        <>
          <Overlay onClose={() => setShowProfile(false)} />
          <ModalBox>
            {/* header */}
            <div className="flex items-center justify-between mb-1">
              <h2 style={{ fontFamily: FFO, fontSize: 30, color: "#3D2C2C" }}>Edit Child Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-[#FAD8C7] transition"
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#3D2C2C" }}
              >✕</button>
            </div>
            <p style={{ fontSize: 15, color: "#B08D80", marginBottom: 28 }}>
              Update your child&apos;s info to keep recommendations relevant.
            </p>

            {/* name */}
            <label style={{ fontFamily: FFO, fontSize: 18, color: "#3D2C2C", display: "block", marginBottom: 10 }}>
              What&apos;s your child&apos;s name?
            </label>
            <input
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              placeholder="e.g. Anna"
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#FAD8C7", border: "1px solid #E8956D",
                borderRadius: 14, padding: "12px 18px",
                fontFamily: FF, fontSize: 18, color: "#3D2C2C", outline: "none",
                marginBottom: 24,
              }}
            />

            {/* age */}
            <label style={{ fontFamily: FFO, fontSize: 18, color: "#3D2C2C", display: "block", marginBottom: 12 }}>
              How old is your child?
            </label>

            {/* unit toggle */}
            <div className="flex gap-3 mb-4">
              {(["years","months"] as AgeUnit[]).map(u => (
                <button
                  key={u}
                  onClick={() => switchUnit(u)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 12,
                    fontFamily: FF, fontSize: 17, cursor: "pointer",
                    background: draftAgeUnit === u ? "#E8956D" : "#FFF1E7",
                    border: `1.5px solid ${draftAgeUnit === u ? "#E8956D" : "#F3DDD0"}`,
                    color: draftAgeUnit === u ? "#fff" : "#3D2C2C",
                    transition: "all .15s",
                  }}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>

            {/* stepper */}
            <div
              className="flex items-center justify-between mb-2"
              style={{
                background: "#FAD8C7", border: "1px solid #E8956D",
                borderRadius: 14, padding: "10px 20px",
              }}
            >
              <button
                onClick={() => stepAge(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-2xl transition hover:bg-[#E8956D] hover:text-white"
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#3D2C2C", fontFamily: FFO }}
              >−</button>
              <span style={{ fontFamily: FFO, fontSize: 22, color: "#3D2C2C" }}>
                {ageLabel(draftAgeValue, draftAgeUnit)}
              </span>
              <button
                onClick={() => stepAge(1)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-2xl transition hover:bg-[#E8956D] hover:text-white"
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#3D2C2C", fontFamily: FFO }}
              >+</button>
            </div>
            <p style={{ fontSize: 13, color: "#B08D80", marginBottom: 28 }}>
              {draftAgeUnit === "months" ? "0 – 11 months" : "1 – 5 years"}
            </p>

            {/* buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowProfile(false)}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 14,
                  fontFamily: FF, fontSize: 18, cursor: "pointer",
                  background: "#FDF6F0", border: "1.5px solid #E8956D", color: "#3D2C2C",
                }}
                className="hover:bg-[#F3DDD0] transition"
              >Cancel</button>
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 14,
                  fontFamily: FF, fontSize: 18, cursor: "pointer",
                  background: "#E8956D", border: "none", color: "#fff",
                  boxShadow: "0 6px 18px rgba(232,149,109,.3)",
                  opacity: savingProfile ? .6 : 1,
                }}
                className="transition hover:brightness-105"
              >{savingProfile ? "Saving…" : "Save Changes"}</button>
            </div>
          </ModalBox>
        </>
      )}

      {/* ═══════════════════════════════════════════
          MODAL — AI Tone
      ═══════════════════════════════════════════ */}
      {showTone && (
        <>
          <Overlay onClose={() => setShowTone(false)} />
          <ModalBox>
            <div className="flex items-center justify-between mb-1">
              <h2 style={{ fontFamily: FFO, fontSize: 30, color: "#3D2C2C" }}>Edit AI Response Preference</h2>
              <button
                onClick={() => setShowTone(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-[#FAD8C7] transition"
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#3D2C2C" }}
              >✕</button>
            </div>
            <p style={{ fontSize: 15, color: "#B08D80", marginBottom: 24 }}>
              Choose your preferred style.
            </p>

            <div className="flex flex-col gap-3 mb-7">
              {TONES.map(t => {
                const sel = draftTone === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setDraftTone(t.id)}
                    className="flex items-center justify-between rounded-2xl px-6 py-4 text-left w-full transition"
                    style={{
                      background: sel ? "#FAD8C7" : "#FDF1E5",
                      border: `1.5px solid ${sel ? "#E8956D" : "#ECD9CC"}`,
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <p style={{ fontFamily: FFO, fontSize: 20, color: "#3D2C2C" }}>{t.label}</p>
                      <p style={{ fontSize: 15, color: "#7A5C5C", marginTop: 2 }}>{t.desc}</p>
                    </div>
                    <span style={{ fontSize: 20, color: "#E8956D", visibility: sel ? "visible" : "hidden" }}>✓</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTone(false)}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 14,
                  fontFamily: FF, fontSize: 18, cursor: "pointer",
                  background: "#FDF6F0", border: "1.5px solid #E8956D", color: "#3D2C2C",
                }}
                className="hover:bg-[#F3DDD0] transition"
              >Cancel</button>
              <button
                onClick={saveTone}
                disabled={savingTone}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 14,
                  fontFamily: FF, fontSize: 18, cursor: "pointer",
                  background: "#E8956D", border: "none", color: "#fff",
                  boxShadow: "0 6px 18px rgba(232,149,109,.3)",
                  opacity: savingTone ? .6 : 1,
                }}
                className="transition hover:brightness-105"
              >{savingTone ? "Saving…" : "Save Changes"}</button>
            </div>
          </ModalBox>
        </>
      )}

      {/* ═══════════════════════════════════════════
          MODAL — Delete Confirmation
      ═══════════════════════════════════════════ */}
      {showDelete && (
        <>
          <Overlay onClose={() => setShowDelete(false)} />
          <ModalBox>
            <button
              onClick={() => setShowDelete(false)}
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-[#FAD8C7] transition"
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#3D2C2C" }}
            >✕</button>

            <div className="text-center">
              <div
                className="flex items-center justify-center rounded-full mx-auto mb-5"
                style={{ width: 72, height: 72, background: "#FFE5E5" }}
              >
                <WarningIcon />
              </div>
              <h2 style={{ fontFamily: FFO, fontSize: 26, color: "#3D2C2C", marginBottom: 12 }}>
                Delete Account?
              </h2>
              <p style={{ fontSize: 16, color: "#7A5C5C", lineHeight: 1.6, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
                This action cannot be undone. All your data, chat history, and settings will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 14,
                    fontFamily: FF, fontSize: 18, cursor: "pointer",
                    background: "#FDF6F0", border: "1.5px solid #E8956D", color: "#3D2C2C",
                  }}
                  className="hover:bg-[#F3DDD0] transition"
                >Cancel</button>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 14,
                    fontFamily: FF, fontSize: 18, cursor: "pointer",
                    background: "#FF4D4D", border: "none", color: "#fff",
                    boxShadow: "0 6px 18px rgba(255,77,77,.25)",
                  }}
                  className="transition hover:brightness-95"
                >Yes, Delete</button>
              </div>
            </div>
          </ModalBox>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-[200]"
          style={{ background: "#3D2C2C", color: "#fff", fontFamily: FF, fontSize: 15, whiteSpace: "nowrap" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}