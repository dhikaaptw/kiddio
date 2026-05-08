"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AIPref = "Casual" | "Empathetic" | "Precise";
interface ChildProfile { name: string; years: number; months: number }

const AI_PREFS = [
  { name: "Casual" as AIPref, desc: "Friendly and relaxed" },
  { name: "Empathetic" as AIPref, desc: "Warm and understanding" },
  { name: "Precise" as AIPref, desc: "Clear and straightforward" },
];

const cs = {
  title: { fontFamily: "'Fredoka One', cursive", color: "var(--color-brand-text)" } as React.CSSProperties,
  body: { fontFamily: "'Fredoka', sans-serif", color: "var(--color-brand-text)", lineHeight: 1.5 } as React.CSSProperties,
  muted: { fontFamily: "'Fredoka', sans-serif", color: "var(--color-brand-muted)" } as React.CSSProperties,
  orange: { fontFamily: "'Fredoka', sans-serif", color: "var(--color-brand-orange)", background: "none", border: "none", cursor: "pointer" } as React.CSSProperties,
};

const btnBase: React.CSSProperties = { fontFamily: "'Fredoka', sans-serif", fontSize: 16, cursor: "pointer" };
const CancelBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="flex-1 h-11 rounded-2xl"
    style={{ ...btnBase, border: "1.5px solid var(--color-brand-orange)", background: "var(--color-brand-bg)", color: "var(--color-brand-text)" }}>
    Cancel
  </button>
);
const SaveBtn = ({ onClick, label = "Save Changes" }: { onClick: () => void; label?: string }) => (
  <button onClick={onClick} className="flex-1 h-11 rounded-2xl"
    style={{ ...btnBase, background: "var(--color-brand-orange)", border: "none", color: "#fff" }}>
    {label}
  </button>
);

function formatAge(years: number, months: number) {
  const parts = [years > 0 && `${years} year${years !== 1 ? "s" : ""}`, months > 0 && `${months} month${months !== 1 ? "s" : ""}`].filter(Boolean);
  return parts.length ? parts.join(" ") : "Newborn";
}

const ProfileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(61,44,44,0.35)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-md mx-4 rounded-2xl p-7"
        style={{ background: "var(--color-brand-bg)", border: "1.5px solid var(--color-brand-orange)" }}>
        <button onClick={onClose} className="absolute top-4 right-5 text-3xl leading-none cursor-pointer"
          style={{ color: "var(--color-brand-text)", background: "none", border: "none" }}>×</button>
        {children}
      </div>
    </div>
  );
}


function ChildProfileModal({ open, onClose, profile, onSave }: {
  open: boolean; onClose: () => void; profile: ChildProfile; onSave: (p: ChildProfile) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [years, setYears] = useState(profile.years);
  const [months, setMonths] = useState(profile.months);

  const changeYears = (d: number) => {
    const next = Math.max(0, Math.min(5, years + d));
    setYears(next);
    if (next === 5) setMonths(0);
  };
  const changeMonths = (d: number) => setMonths(Math.max(0, Math.min(years === 5 ? 0 : 11, months + d)));

  const Counter = ({ label, value, change }: { label: string; value: number; change: (d: number) => void }) => (
    <div className="flex-1 flex flex-col items-center gap-2 rounded-xl py-3"
      style={{ background: "var(--color-brand-peach)", border: "1.5px solid var(--color-brand-orange)" }}>
      <span style={{ ...cs.muted, fontSize: 13 }}>{label}</span>
      <div className="flex items-center gap-2">
        {[["−", -1], ["+", 1]].map(([sym, delta], i) => i === 0
          ? <button key={sym as string} onClick={() => change(delta as number)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg cursor-pointer"
            style={{ border: "1.5px solid var(--color-brand-orange)", background: "var(--color-brand-bg)", color: "var(--color-brand-text)", fontFamily: "'Fredoka One', cursive" }}>{sym}</button>
          : [<span key="val" style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "var(--color-brand-text)", minWidth: 28, textAlign: "center" }}>{value}</span>,
          <button key={sym as string} onClick={() => change(delta as number)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg cursor-pointer"
            style={{ border: "1.5px solid var(--color-brand-orange)", background: "var(--color-brand-bg)", color: "var(--color-brand-text)", fontFamily: "'Fredoka One', cursive" }}>{sym}</button>]
        )}
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ ...cs.title, fontSize: 22, marginBottom: 4 }}>Edit Child Profile</div>
      <p style={{ ...cs.body, fontSize: 15, marginBottom: 20 }}>Update your child's info to keep recommendations relevant.</p>
      <div className="mb-5">
        <label style={{ ...cs.title, fontSize: 16, display: "block", marginBottom: 8 }}>What's your child's name?</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"
          style={{
            width: "100%", height: 44, border: "1.5px solid var(--color-brand-orange)", borderRadius: 12,
            background: "var(--color-brand-peach)", padding: "0 14px", fontFamily: "'Fredoka', sans-serif",
            fontSize: 16, color: "var(--color-brand-text)", outline: "none"
          }} />
      </div>
      <div className="mb-5">
        <label style={{ ...cs.title, fontSize: 16, display: "block", marginBottom: 8 }}>How old is your child?</label>
        <div className="flex gap-3">
          <Counter label="Years" value={years} change={changeYears} />
          <Counter label="Months" value={months} change={changeMonths} />
        </div>
        <p style={{ ...cs.muted, fontSize: 12, marginTop: 6 }}>0 months – 5 years</p>
      </div>
      <div className="flex gap-3">
        <CancelBtn onClick={onClose} />
        <SaveBtn onClick={() => { onSave({ name: name.trim() || "Child", years, months }); onClose(); }} />
      </div>
    </Modal>
  );
}

function AIPrefModal({ open, onClose, current, onSave }: {
  open: boolean; onClose: () => void; current: AIPref; onSave: (p: AIPref) => void;
}) {
  const [selected, setSelected] = useState<AIPref>(current);
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ ...cs.title, fontSize: 22, marginBottom: 4 }}>Edit AI Response Preference</div>
      <p style={{ ...cs.body, fontSize: 15, marginBottom: 16 }}>Choose your preferred style</p>
      <div className="flex flex-col gap-3 mb-5">
        {AI_PREFS.map((opt) => (
          <button key={opt.name} onClick={() => setSelected(opt.name)} className="text-left rounded-xl px-4 py-3 cursor-pointer w-full"
            style={{
              border: `1.5px solid ${selected === opt.name ? "var(--color-brand-orange-dark)" : "var(--color-brand-orange)"}`,
              background: selected === opt.name ? "var(--color-brand-peach)" : "var(--color-brand-card)", transition: "background .15s"
            }}>
            <div style={{ ...cs.title, fontSize: 16 }}>{opt.name}</div>
            <div style={{ ...cs.muted, fontSize: 14, marginTop: 2 }}>{opt.desc}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <CancelBtn onClick={onClose} />
        <SaveBtn onClick={() => { onSave(selected); onClose(); }} />
      </div>
    </Modal>
  );
}

function DeleteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#FF0000", marginBottom: 4 }}>Delete Account?</div>
      <p style={{ ...cs.body, fontSize: 15, marginBottom: 16 }}>This action cannot be undone.</p>
      <div className="rounded-xl p-4 mb-5" style={{ background: "#fff0f0", border: "1.5px solid #ffb3b3" }}>
        <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, color: "#a32d2d", lineHeight: 1.6 }}>
          Once you delete your account, all your data — including your child profile, chat history, and preferences — will be permanently removed. You will not be able to recover this information.
        </p>
      </div>
      <div className="flex gap-3">
        <CancelBtn onClick={onClose} />
        <SaveBtn onClick={onClose} label="Yes, Delete" />
      </div>
    </Modal>
  );
}

function SettingCard({ title, children, onEdit, fullWidth = false }: {
  title: string; children: React.ReactNode; onEdit?: () => void; fullWidth?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl p-5${fullWidth ? " col-span-2" : ""}`}
      style={{ background: "var(--color-brand-card)", border: "1.5px solid var(--color-brand-orange)" }}>
      <div className="flex items-start justify-between mb-3">
        <span style={{ ...cs.title, fontSize: 18 }}>{title}</span>
        {onEdit && <button onClick={onEdit} style={{ ...cs.orange, fontSize: 15 }}>Edit</button>}
      </div>
      {children}
    </div>
  );
}

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
      style={{ border: "2px solid var(--color-brand-border)" }}>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChildProfile>({ name: "Anna", years: 3, months: 1 });
  const [aiPref, setAIPref] = useState<AIPref>("Casual");
  const [modalChild, setModalChild] = useState(false);
  const [modalAI, setModalAI] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const currentAIPref = AI_PREFS.find((p) => p.name === aiPref)!;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-brand-bg)" }}>
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-1">
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 42, color: "var(--color-brand-orange)", lineHeight: 1 }}>
            Kiddio
          </div>
          <button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl cursor-pointer transition-colors hover:bg-brand-peach"
            style={{
              border: "1.5px solid var(--color-brand-orange)", background: "var(--color-brand-card)",
              fontFamily: "'Fredoka', sans-serif", fontSize: 15, color: "var(--color-brand-text)"
            }}
          >
            <BackIcon />
            Back to Chat
          </button>
        </div>

        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "var(--color-brand-text)", marginBottom: 24 }}>
          Settings
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <SettingCard title="About Kiddio">
            <p style={{ ...cs.body, fontSize: 15 }}>Kiddio is your AI companion for parenting support, guidance, and information.</p>
          </SettingCard>

          <SettingCard title="Disclaimer">
            <p style={{ ...cs.body, fontSize: 15 }}>
              Kiddio provides general information and support for parenting and childcare. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for concerns about your child's health.
            </p>
          </SettingCard>

          <SettingCard title="Child Profile" onEdit={() => setModalChild(true)}>
            <div className="flex items-center gap-3">
              <IconCircle><ProfileIcon /></IconCircle>
              <div>
                <div style={{ ...cs.title, fontSize: 16 }}>{profile.name}</div>
                <div style={{ ...cs.muted, fontSize: 14 }}>{formatAge(profile.years, profile.months)}</div>
              </div>
            </div>
          </SettingCard>

          <SettingCard title="AI Response Preference" onEdit={() => setModalAI(true)}>
            <div className="flex items-center gap-3">
              <IconCircle><ChatIcon /></IconCircle>
              <div>
                <div style={{ ...cs.title, fontSize: 16 }}>{currentAIPref.name}</div>
                <div style={{ ...cs.muted, fontSize: 14 }}>{currentAIPref.desc}</div>
              </div>
            </div>
          </SettingCard>

          <SettingCard title="Account" fullWidth>
            <div className="flex items-center gap-3">
              <TrashIcon />
              <div>
                <button onClick={() => setModalDelete(true)}
                  style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: "#FF0000", background: "none", border: "none", cursor: "pointer", padding: 0, display: "block", textAlign: "left" }}>
                  Delete Account
                </button>
                <p style={{ ...cs.body, fontSize: 14, marginTop: 2 }}>Once you delete your account, all data will be permanently removed.</p>
              </div>
            </div>
          </SettingCard>

        </div>
      </div>

      <ChildProfileModal open={modalChild} onClose={() => setModalChild(false)} profile={profile} onSave={setProfile} />
      <AIPrefModal open={modalAI} onClose={() => setModalAI(false)} current={aiPref} onSave={setAIPref} />
      <DeleteModal open={modalDelete} onClose={() => setModalDelete(false)} />
    </div>
  );
}