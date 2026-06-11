/**
 * NOURÉ — Ritual App Landing Page v4
 * Premium light editorial aesthetic — matches new app design & NOURÉ website
 * Palette: #FFFEFB base · #1F1F1D charcoal · #B8945E gold · #7E756C body
 */

import { useState, useEffect } from "react";

const CHECKOUT_URL = "https://nourewellness.com/cart/48163161276661:1";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG      = "#FFFEFB";
const CARD    = "#FAF7F2";
const SECTION = "#F6F1EA";
const BORDER  = "#E6DED4";
const GOLD    = "#B8945E";
const CHARCOAL = "#1F1F1D";
const BODY    = "#7E756C";
const BLUSH   = "#F8EDEA";
const IVORY   = "#FAF7F3";

// App-internal colors (matching deployed app)
const A_BG    = "#FAF7F3";
const A_CHAR  = "#2A2A2A";
const A_GOLD  = "#C8A46A";
const A_BEIGE = "#F1EAE0";
const A_TAUPE = "#B9B1A6";

const FAQS = [
  { q: "Do I need Radiant Reds to use the app?", a: "No. The app works as a complete standalone ritual. Radiant Reds deepens the polyphenol results — most women use both — but the 21-day reset is fully valuable on its own." },
  { q: "Is this a diet or a detox?", a: "Neither. The Ritual App is a morning ritual guide focused on building consistent gut-skin habits through smoothies, check-ins, and daily reflection. No restriction. No calorie counting." },
  { q: "How do I access the app?", a: "Instantly after purchase — you'll receive a link that opens the web app on any device. No app store download required." },
  { q: "What happens after 21 days?", a: "Most women repeat the reset or use it as their ongoing morning framework. Your access never expires and the journal entries, progress, and streaks stay with you." },
  { q: "Can I use it without the supplement?", a: "Yes. Every smoothie in the library can be made without Radiant Reds. The app labels which ingredients to swap — it's all designed to be flexible." },
  { q: "Is it mobile-friendly?", a: "Built for mobile-first. The app opens directly in your phone browser — no download, no account, no friction. Just open and begin." },
];

const TESTIMONIALS = [
  { quote: "By week two my skin felt different — calmer, less reactive. The journal made me realize how much stress was showing up on my face.", name: "Sarah M.", detail: "Completed Day 21 · Glow Score 84" },
  { quote: "I've tried every wellness app. This is the only one I actually looked forward to opening. My gut feels better and it shows in my skin.", name: "Jamie L.", detail: "14-day streak · Berry Bloom every morning" },
  { quote: "21 days and I can genuinely see a difference. The structure made it feel doable — not like another thing I had to do.", name: "Rachel T.", detail: "Glow Score 91 · Week 3 convert" },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <GlobalStyles />
      <div id="lp-root" style={{ background: BG, color: CHARCOAL, fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
        <StickyNav />
        <Hero />
        <LogoBar />
        <WowSection />
        <AppScreensSection />
        <PersonalizationSection />
        <DailyLoopSection />
        <WhyDifferentSection />
        <ValueStack />
        <Testimonials />
        <FaqSection />
        <FinalCta />
        <Footer />
        <StickyFooter />
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { -webkit-font-smoothing: antialiased; }
      button { cursor: pointer; border: none; background: none; font-family: inherit; }
      a { text-decoration: none; color: inherit; }

      .serif { font-family: 'Cormorant Garamond', Georgia, serif; }

      @keyframes floatSlow {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }
      .phone-float { animation: floatSlow 8s ease-in-out infinite; }

      @keyframes floatCard {
        0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
        50%       { transform: translateY(-7px) rotate(-1.5deg); }
      }
      .stat-float { animation: floatCard 6s ease-in-out infinite; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp 0.7s ease-out forwards; }
      .d1 { animation-delay: 0.08s; opacity: 0; }
      .d2 { animation-delay: 0.2s; opacity: 0; }
      .d3 { animation-delay: 0.34s; opacity: 0; }
      .d4 { animation-delay: 0.48s; opacity: 0; }

      .gold-line {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(184,148,94,0.35), transparent);
      }

      @media (min-width: 860px) {
        .hero-layout { display: grid; grid-template-columns: 1fr 480px; gap: 60px; align-items: center; }
        .feat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .screens-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .loop-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .diff-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      }
      @media (max-width: 859px) {
        .hero-layout { display: flex; flex-direction: column; gap: 52px; }
        .feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .screens-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .two-col { display: flex; flex-direction: column; gap: 44px; }
        .loop-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .diff-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .phone-float, .stat-float { animation: none; }
        .fade-up { animation: none; opacity: 1; }
      }

      .lp-cta-btn {
        display: inline-block;
        background: ${CHARCOAL};
        color: ${IVORY};
        border-radius: 999px;
        padding: 17px 40px;
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        letter-spacing: 0.04em;
        transition: background 0.2s, transform 0.15s;
      }
      .lp-cta-btn:hover { background: #333; transform: translateY(-1px); }
      .lp-cta-btn:active { transform: scale(0.98); }

      .lp-cta-gold {
        display: inline-block;
        background: ${GOLD};
        color: ${IVORY};
        border-radius: 999px;
        padding: 17px 40px;
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        letter-spacing: 0.04em;
        transition: background 0.2s, transform 0.15s;
      }
      .lp-cta-gold:hover { background: #a07840; transform: translateY(-1px); }

      .feat-card:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(31,31,29,0.08); }
      .feat-card { transition: transform 0.2s, box-shadow 0.2s; }

      .screen-card:hover { transform: translateY(-3px); }
      .screen-card { transition: transform 0.2s; }

      /* Scrollbar hide */
      .no-scroll::-webkit-scrollbar { display: none; }
      .no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

// ─── Phone Shell ──────────────────────────────────────────────────────────────

function Phone({ children, w = 260, cls = "", style: ext = {} }: {
  children: React.ReactNode;
  w?: number;
  cls?: string;
  style?: React.CSSProperties;
}) {
  const h = Math.round(w * 2.1);
  const r = Math.round(w * 0.14);
  const pt = Math.round(w * 0.05);
  const px = Math.round(w * 0.034);

  return (
    <div className={cls} style={{
      width: w, height: h, borderRadius: r,
      background: "#1A1A1A",
      padding: `${pt}px ${px}px`,
      boxShadow: "0 40px 100px rgba(0,0,0,0.28), 0 12px 32px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.07)",
      position: "relative", flexShrink: 0, ...ext,
    }}>
      {/* Dynamic island */}
      <div style={{
        position: "absolute", top: pt, left: "50%", transform: "translateX(-50%)",
        width: Math.round(w * 0.26), height: Math.round(w * 0.046),
        background: "#0a0a0a", borderRadius: 999, zIndex: 10,
      }} />
      {/* Screen */}
      <div style={{ borderRadius: Math.round(w * 0.11), overflow: "hidden", height: "100%", background: A_BG }}>
        {children}
      </div>
    </div>
  );
}

// ─── App Screens ──────────────────────────────────────────────────────────────

function sc(n: number, w: number, base = 260) { return Math.round(n * w / base); }

function TodayScreen({ w }: { w: number }) {
  const f = (n: number) => sc(n, w);
  const s = (n: number) => sc(n, w);

  return (
    <div style={{ height: "100%", background: A_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ padding: `${s(32)}px ${s(16)}px ${s(6)}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="serif" style={{ fontSize: f(11), letterSpacing: "0.28em", color: A_CHAR }}>RITUAL APP</span>
        <div style={{ display: "flex", alignItems: "center", gap: s(4) }}>
          <span style={{ width: s(5), height: s(5), borderRadius: "50%", background: A_GOLD, display: "block" }} />
          <span style={{ fontSize: f(7), letterSpacing: "0.1em", textTransform: "uppercase", color: `${A_CHAR}80` }}>Day 1 of 21</span>
        </div>
      </div>
      {/* Greeting */}
      <div style={{ padding: `0 ${s(16)}px ${s(5)}px` }}>
        <p className="serif" style={{ fontSize: f(9.5), fontStyle: "italic", color: `${A_CHAR}60` }}>Good morning,</p>
        <p className="serif" style={{ fontSize: f(26), lineHeight: 1.02, color: A_CHAR }}>Sofia.</p>
      </div>
      {/* Progress */}
      <div style={{ padding: `0 ${s(16)}px ${s(5)}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: s(3) }}>
          <span style={{ fontSize: f(6.5), letterSpacing: "0.14em", textTransform: "uppercase", color: `${A_CHAR}50` }}>Reset progress</span>
          <span className="serif" style={{ fontSize: f(8), color: `${A_CHAR}50` }}>5% complete</span>
        </div>
        <div style={{ height: s(3), background: `${A_TAUPE}35`, borderRadius: 999 }}>
          <div style={{ height: "100%", width: "5%", background: `linear-gradient(90deg,${A_GOLD},#D4B07A)`, borderRadius: 999 }} />
        </div>
      </div>
      {/* Stats */}
      <div style={{ padding: `0 ${s(10)}px ${s(7)}px`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: s(5) }}>
        {[["12", "Glow", A_GOLD], ["1", "Streak", A_CHAR], ["21", "Left", A_CHAR]].map(([val, label, col]) => (
          <div key={label} style={{ background: "#FFFFFF", border: `1px solid ${A_TAUPE}30`, borderRadius: s(10), padding: `${s(7)}px ${s(3)}px`, textAlign: "center" }}>
            <p className="serif" style={{ fontSize: f(17), lineHeight: 1, color: col as string }}>{val}</p>
            <p style={{ fontSize: f(6), letterSpacing: "0.1em", textTransform: "uppercase", color: `${A_CHAR}45`, marginTop: s(2) }}>{label}</p>
          </div>
        ))}
      </div>
      {/* Day hero — light editorial card */}
      <div style={{ padding: `0 ${s(10)}px` }}>
        <div style={{ background: A_BEIGE, border: `1px solid ${A_TAUPE}30`, borderRadius: s(16), padding: `${s(12)}px`, position: "relative", overflow: "hidden" }}>
          <div style={{ height: 1, width: s(22), background: A_GOLD, marginBottom: s(6), opacity: 0.7 }} />
          <p style={{ fontSize: f(6.5), letterSpacing: "0.18em", textTransform: "uppercase", color: A_GOLD }}>Foundation · Week 1</p>
          <p className="serif" style={{ fontSize: f(36), lineHeight: 1, color: A_CHAR, marginTop: s(2) }}>Day 1</p>
          <p className="serif" style={{ fontSize: f(14), color: A_CHAR, marginTop: s(2) }}>The First Glass</p>
          <div style={{ marginTop: s(10), display: "inline-flex", alignItems: "center", background: A_CHAR, borderRadius: 999, padding: `${s(5)}px ${s(11)}px` }}>
            <span className="serif" style={{ fontSize: f(8.5), color: A_BG }}>Open Today's Ritual →</span>
          </div>
          <div style={{ position: "absolute", bottom: -s(12), right: -s(12), width: s(50), height: s(50), borderRadius: "50%", background: `${A_GOLD}12`, filter: "blur(12px)" }} />
        </div>
      </div>
      {/* Check-ins */}
      <div style={{ padding: `${s(8)}px ${s(10)}px 0` }}>
        <p style={{ fontSize: f(6.5), letterSpacing: "0.14em", textTransform: "uppercase", color: `${A_CHAR}45`, marginBottom: s(5) }}>Today's check-ins</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: s(5) }}>
          {[{ label: "Radiant Reds", done: false }, { label: "Morning ritual", done: false }, { label: "Journal", done: false }].map(({ label, done }) => (
            <div key={label} style={{ borderRadius: s(10), padding: `${s(7)}px ${s(3)}px`, background: A_BEIGE, textAlign: "center" }}>
              <p style={{ fontSize: f(7.5), color: A_CHAR, lineHeight: 1.3 }}>{label}</p>
              <p style={{ fontSize: f(6), color: `${A_CHAR}45`, marginTop: s(2), letterSpacing: "0.06em", textTransform: "uppercase" }}>Begin</p>
            </div>
          ))}
        </div>
      </div>
      {/* Nav */}
      <div style={{ marginTop: "auto", borderTop: `1px solid ${A_TAUPE}25`, display: "flex", justifyContent: "space-around", padding: `${s(7)}px ${s(4)}px`, background: A_BG, flexShrink: 0 }}>
        {["Today", "Rituals", "Smoothies", "Journal", "Grocery"].map((label, i) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: s(2) }}>
            {i === 0 && <div style={{ width: s(16), height: s(1.5), borderRadius: 1, background: A_GOLD }} />}
            <span style={{ fontSize: f(5.5), letterSpacing: "0.08em", textTransform: "uppercase", color: i === 0 ? A_CHAR : `${A_TAUPE}` }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmoothiesScreen({ w }: { w: number }) {
  const f = (n: number) => sc(n, w);
  const s = (n: number) => sc(n, w);
  const recipes = [
    { name: "Pomegranate Glow Elixir", tag: "Skin clarity", grad: "linear-gradient(135deg,#C44E6E,#E8789A)" },
    { name: "Berry Bloom",             tag: "Antioxidant",  grad: "linear-gradient(135deg,#7B4EA8,#B87DD4)" },
    { name: "Cherry Cacao",            tag: "Recovery",     grad: "linear-gradient(135deg,#8B3A3A,#C47A7A)" },
    { name: "Beet Glow",               tag: "Circulation",  grad: "linear-gradient(135deg,#9B2461,#D47A9B)" },
  ];
  return (
    <div style={{ height: "100%", background: A_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: `${s(32)}px ${s(14)}px ${s(8)}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="serif" style={{ fontSize: f(11), letterSpacing: "0.28em", color: A_CHAR }}>RITUAL APP</span>
        <span style={{ fontSize: f(8), color: `${A_CHAR}50` }}>Smoothies</span>
      </div>
      <div style={{ padding: `0 ${s(14)}px ${s(8)}px` }}>
        <h2 className="serif" style={{ fontSize: f(22), color: A_CHAR }}>The 21 smoothies.</h2>
        <p className="serif" style={{ fontSize: f(9), fontStyle: "italic", color: `${A_CHAR}55`, marginTop: s(2) }}>Polyphenol rituals for every morning.</p>
        {/* Filter pills */}
        <div style={{ display: "flex", gap: s(6), marginTop: s(10) }}>
          {["All", "Foundation", "Build", "Glow"].map((f2, i) => (
            <div key={f2} style={{ borderRadius: 999, padding: `${s(4)}px ${s(9)}px`, background: i === 0 ? A_CHAR : "#FFFFFF", border: `1px solid ${A_TAUPE}35` }}>
              <span style={{ fontSize: f(7.5), letterSpacing: "0.08em", textTransform: "uppercase", color: i === 0 ? A_BG : `${A_CHAR}55` }}>{f2}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: `0 ${s(10)}px`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: s(8) }}>
        {recipes.map((r) => (
          <div key={r.name} style={{ background: "#FFFFFF", border: `1px solid ${A_TAUPE}20`, borderRadius: s(12), overflow: "hidden" }}>
            <div style={{ height: s(48), background: r.grad }} />
            <div style={{ padding: `${s(8)}px ${s(8)}px` }}>
              <div style={{ background: `${A_CHAR}08`, borderRadius: 999, padding: `${s(2)}px ${s(7)}px`, display: "inline-block", marginBottom: s(4) }}>
                <span style={{ fontSize: f(6), color: A_CHAR, letterSpacing: "0.08em" }}>{r.tag}</span>
              </div>
              <p className="serif" style={{ fontSize: f(11), color: A_CHAR, lineHeight: 1.2 }}>{r.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroceryScreen({ w }: { w: number }) {
  const f = (n: number) => sc(n, w);
  const s = (n: number) => sc(n, w);
  const items = ["Pomegranate", "Blueberries", "Strawberries", "Oat milk", "Chia seeds", "Banana"];
  return (
    <div style={{ height: "100%", background: A_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: `${s(32)}px ${s(14)}px ${s(8)}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="serif" style={{ fontSize: f(11), letterSpacing: "0.28em", color: A_CHAR }}>RITUAL APP</span>
        <span style={{ fontSize: f(8), color: `${A_CHAR}50` }}>Grocery</span>
      </div>
      <div style={{ padding: `0 ${s(14)}px ${s(8)}px` }}>
        <h2 className="serif" style={{ fontSize: f(22), color: A_CHAR }}>Your groceries.</h2>
        {/* Progress */}
        <div style={{ marginTop: s(8), height: s(3), background: `${A_TAUPE}25`, borderRadius: 999 }}>
          <div style={{ height: "100%", width: "45%", background: A_GOLD, borderRadius: 999 }} />
        </div>
        <p style={{ fontSize: f(7), color: `${A_CHAR}45`, marginTop: s(4), letterSpacing: "0.08em" }}>4 of 9 items gathered</p>
      </div>
      <div style={{ padding: `0 ${s(10)}px`, flex: 1, overflow: "hidden" }}>
        {items.map((item, i) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: s(10), padding: `${s(8)}px ${s(10)}px`, background: "#FFFFFF", borderRadius: s(10), marginBottom: s(5), border: `1px solid ${A_TAUPE}15`, opacity: i < 4 ? 0.5 : 1 }}>
            <div style={{ width: s(16), height: s(16), borderRadius: "50%", border: i < 4 ? "none" : `1.5px solid ${A_TAUPE}50`, background: i < 4 ? A_GOLD : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < 4 && <span style={{ color: "white", fontSize: f(8) }}>✓</span>}
            </div>
            <span className="serif" style={{ fontSize: f(11.5), color: A_CHAR, textDecoration: i < 4 ? "line-through" : "none", opacity: i < 4 ? 0.5 : 1 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function JournalScreen({ w }: { w: number }) {
  const f = (n: number) => sc(n, w);
  const s = (n: number) => sc(n, w);
  return (
    <div style={{ height: "100%", background: A_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: `${s(32)}px ${s(14)}px ${s(8)}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="serif" style={{ fontSize: f(11), letterSpacing: "0.28em", color: A_CHAR }}>RITUAL APP</span>
        <span style={{ fontSize: f(8), color: `${A_CHAR}50` }}>Journal</span>
      </div>
      <div style={{ padding: `0 ${s(14)}px`, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: s(8), marginBottom: s(8) }}>
          <span style={{ fontSize: f(6.5), letterSpacing: "0.14em", textTransform: "uppercase", color: A_GOLD }}>Day 1</span>
          <span style={{ color: `${A_TAUPE}60`, fontSize: f(8) }}>·</span>
          <span style={{ fontSize: f(6.5), letterSpacing: "0.14em", textTransform: "uppercase", color: `${A_CHAR}35` }}>Foundation</span>
        </div>
        {/* Gold divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${A_GOLD}50,transparent)`, margin: `${s(8)}px 0` }} />
        <p className="serif" style={{ fontSize: f(14), fontStyle: "italic", lineHeight: 1.6, color: A_CHAR }}>
          "What does your skin feel like this morning, and what do you think it's been trying to tell you?"
        </p>
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${A_GOLD}50,transparent)`, margin: `${s(10)}px 0` }} />
        {/* Textarea area */}
        <div style={{ background: "transparent" }}>
          <p className="serif" style={{ fontSize: f(11), color: A_CHAR, lineHeight: 1.65, opacity: 0.4 }}>Write what's true today…</p>
        </div>
        {/* Word count */}
        <p style={{ fontSize: f(7), color: `${A_GOLD}70`, marginTop: s(10), textAlign: "right" }}>0 words</p>
      </div>
      {/* Companion button */}
      <div style={{ padding: `${s(10)}px ${s(14)}px ${s(12)}px` }}>
        <div style={{ background: `linear-gradient(135deg,${A_GOLD},#D4B07A)`, borderRadius: 999, padding: `${s(10)}px`, textAlign: "center" }}>
          <span className="serif" style={{ fontSize: f(10.5), color: A_BG }}>Reflect with me →</span>
        </div>
      </div>
    </div>
  );
}

function VerifyScreen({ w }: { w: number }) {
  const f = (n: number) => sc(n, w);
  const s = (n: number) => sc(n, w);
  return (
    <div style={{ height: "100%", background: A_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: `${s(40)}px ${s(20)}px ${s(8)}px` }}>
        <p className="serif" style={{ fontSize: f(9), letterSpacing: "0.44em", color: `${A_CHAR}45`, textTransform: "uppercase" }}>RITUAL APP</p>
      </div>
      <div style={{ padding: `${s(28)}px ${s(20)}px ${s(8)}px` }}>
        <div style={{ height: 1, width: s(28), background: A_GOLD, marginBottom: s(22), opacity: 0.6 }} />
        <p className="serif" style={{ fontSize: f(26), color: A_CHAR, lineHeight: 1.1 }}>Unlock your<br />ritual.</p>
        <p className="serif" style={{ fontSize: f(11), fontStyle: "italic", color: `${A_CHAR}55`, marginTop: s(8) }}>Your glow begins within.</p>
        <p style={{ fontSize: f(9), color: `${A_CHAR}40`, marginTop: s(5), lineHeight: 1.5 }}>Enter the email you used at checkout to begin.</p>
        <div style={{ marginTop: s(24), borderBottom: `1px solid ${A_TAUPE}50`, paddingBottom: s(10) }}>
          <p className="serif" style={{ fontSize: f(18), color: `${A_CHAR}25` }}>your@email.com</p>
        </div>
        <div style={{ marginTop: s(28), background: `linear-gradient(135deg,${A_GOLD},#D4B07A)`, borderRadius: 999, padding: `${s(12)}px`, textAlign: "center" }}>
          <span className="serif" style={{ fontSize: f(12), color: A_BG }}>Unlock My Reset</span>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ w }: { w: number }) {
  const f = (n: number) => sc(n, w);
  const s = (n: number) => sc(n, w);
  return (
    <div style={{ height: "100%", background: A_BG, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: `${s(34)}px ${s(18)}px ${s(6)}px`, textAlign: "center" }}>
        <p className="serif" style={{ fontSize: f(9), letterSpacing: "0.44em", color: `${A_CHAR}45`, textTransform: "uppercase" }}>RITUAL APP</p>
      </div>
      <div style={{ padding: `${s(12)}px ${s(18)}px` }}>
        <p className="serif" style={{ fontSize: f(24), color: A_CHAR, lineHeight: 1.1 }}>Good morning,</p>
        <p className="serif" style={{ fontSize: f(24), color: A_GOLD, fontStyle: "italic", lineHeight: 1.1 }}>Sofia.</p>
        <p className="serif" style={{ fontSize: f(9.5), fontStyle: "italic", color: `${A_CHAR}55`, marginTop: s(6) }}>Your 21-day reset begins today.</p>
      </div>
      <div style={{ margin: `${s(8)}px ${s(18)}px`, height: 1, background: `linear-gradient(90deg,transparent,${A_GOLD}45,transparent)` }} />
      <div style={{ padding: `0 ${s(14)}px ${s(8)}px` }}>
        <div style={{ background: "#F8EDEA", border: "1px solid rgba(217,184,176,0.3)", borderRadius: s(10), padding: `${s(10)}px` }}>
          <p className="serif" style={{ fontSize: f(9.5), fontStyle: "italic", color: `${A_CHAR}70`, lineHeight: 1.6 }}>
            "Your serums can't fix what starts underneath. The Inner Glow Reset works at the source — morning by morning."
          </p>
        </div>
      </div>
      <div style={{ padding: `0 ${s(14)}px` }}>
        <div style={{ background: "#FFFFFF", border: `1px solid ${A_TAUPE}25`, borderRadius: s(10), padding: `${s(10)}px` }}>
          <p style={{ fontSize: f(6.5), letterSpacing: "0.16em", textTransform: "uppercase", color: A_GOLD, marginBottom: s(5) }}>What you have access to</p>
          {["21 daily ritual guides", "Polyphenol recipe library", "Daily glow journal", "Progress + Glow Score"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: s(5), marginBottom: s(4) }}>
              <div style={{ width: s(4), height: s(4), borderRadius: "50%", background: A_GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: f(8), color: `${A_CHAR}65` }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: `${s(10)}px ${s(14)}px`, marginTop: "auto" }}>
        <div style={{ background: A_CHAR, borderRadius: 999, padding: `${s(11)}px`, textAlign: "center" }}>
          <span className="serif" style={{ fontSize: f(11), color: A_BG }}>Start Day 1, Sofia →</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────

function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,254,251,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? `1px solid ${BORDER}` : "none",
      transition: "background 0.3s, border 0.3s",
    }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "16px 36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="serif" style={{ fontSize: 14, letterSpacing: "0.44em", color: CHARCOAL }}>RITUAL APP</p>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <a href="#features" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: BODY }}>Features</a>
          <a href="#faq" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: BODY }}>FAQ</a>
          <a href={CHECKOUT_URL} target="_top" className="lp-cta-btn" style={{ padding: "10px 22px", fontSize: 13 }}>
            Get Access — $21
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{
      minHeight: "100vh", paddingTop: 80,
      background: `radial-gradient(ellipse 55% 45% at 75% 15%, rgba(184,148,94,0.07) 0%, transparent 65%),
                   radial-gradient(ellipse 40% 35% at 15% 90%, rgba(184,148,94,0.05) 0%, transparent 60%),
                   ${BG}`,
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "64px 36px", width: "100%" }}>
        <div className="hero-layout">

          {/* Left: copy */}
          <div>
            <p className="fade-up" style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>
              The Inner Glow Reset
            </p>
            <h1 className="serif fade-up d1" style={{ fontSize: "clamp(46px, 5vw, 72px)", lineHeight: 1.02, color: CHARCOAL, marginBottom: 28 }}>
              Your skincare problem<br />
              isn't another serum.<br />
              <em style={{ color: GOLD }}>It's a ritual you haven't tried yet.</em>
            </h1>
            <p className="fade-up d2" style={{ fontSize: 17, lineHeight: 1.85, color: BODY, maxWidth: 430, marginBottom: 44 }}>
              The Ritual App guides you through 21 days of smoothies, check-ins, grocery prep, and reflections designed to help you build a beauty-from-within routine you'll actually stick with.
            </p>
            <div className="fade-up d3">
              <a href={CHECKOUT_URL} target="_top" className="lp-cta-gold" style={{ fontSize: 19, padding: "18px 48px" }}>
                Start My Ritual — $21
              </a>
              <p style={{ marginTop: 14, fontSize: 12, color: `${BODY}80`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Instant digital access · Yours for life
              </p>
            </div>
          </div>

          {/* Right: phone + floating card */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", paddingTop: 16 }}>
            {/* Floating stat card */}
            <div className="stat-float" style={{
              position: "absolute", top: -8, left: -28,
              background: "#FFFFFF", border: `1px solid ${BORDER}`,
              borderRadius: 18, padding: "18px 22px",
              boxShadow: `0 20px 56px rgba(31,31,29,0.08)`,
              zIndex: 10, minWidth: 190,
            }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: BODY, marginBottom: 10 }}>
                Day 7 — When most feel it
              </p>
              <div style={{ display: "flex", gap: 18 }}>
                <div>
                  <p className="serif" style={{ fontSize: 30, lineHeight: 1, color: GOLD }}>72</p>
                  <p style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: BODY, marginTop: 3 }}>Glow Score</p>
                </div>
                <div style={{ width: 1, background: BORDER }} />
                <div>
                  <p className="serif" style={{ fontSize: 30, lineHeight: 1, color: CHARCOAL }}>7</p>
                  <p style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: BODY, marginTop: 3 }}>Day Streak</p>
                </div>
              </div>
            </div>

            <Phone w={280} cls="phone-float">
              <TodayScreen w={280} />
            </Phone>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Logo Bar ─────────────────────────────────────────────────────────────────

function LogoBar() {
  return (
    <section style={{ padding: "32px 36px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: CARD }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: `${BODY}70` }}>21 days of</p>
        {["Morning ritual", "Polyphenol smoothies", "Gut-skin education", "Daily reflection", "Progress tracking"].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontSize: 12, letterSpacing: "0.06em", color: BODY }}>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Wow Section ──────────────────────────────────────────────────────────────

function WowSection() {
  const features = [
    {
      label: "Daily Ritual Dashboard",
      body: "Open the app and know exactly what to do today — your smoothie, check-ins, reflection, and progress all in one place.",
      icon: "○",
    },
    {
      label: "Smoothie Ritual Library",
      body: "Beauty-from-within recipes organized by glow, energy, digestion, reset, and calm — with colorful smoothie cards that make the ritual feel easy.",
      icon: "◇",
    },
    {
      label: "Smart Grocery Prep",
      body: "Your ingredients organized by category so your week feels prepared, not chaotic. Generate by week. Copy the list. Go.",
      icon: "□",
    },
    {
      label: "Guided Glow Journal",
      body: "Simple daily prompts help you notice changes in your skin, digestion, energy, and consistency — in under two minutes.",
      icon: "◁",
    },
  ];

  return (
    <section id="features" style={{ padding: "112px 36px", background: BG }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>
            What's inside
          </p>
          <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.06, color: CHARCOAL }}>
            Everything your morning<br />
            routine has been missing.
          </h2>
        </div>
        <div className="feat-grid">
          {features.map((f, i) => (
            <div key={i} className="feat-card" style={{
              background: i % 2 === 0 ? "#FFFFFF" : CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 22,
              padding: "36px 30px",
              boxShadow: "0 4px 20px rgba(31,31,29,0.04)",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${GOLD}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                <span style={{ fontSize: 18, color: GOLD }}>{f.icon}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 22, color: CHARCOAL, marginBottom: 12 }}>{f.label}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: BODY }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App Screens Section ──────────────────────────────────────────────────────

const SCREEN_CARDS = [
  { label: "Unlock your ritual",       caption: "Enter your purchase email and your 21 days unlock instantly.",    Screen: VerifyScreen },
  { label: "Personalize your glow goal", caption: "Tell the app what you're here for. The ritual responds.",      Screen: WelcomeScreen },
  { label: "See today's plan",         caption: "Open the dashboard and know exactly what to do this morning.",   Screen: TodayScreen },
  { label: "Choose your smoothie",     caption: "21 polyphenol recipes. One unlocks each morning of your reset.", Screen: SmoothiesScreen },
  { label: "Prep your groceries",      caption: "Your ingredient list, organized by category and built by week.", Screen: GroceryScreen },
  { label: "Reflect and track",        caption: "One journal prompt. Less than two minutes. Visible results.",    Screen: JournalScreen },
];

function AppScreensSection() {
  const W = 180;
  return (
    <section style={{ padding: "112px 36px", background: SECTION }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 68 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>Inside the app</p>
          <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.06, color: CHARCOAL }}>
            Six screens.<br />One complete ritual system.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: BODY, maxWidth: 460, margin: "18px auto 0" }}>
            Every screen in the Ritual App is built to reduce friction and add intention to your morning.
          </p>
        </div>
        <div className="screens-grid">
          {SCREEN_CARDS.map(({ label, caption, Screen }, i) => (
            <div key={i} className="screen-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              <Phone w={W} style={{ opacity: 1 }}>
                <Screen w={W} />
              </Phone>
              <div style={{ textAlign: "center" }}>
                <p className="serif" style={{ fontSize: 18, color: CHARCOAL, marginBottom: 6 }}>{label}</p>
                <p style={{ fontSize: 13, color: BODY, lineHeight: 1.6, maxWidth: 200 }}>{caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Personalization Section ──────────────────────────────────────────────────

function PersonalizationSection() {
  const goals = ["Glow", "Less Bloating", "Energy", "Reset", "Consistency"];
  return (
    <section style={{ padding: "112px 36px", background: BG }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="two-col">
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>Built for you</p>
            <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, color: CHARCOAL, marginBottom: 22 }}>
              Built around how<br />you want to feel.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.82, color: BODY, marginBottom: 32 }}>
              Choose your focus and let the app guide your 21-day ritual with recipes, check-ins, and reflections that feel doable from day one.
            </p>
            <a href={CHECKOUT_URL} target="_top" className="lp-cta-btn">
              Start My Ritual — $21
            </a>
          </div>
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {goals.map((g, i) => (
                <div key={g} style={{
                  background: i === 0 ? CHARCOAL : "#FFFFFF",
                  border: `1px solid ${i === 0 ? CHARCOAL : BORDER}`,
                  borderRadius: 999,
                  padding: "14px 26px",
                  boxShadow: i === 0 ? "none" : `0 2px 12px rgba(31,31,29,0.04)`,
                }}>
                  <span className="serif" style={{ fontSize: 18, color: i === 0 ? IVORY : CHARCOAL }}>{g}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 36, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "28px 26px" }}>
              <div style={{ height: 1, width: 32, background: GOLD, marginBottom: 18 }} />
              <p className="serif" style={{ fontSize: 18, fontStyle: "italic", lineHeight: 1.6, color: CHARCOAL }}>
                "The app doesn't ask me to change everything. It asks me to do one thing every morning. That's the only reason I've kept up with it."
              </p>
              <p style={{ fontSize: 12, letterSpacing: "0.06em", color: BODY, marginTop: 14 }}>Sarah M. — Day 21 complete</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Daily Loop Section ───────────────────────────────────────────────────────

function DailyLoopSection() {
  const steps = [
    { n: "01", label: "Open today's ritual",    sub: "Your daily guide unlocks each morning at midnight." },
    { n: "02", label: "Make your smoothie",      sub: "Choose from the recipe library or follow the day's suggestion." },
    { n: "03", label: "Complete your check-ins", sub: "Three taps. Reds, ritual, journal — all tracked." },
    { n: "04", label: "Write your reflection",   sub: "One prompt. Under two minutes. Saved automatically." },
    { n: "05", label: "Watch your glow build",   sub: "Streak, Glow Score, and 21-day progress update in real time." },
  ];
  return (
    <section style={{ padding: "112px 36px", background: SECTION }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>The daily loop</p>
          <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.06, color: CHARCOAL }}>
            Open. Blend. Check in. Glow.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: BODY, maxWidth: 440, margin: "18px auto 0" }}>
            Five minutes every morning. A ritual that compounds over 21 days.
          </p>
        </div>
        <div className="loop-grid">
          {steps.map((step, i) => (
            <div key={i} style={{
              background: "#FFFFFF",
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              padding: "28px 22px",
              position: "relative",
              boxShadow: "0 2px 16px rgba(31,31,29,0.04)",
            }}>
              <p style={{ fontSize: 11, letterSpacing: "0.2em", color: GOLD, marginBottom: 16, fontWeight: 600 }}>{step.n}</p>
              <h3 className="serif" style={{ fontSize: 18, color: CHARCOAL, lineHeight: 1.3, marginBottom: 10 }}>{step.label}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: BODY }}>{step.sub}</p>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: "50%", right: -14, transform: "translateY(-50%)", fontSize: 16, color: BORDER, display: "none" }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Different Section ────────────────────────────────────────────────────

function WhyDifferentSection() {
  const bullets = [
    "Designed for daily consistency, not overwhelm",
    "Smoothie-based beauty-from-within routine",
    "Grocery prep built in — no guessing at the store",
    "Reflection prompts that take less than two minutes",
    "Progress that feels elegant, not childish",
    "Premium, calming interface — no loud colors or alerts",
  ];
  return (
    <section style={{ padding: "112px 36px", background: BG }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="two-col">
          {/* Left: text */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>Why it feels different</p>
            <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, color: CHARCOAL, marginBottom: 24 }}>
              Not another tracker.<br />A ritual you'll want<br />to return to.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: BODY }}>
              Most wellness apps are built to maximize engagement. The Ritual App is built around one thing: a morning practice that makes your skin better over 21 days.
            </p>
          </div>
          {/* Right: bullets */}
          <div className="diff-grid">
            {bullets.map((b, i) => (
              <div key={i} style={{
                background: i % 2 === 0 ? "#FFFFFF" : CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: "20px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                boxShadow: "0 2px 10px rgba(31,31,29,0.03)",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, marginTop: 6, flexShrink: 0 }} />
                <p style={{ fontSize: 14, lineHeight: 1.65, color: CHARCOAL }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Value Stack ──────────────────────────────────────────────────────────────

function ValueStack() {
  const items = [
    { item: "21-Day Guided Ritual Plan",        note: "One daily guide unlocks each morning." },
    { item: "Smoothie Recipe Library",          note: "21 polyphenol recipes built around the gut-skin axis." },
    { item: "Grocery Prep System",              note: "Organized by week and category. No wasted ingredients." },
    { item: "Daily Check-In Dashboard",         note: "Glow Score, streak, and progress — visible each day." },
    { item: "Guided Glow Journal",              note: "One prompt per day. Written for where you are in your reset." },
    { item: "Progress + Milestone Tracking",   note: "Day 7, 14, and 21 celebrations. A Glow Score at the end." },
    { item: "Radiant Reds Ritual Integration", note: "Each recipe shows how to include your Radiant Reds blend." },
  ];

  return (
    <section style={{ padding: "112px 36px", background: SECTION }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>What you're getting</p>
          <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.06, color: CHARCOAL }}>
            Everything in one place.<br />
            <em>Nothing you don't need.</em>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 48 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              padding: "18px 22px",
              background: "#FFFFFF",
              borderRadius: 14,
              border: `1px solid ${BORDER}`,
            }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${GOLD}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD }} />
              </div>
              <div>
                <p className="serif" style={{ fontSize: 17, color: CHARCOAL }}>{item.item}</p>
                <p style={{ fontSize: 13, color: BODY, marginTop: 2, lineHeight: 1.5 }}>{item.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price card */}
        <div style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 24, padding: "44px 36px", textAlign: "center", boxShadow: "0 8px 40px rgba(31,31,29,0.07)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: BODY, marginBottom: 14 }}>Your investment</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, marginBottom: 10 }}>
            <p className="serif" style={{ fontSize: 36, color: BORDER, textDecoration: "line-through", lineHeight: 1 }}>$244</p>
            <p className="serif" style={{ fontSize: 72, color: CHARCOAL, lineHeight: 1 }}>$21</p>
          </div>
          <p className="serif" style={{ fontSize: 15, fontStyle: "italic", color: BODY, marginBottom: 32 }}>
            Yours forever. No subscription. No app store.
          </p>
          <a href={CHECKOUT_URL} target="_top" className="lp-cta-gold" style={{ display: "block", textAlign: "center" }}>
            Start My Ritual — $21
          </a>
          <p style={{ marginTop: 16, fontSize: 12, color: `${BODY}70`, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Instant access · Works on any device
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section style={{ padding: "112px 36px", background: BG }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>21 days later</p>
          <h2 className="serif" style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.07, color: CHARCOAL }}>
            What 21 mornings builds.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: "#FFFFFF",
              border: `1px solid ${BORDER}`,
              borderRadius: 22,
              padding: "36px 30px",
              boxShadow: "0 4px 24px rgba(31,31,29,0.05)",
            }}>
              <div style={{ height: 1, width: 28, background: GOLD, marginBottom: 22 }} />
              <p className="serif" style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.7, color: CHARCOAL, marginBottom: 22 }}>
                "{t.quote}"
              </p>
              <p style={{ fontSize: 13, color: CHARCOAL, fontWeight: 500 }}>{t.name}</p>
              <p style={{ fontSize: 11, color: BODY, marginTop: 4, letterSpacing: "0.05em" }}>{t.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: "100px 36px", background: SECTION }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>Common questions</p>
          <h2 className="serif" style={{ fontSize: "clamp(32px, 4vw, 50px)", color: CHARCOAL, lineHeight: 1.05 }}>
            Questions.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 24px", textAlign: "left", cursor: "pointer" }}
              >
                <p className="serif" style={{ fontSize: 18, color: CHARCOAL, flex: 1, paddingRight: 18, lineHeight: 1.3 }}>{faq.q}</p>
                <span style={{ fontSize: 20, color: GOLD, flexShrink: 0, transition: "transform 0.22s", display: "block", transform: open === i ? "rotate(45deg)" : "none", lineHeight: 1 }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 22px" }}>
                  <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />
                  <p style={{ fontSize: 14, lineHeight: 1.76, color: BODY }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section style={{ padding: "120px 36px 140px", background: BG, textAlign: "center" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>Begin tonight</p>
        <h2 className="serif" style={{ fontSize: "clamp(40px, 5vw, 66px)", lineHeight: 1.03, color: CHARCOAL, marginBottom: 22 }}>
          Begin your 21-day<br />ritual tonight.
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: BODY, maxWidth: 440, margin: "0 auto 48px" }}>
          One simple app. Daily smoothies. Gentle check-ins. A routine your skin can build on.
        </p>
        <a href={CHECKOUT_URL} target="_top" className="lp-cta-gold" style={{ fontSize: 20, padding: "20px 58px" }}>
          Start My Ritual — $21
        </a>
        <p style={{ marginTop: 18, fontSize: 12, color: `${BODY}70`, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Instant access · Yours for life · No subscription
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ padding: "40px 36px", borderTop: `1px solid ${BORDER}`, background: CARD, textAlign: "center" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div className="gold-line" style={{ maxWidth: 120, margin: "0 auto 24px" }} />
        <p className="serif" style={{ fontSize: 13, letterSpacing: "0.36em", color: BODY, marginBottom: 8 }}>RITUAL APP</p>
        <p style={{ fontSize: 11, color: `${BODY}70`, marginBottom: 4 }}>
          by{" "}
          <a href="https://nourewellness.com" target="_top" style={{ color: BODY }}>nourewellness.com</a>
        </p>
        <p style={{ fontSize: 11, color: `${BODY}50` }}>
          Questions?{" "}
          <a href="mailto:support@nourewellness.com" style={{ color: BODY }}>support@nourewellness.com</a>
        </p>
      </div>
    </footer>
  );
}

// ─── Sticky Footer ────────────────────────────────────────────────────────────

function StickyFooter() {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,254,251,0.97)",
      backdropFilter: "blur(14px)",
      borderTop: `1px solid ${BORDER}`,
    }}>
      <div style={{
        maxWidth: 1140, margin: "0 auto",
        padding: "14px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <p className="serif" style={{ fontSize: 15, color: CHARCOAL, lineHeight: 1.2 }}>21-Day Inner Glow Reset</p>
          <p style={{ fontSize: 12, color: BODY, marginTop: 2 }}>
            <span style={{ color: CHARCOAL, fontWeight: 500 }}>$21</span>
            {" · "}
            <span style={{ textDecoration: "line-through", color: `${BODY}60` }}>$244 value</span>
            {" · "}Instant access
          </p>
        </div>
        <a href={CHECKOUT_URL} target="_top" className="lp-cta-gold" style={{ padding: "12px 28px", fontSize: 15 }}>
          Get Instant Access
        </a>
      </div>
    </div>
  );
}
