"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

export default function LoginTemplate() {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #FAF0E0 0%, #F5D9B0 25%, #E8C08A 55%, #D4A96A 80%, #C9762B 100%)",
      }}
    >
      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-28px) scale(1.04); }
        }
        @keyframes floatX {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(20px) rotate(4deg); }
        }
        @keyframes driftSlow {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(18px, -12px) rotate(3deg); }
          66% { transform: translate(-10px, 8px) rotate(-2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes pulseOrb {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes riseUp {
          0% { transform: translateY(0px); opacity: 0.5; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
        .orb-1 { animation: floatY 7s ease-in-out infinite; }
        .orb-2 { animation: floatY 9s ease-in-out infinite 2s; }
        .orb-3 { animation: floatX 11s ease-in-out infinite 1s; }
        .orb-4 { animation: pulseOrb 6s ease-in-out infinite 3s; }
        .orb-5 { animation: driftSlow 13s ease-in-out infinite; }
        .ring-spin { animation: spinSlow 18s linear infinite; }
        .ring-spin-rev { animation: spinSlow 24s linear infinite reverse; }
        .dot-1 { animation: twinkle 2.5s ease-in-out infinite; }
        .dot-2 { animation: twinkle 3.2s ease-in-out infinite 0.8s; }
        .dot-3 { animation: twinkle 2.8s ease-in-out infinite 1.6s; }
        .dot-4 { animation: twinkle 3.6s ease-in-out infinite 0.4s; }
        .dot-5 { animation: twinkle 2.2s ease-in-out infinite 2.1s; }
        .dot-6 { animation: twinkle 4s ease-in-out infinite 1s; }
        .bubble-1 { animation: riseUp 12s ease-in infinite; }
        .bubble-2 { animation: riseUp 16s ease-in infinite 3s; }
        .bubble-3 { animation: riseUp 10s ease-in infinite 6s; }
        .bubble-4 { animation: riseUp 14s ease-in infinite 1.5s; }
      `}</style>

      {/* ── Layer 1: Animated gradient orbs ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Big soft cloud blobs */}
        <div className="orb-1 absolute top-[-80px] left-[-100px] w-[480px] h-[300px] rounded-full"
          style={{ background: "rgba(255,255,255,0.42)", filter: "blur(70px)" }} />
        <div className="orb-2 absolute top-[8%] right-[-80px] w-[380px] h-[240px] rounded-full"
          style={{ background: "rgba(255,255,255,0.32)", filter: "blur(75px)" }} />
        <div className="orb-3 absolute bottom-[4%] left-[4%] w-[520px] h-[260px] rounded-full"
          style={{ background: "rgba(255,255,255,0.36)", filter: "blur(80px)" }} />
        <div className="orb-4 absolute bottom-[18%] right-[3%] w-[340px] h-[200px] rounded-full"
          style={{ background: "rgba(255,255,255,0.28)", filter: "blur(65px)" }} />
        {/* Amber accent orb */}
        <div className="orb-5 absolute top-[40%] left-[-60px] w-[240px] h-[240px] rounded-full"
          style={{ background: "rgba(201,118,43,0.18)", filter: "blur(60px)" }} />

        {/* ── Layer 2: Spinning wireframe rings ── */}
        <div className="ring-spin absolute top-[12%] left-[6%] w-[180px] h-[180px] rounded-full opacity-[0.12]"
          style={{ border: "1.5px solid rgba(255,255,255,0.9)" }} />
        <div className="ring-spin-rev absolute top-[12%] left-[6%] w-[140px] h-[140px] rounded-full opacity-[0.08]"
          style={{ border: "1px solid rgba(255,255,255,0.7)", margin: "20px" }} />

        <div className="ring-spin-rev absolute bottom-[10%] right-[8%] w-[220px] h-[220px] rounded-full opacity-[0.10]"
          style={{ border: "1.5px solid rgba(255,255,255,0.9)" }} />
        <div className="ring-spin absolute bottom-[10%] right-[8%] w-[160px] h-[160px] rounded-full opacity-[0.07]"
          style={{ border: "1px solid rgba(255,255,255,0.7)", margin: "30px" }} />

        {/* Small accent ring near center-right */}
        <div className="ring-spin absolute top-[55%] right-[18%] w-[100px] h-[100px] rounded-full opacity-[0.12]"
          style={{ border: "1px solid rgba(255,255,255,0.8)" }} />

        {/* ── Layer 3: Sparkle dots scattered around ── */}
        {/* Each dot is a small glowing circle that twinkles */}
        {[
          { cls: "dot-1", top: "22%", left: "18%", size: 6 },
          { cls: "dot-2", top: "35%", right: "14%", size: 5 },
          { cls: "dot-3", top: "68%", left: "10%", size: 7 },
          { cls: "dot-4", top: "15%", right: "28%", size: 4 },
          { cls: "dot-5", top: "80%", right: "22%", size: 5 },
          { cls: "dot-6", top: "48%", left: "28%", size: 4 },
        ].map(({ cls, size, ...pos }, i) => (
          <div
            key={i}
            className={`${cls} absolute rounded-full`}
            style={{
              ...pos,
              width: size,
              height: size,
              background: "rgba(255,255,255,0.9)",
              boxShadow: `0 0 ${size * 3}px ${size}px rgba(255,255,255,0.5)`,
            }}
          />
        ))}

        {/* ── Layer 4: Rising translucent bubbles ── */}
        <div className="bubble-1 absolute bottom-0 left-[20%] w-3 h-3 rounded-full opacity-30"
          style={{ background: "rgba(255,255,255,0.6)", boxShadow: "0 0 8px 2px rgba(255,255,255,0.3)" }} />
        <div className="bubble-2 absolute bottom-0 left-[55%] w-2 h-2 rounded-full opacity-25"
          style={{ background: "rgba(255,255,255,0.5)" }} />
        <div className="bubble-3 absolute bottom-0 right-[25%] w-4 h-4 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.4)", boxShadow: "0 0 10px 3px rgba(255,255,255,0.2)" }} />
        <div className="bubble-4 absolute bottom-0 left-[38%] w-2 h-2 rounded-full opacity-30"
          style={{ background: "rgba(255,255,255,0.55)" }} />

        {/* ── Layer 5: Diagonal grid overlay ── */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="60" y2="0" stroke="white" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* ── Layer 6: Decorative brand monogram (large ghost text) ── */}
        <div
          className="absolute bottom-[-40px] right-[-30px] font-serif font-black select-none pointer-events-none"
          style={{
            fontSize: "280px",
            lineHeight: 1,
            color: "rgba(255,255,255,0.07)",
            letterSpacing: "-0.04em",
          }}
        >
          V
        </div>
      </div>

      {/* ── Top-left brand pill ── */}
      <div className="relative z-10 px-8 pt-7 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.35)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.5)" }}
        >
          <span className="font-serif text-sm font-bold text-[#2C1810]">V</span>
        </div>
        <span className="font-serif text-sm font-semibold text-[#2C1810]/80 tracking-wide">Vridhira</span>
      </div>

      {/* ── Centered card ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[304px] rounded-[22px] px-6 py-7"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(28px) saturate(1.6)",
            WebkitBackdropFilter: "blur(28px) saturate(1.6)",
            border: "1px solid rgba(255, 255, 255, 0.75)",
            boxShadow: "0 20px 60px rgba(100, 50, 10, 0.18), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {currentView === LOGIN_VIEW.SIGN_IN ? (
            <Login setCurrentView={setCurrentView} />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
      </div>
    </div>
  )
}
