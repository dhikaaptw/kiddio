"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, MessageCircle, Trash2, Home } from "lucide-react";

type AIPref = "Casual" | "Empathetic" | "Precise";
interface ChildProfile { id: string; name: string; years: number; months: number }

const AI_PREFS: { name: AIPref; desc: string }[] = [
  { name: "Casual", desc: "Friendly and relaxed" },
  { name: "Empathetic", desc: "Warm and understanding" },
  { name: "Precise", desc: "Clear and straightforward" },
];

function formatAge(years: number, months: number) {
  const parts = [
    years > 0 && `${years} year${years !== 1 ? "s" : ""}`,
    months > 0 && `${months} month${months !== 1 ? "s" : ""}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : "Newborn";
}

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/35"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md mx-4 rounded-2xl p-7 bg-brand-bg border border-brand-orange">
        <button onClick={onClose} className="absolute top-4 right-5 text-3xl text-brand-text bg-transparent border-none cursor-pointer leading-none">×</button>
        <p className="font-['Fredoka_One'] text-xl text-brand-text mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onClose, onSave, saving }: { onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="flex gap-3 mt-5">
      <button onClick={onClose} className="flex-1 h-11 rounded-2xl border border-brand-orange bg-brand-bg text-brand-text font-['Fredoka'] text-base cursor-pointer">Cancel</button>
      <button onClick={onSave} disabled={saving} className="flex-1 h-11 rounded-2xl bg-brand-orange text-white font-['Fredoka'] text-base cursor-pointer disabled:opacity-70">
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function SettingCard({ title, onEdit, fullWidth, children }: {
  title: string; onEdit?: () => void; fullWidth?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl p-5 bg-brand-card border border-brand-orange${fullWidth ? " sm:col-span-2" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="font-['Fredoka_One'] text-lg text-brand-text">{title}</span>
        {onEdit && <button onClick={onEdit} className="text-brand-orange bg-transparent border-none cursor-pointer font-['Fredoka'] text-[15px]">Edit</button>}
      </div>
      {children}
    </div>
  );
}

function IconRow({ icon, label, sub, red }: { icon: React.ReactNode; label: string; sub: string; red?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 border-brand-border">{icon}</div>
      <div>
        <p className={`font-['Fredoka_One'] text-[17px] ${red ? "text-red-500" : "text-brand-text"}`}>{label}</p>
        <p className="font-['Fredoka'] text-[14px] text-brand-muted mt-0.5">{sub}</p>
      </div>
    </div>
  );
}


function ChildModal({ open, onClose, profile, onSave }: {
  open: boolean; onClose: () => void; profile: ChildProfile; onSave: (p: ChildProfile) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [years, setYears] = useState(profile.years);
  const [months, setMonths] = useState(profile.months);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setName(profile.name); setYears(profile.years); setMonths(profile.months); }, [profile]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const changeYears = (d: number) => { const y = clamp(years + d, 0, 5); setYears(y); if (y === 5) setMonths(0); };
  const changeMonths = (d: number) => setMonths(clamp(months + d, 0, years === 5 ? 0 : 11));

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/children/${profile.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: name.trim() || "Child", ageYears: years, ageMonths: months }),
    });
    setSaving(false);
    if (res.ok) { onSave({ id: profile.id, name: name.trim() || "Child", years, months }); onClose(); }
  };

  const Counter = ({ label, value, change }: { label: string; value: number; change: (d: number) => void }) => (
    <div className="flex-1 flex flex-col items-center gap-2 rounded-xl py-3 bg-brand-peach border border-brand-orange">
      <span className="text-brand-muted text-[13px] font-['Fredoka']">{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => change(-1)} className="w-8 h-8 rounded-lg border border-brand-orange bg-brand-bg text-brand-text font-['Fredoka_One'] text-lg cursor-pointer">−</button>
        <span className="font-['Fredoka_One'] text-[22px] text-brand-text min-w-7 text-center">{value}</span>
        <button onClick={() => change(1)} className="w-8 h-8 rounded-lg border border-brand-orange bg-brand-bg text-brand-text font-['Fredoka_One'] text-lg cursor-pointer">+</button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Edit Child Profile">
      <p className="font-['Fredoka'] text-[15px] text-brand-text mb-5">Update your child&apos;s info to keep recommendations relevant.</p>
      <label className="font-['Fredoka_One'] text-[16px] text-brand-text block mb-2">What&apos;s your child&apos;s name?</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name"
        className="w-full h-11 px-4 rounded-xl bg-brand-peach border border-brand-orange font-['Fredoka'] text-[16px] text-brand-text outline-none mb-4" />
      <label className="font-['Fredoka_One'] text-[16px] text-brand-text block mb-2">How old is your child?</label>
      <div className="flex gap-3 mb-1">
        <Counter label="Years" value={years} change={changeYears} />
        <Counter label="Months" value={months} change={changeMonths} />
      </div>
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
    </Modal>
  );
}

function AIPrefModal({ open, onClose, current, onSave }: {
  open: boolean; onClose: () => void; current: AIPref; onSave: (p: AIPref) => void;
}) {
  const [selected, setSelected] = useState(current);
  const [saving, setSaving] = useState(false);
  useEffect(() => setSelected(current), [current]);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ aiStyle: selected }),
    });
    setSaving(false);
    if (res.ok) { onSave(selected); onClose(); }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit AI Response Preference">
      <p className="font-['Fredoka'] text-[15px] text-brand-text mb-4">Choose your preferred style</p>
      <div className="flex flex-col gap-3">
        {AI_PREFS.map((opt) => (
          <button key={opt.name} onClick={() => setSelected(opt.name)}
            className={`text-left rounded-xl px-4 py-3 cursor-pointer w-full border transition-colors ${selected === opt.name ? "bg-brand-peach border-brand-orange" : "bg-brand-card border-brand-orange/50"}`}>
            <p className="font-['Fredoka_One'] text-[16px] text-brand-text">{opt.name}</p>
            <p className="font-['Fredoka'] text-[14px] text-brand-muted mt-0.5">{opt.desc}</p>
          </button>
        ))}
      </div>
      <ModalActions onClose={onClose} onSave={handleSave} saving={saving} />
    </Modal>
  );
}

function DeleteModal({ open, onClose, onDelete }: { open: boolean; onClose: () => void; onDelete: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Account?">
      <p className="font-['Fredoka'] text-[15px] text-brand-text mb-4">This action cannot be undone.</p>
      <div className="rounded-xl p-4 bg-red-50 border border-red-200 mb-1">
        <p className="font-['Fredoka'] text-[14px] text-red-700 leading-relaxed">
          Once you delete your account, all your data — including your child profile, chat history, and preferences — will be permanently removed.
        </p>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={onClose} className="flex-1 h-11 rounded-2xl border border-brand-orange bg-brand-bg text-brand-text font-['Fredoka'] text-base cursor-pointer">Cancel</button>
        <button onClick={onDelete} className="flex-1 h-11 rounded-2xl bg-brand-orange text-white font-['Fredoka'] text-base cursor-pointer">Yes, Delete</button>
      </div>
    </Modal>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ChildProfile>({ id: "", name: "", years: 0, months: 0 });
  const [aiPref, setAIPref] = useState<AIPref>("Empathetic");
  const [modal, setModal] = useState<"child" | "ai" | "delete" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      try {
        const res = await fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { router.push("/login"); return; }
        const { user } = await res.json();
        if (user.aiStyle) setAIPref(user.aiStyle as AIPref);
        if (user.children?.[0]) {
          const c = user.children[0];
          setProfile({ id: c.id, name: c.name, years: c.ageYears, months: c.ageMonths });
        }
      } finally { setLoading(false); }
    };
    load();
  }, [router]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    await fetch("/api/users", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    localStorage.clear();
    router.push("/");
  };

  const currentPref = AI_PREFS.find((p) => p.name === aiPref) ?? AI_PREFS[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <p className="font-['Fredoka'] text-brand-muted text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-1">
          <p className="font-['Fredoka_One'] text-4xl text-brand-orange">Kiddio</p>
          <div className="flex gap-2">
            <button onClick={() => router.push("/home")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-brand-orange bg-brand-card text-brand-text font-['Fredoka'] text-[15px] cursor-pointer hover:bg-brand-peach transition-colors">
              <Home size={18} strokeWidth={2} /> Back to Home
            </button>
            <button onClick={() => router.push("/chat")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-brand-orange bg-brand-card text-brand-text font-['Fredoka'] text-[15px] cursor-pointer hover:bg-brand-peach transition-colors">
              <MessageCircle size={18} strokeWidth={2} /> Back to Chat
            </button>
          </div>
        </div>
        <p className="font-['Fredoka_One'] text-3xl text-brand-text mb-6">Settings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingCard title="About Kiddio">
            <p className="font-['Fredoka'] text-[15px] text-brand-text">Kiddio is your AI companion for parenting support, guidance, and information.</p>
          </SettingCard>

          <SettingCard title="Disclaimer">
            <p className="font-['Fredoka'] text-[15px] text-brand-text">Kiddio provides general information and support. It is not a substitute for professional medical advice, diagnosis, or treatment.</p>
          </SettingCard>

          <SettingCard title="Child Profile" onEdit={profile.id ? () => setModal("child") : undefined}>
            <IconRow
              icon={<User size={28} strokeWidth={1.8} color="var(--color-brand-text)" />}
              label={profile.id ? profile.name : "No child profile yet"}
              sub={profile.id ? formatAge(profile.years, profile.months) : ""}
            />
          </SettingCard>

          <SettingCard title="AI Response Preference" onEdit={() => setModal("ai")}>
            <IconRow
              icon={<MessageCircle size={28} strokeWidth={1.8} color="var(--color-brand-text)" />}
              label={currentPref.name}
              sub={currentPref.desc}
            />
          </SettingCard>

          <SettingCard title="Account" fullWidth>
            <div className="flex flex-col gap-6">
              <button onClick={() => setModal("delete")} className="text-left bg-transparent border-none cursor-pointer p-0 w-full">
                <IconRow icon={<Trash2 size={28} strokeWidth={1.8} color="#EF4444" />} label="Delete Account" sub="All data will be permanently removed." red />
              </button>
            </div>
          </SettingCard>
        </div>
      </div>

      {profile.id && <ChildModal open={modal === "child"} onClose={() => setModal(null)} profile={profile} onSave={setProfile} />}
      <AIPrefModal open={modal === "ai"} onClose={() => setModal(null)} current={aiPref} onSave={setAIPref} />
      <DeleteModal open={modal === "delete"} onClose={() => setModal(null)} onDelete={handleDelete} />
    </div>
  );
}