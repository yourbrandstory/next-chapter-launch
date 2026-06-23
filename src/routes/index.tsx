import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Repeat,
  Flag,
  Tags,
  Target,
  Users,
  Home,
  Zap,
  ListChecks,
  StickyNote,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ----------------------------- Helpers ----------------------------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function Counter({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function ProgressBar({ percent }: { percent: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setW(percent); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [percent]);
  return (
    <div ref={ref} className="h-1.5 w-full rounded-full bg-hairline overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-[1400ms] ease-out"
        style={{ width: `${w}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-deep))" }}
      />
    </div>
  );
}

function MagneticButton({ children, className = "", as = "a", href, onClick, ariaLabel }: any) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
  const Tag: any = as;
  return (
    <Tag
      ref={ref as any}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-2 transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ----------------------------- Page ----------------------------- */

function Landing() {
  useReveal();
  return (
    <main className="bg-paper text-ink overflow-x-clip">
      <Nav />
      <Hero />
      <Marquee />
      <BuiltFor />
      <Surgical />
      <Workstyle />
      <Stats />
      <Inside />
      <WhyNot />
      <Timeline />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ----------------------------- Nav ----------------------------- */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`relative grid h-8 w-8 place-items-center rounded-full ${light ? "bg-white" : "bg-ink"}`}>
        <span
          className="h-2 w-2 rounded-full animate-blink"
          style={{ background: "var(--accent)", boxShadow: "0 0 12px rgba(0,212,255,0.8)" }}
        />
      </span>
      <span className={`serif text-[20px] leading-none ${light ? "text-white" : "text-ink"}`}>Next Chapter</span>
    </div>
  );
}

function Nav() {
  const scrolled = useScrolled(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleTap(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleTap);
    return () => document.removeEventListener("mousedown", handleTap);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-paper/85 backdrop-blur-md border-b border-hairline shadow-[0_8px_24px_-18px_rgba(0,0,0,0.2)]" : "bg-paper/60 backdrop-blur-sm"
      }`}
    >
      <div ref={menuRef} className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <a href="#top" className="shrink-0"><Logo /></a>
          <nav className="hidden md:flex items-center gap-8 text-[14px] text-sub">
            <a href="#built-for" className="hover:text-ink transition-colors">Who it's for</a>
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
            <a href="#inside" className="hover:text-ink transition-colors">What you get</a>
            <a href="#stories" className="hover:text-ink transition-colors">Stories</a>
          </nav>
          <div className="hidden md:block">
            <Link
              to="/book"
              className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
            >
              Book discovery call <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden touch-btn grid place-items-center rounded-lg border border-hairline bg-paper px-3 py-2 text-ink"
          >
            <span className="flex flex-col gap-1">
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-current transition-transform duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
        {/* Mobile slide-down menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "mobile-nav-open mt-4" : "mobile-nav-closed"
          }`}
        >
          <nav className="flex flex-col gap-3 border-t border-hairline pt-4 pb-2">
            <a href="#built-for" onClick={closeMenu} className="rounded-lg px-4 py-3 text-[15px] text-sub hover:bg-alt hover:text-ink transition-colors">Who it's for</a>
            <a href="#how" onClick={closeMenu} className="rounded-lg px-4 py-3 text-[15px] text-sub hover:bg-alt hover:text-ink transition-colors">How it works</a>
            <a href="#inside" onClick={closeMenu} className="rounded-lg px-4 py-3 text-[15px] text-sub hover:bg-alt hover:text-ink transition-colors">What you get</a>
            <a href="#stories" onClick={closeMenu} className="rounded-lg px-4 py-3 text-[15px] text-sub hover:bg-alt hover:text-ink transition-colors">Stories</a>
            <Link
              to="/book"
              onClick={closeMenu}
              className="btn-shimmer mt-2 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-[15px] font-medium text-white hover:opacity-90"
            >
              Book discovery call <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Squiggle() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 14"
      className="absolute left-0 right-0 -bottom-2 w-full h-[14px]"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8 Q 20 0, 40 8 T 80 8 T 120 8 T 160 8 T 200 8 T 218 8"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px rgba(0,212,255,0.55))" }}
      />
    </svg>
  );
}

function MockDashboard() {
  return (
    <div className="card-soft p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[12px] text-sub">Task Dashboard · Today</span>
        </div>
        <span className="text-[11px] text-sub">Mon · 22 Jun</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
        {[
          { name: "Aarav", load: 78, mood: "Top", c: "var(--accent)" },
          { name: "Priya", load: 54, mood: "Hero", c: "#10b981" },
          { name: "Rohan", load: 38, mood: "Imp", c: "#f59e0b" },
        ].map((m) => (
          <div key={m.name} className="rounded-xl border border-hairline p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink">{m.name}</span>
              <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: "var(--alt)", color: m.c }}>{m.mood}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-hairline overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${m.load}%`, background: m.c }} />
            </div>
            <div className="mt-1 text-[10px] text-sub">{m.load}% load</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[
          { t: "Send weekly client report", who: "Priya", tag: "Top", c: "var(--accent)" },
          { t: "Review pre-event checklist", who: "Aarav", tag: "Hero", c: "#10b981" },
          { t: "Ping design for revisions", who: "Rohan", tag: "Rapid", c: "#a855f7" },
          { t: "Draft Q3 retainer recap", who: "Priya", tag: "Imp", c: "#f59e0b" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-hairline px-3 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-4 w-4 rounded-md border border-hairline" />
              <span className="truncate text-[13px]">{r.t}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-sub">{r.who}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "var(--alt)", color: r.c }}>{r.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section id="top" className="relative overflow-x-clip">
      <div aria-hidden className="absolute inset-0 dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden className="glow-blob h-[clamp(240px,50vw,420px)] w-[clamp(240px,50vw,420px)] -left-[clamp(60px,12vw,128px)] top-10 opacity-70" />
      <div aria-hidden className="glow-blob h-[clamp(200px,40vw,360px)] w-[clamp(200px,40vw,360px)] -right-[clamp(40px,10vw,100px)] top-40 opacity-60" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pt-14 pb-24 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-32">
        <div>
          <span className="reveal inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-3.5 py-1.5 text-[clamp(11px,2.5vw,12px)] text-sub">
            <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: "var(--accent)", boxShadow: "0 0 8px rgba(0,212,255,0.8)" }} />
            Introducing Task Manager 2.0
          </span>
          <h1 className="reveal mt-6 hero-h">
            One view.<br />
            Every task.<br />
            Your team,{" "}
            <span className="relative inline-block">
              <em className="italic">moving.</em>
              <Squiggle />
            </span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-[clamp(15px,2.2vw,17px)] leading-relaxed text-sub" style={{ transitionDelay: "0.08s" }}>
            A custom-built team management system, designed around the way you actually work —
            not the way some SaaS product assumes you do.
          </p>
          <div className="reveal mt-6 flex flex-wrap items-center gap-3" style={{ transitionDelay: "0.16s" }}>
            <MagneticButton
              href="/book"
              onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate({ to: "/book" }); }}
              className="btn-shimmer touch-btn inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[clamp(13px,2vw,14px)] font-medium text-white hover:opacity-90"
            >
              Book your 60-min discovery call <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href="#how"
              className="touch-btn inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-5 py-3 text-[clamp(13px,2vw,14px)] font-medium text-ink hover:border-ink"
            >
              See how it works
            </MagneticButton>
          </div>
          <p className="reveal mt-5 text-[clamp(11px,2vw,12px)] text-sub" style={{ transitionDelay: "0.24s" }}>
            No subscription. No learning curve. Built for you, deployed for you.
          </p>
        </div>

        <div className="reveal-scale relative mx-auto w-full max-w-md sm:max-w-none">
          <div className="absolute -inset-4 sm:-inset-6 -z-10 rounded-[36px]" style={{ background: "radial-gradient(closest-side, rgba(0,212,255,0.18), transparent 70%)" }} />
          <div className="animate-float">
            <MockDashboard />
          </div>
          <div className="absolute -top-3 sm:-top-4 -left-2 sm:-left-4 rounded-full border border-hairline bg-paper px-2.5 py-1.5 text-[clamp(10px,2vw,11px)] font-medium shadow-soft animate-float-tilt whitespace-nowrap">
            ✦ Task Dashboard
          </div>
          <div className="absolute -right-2 sm:-right-6 top-20 sm:top-24 hidden sm:block card-soft p-2.5 sm:p-3 text-[clamp(10px,2vw,11px)] rotate-[6deg] animate-float">
            <div className="font-semibold mb-1.5">Status legend</div>
            <div className="flex flex-col gap-1 text-sub">
              <span><i className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ background: "var(--accent)" }} />Top priority</span>
              <span><i className="inline-block h-2 w-2 rounded-full mr-1.5 bg-emerald-500" />In motion</span>
              <span><i className="inline-block h-2 w-2 rounded-full mr-1.5 bg-amber-500" />Waiting</span>
            </div>
          </div>
          <div className="absolute -bottom-4 sm:-bottom-5 left-4 sm:left-10 rounded-2xl bg-ink px-3 py-2.5 sm:px-4 sm:py-3 text-white shadow-soft">
            <div className="text-[clamp(9px,1.6vw,10px)] uppercase tracking-widest text-white/60">Productivity</div>
            <div className="serif text-[clamp(18px,3.5vw,22px)] leading-none">3× <span style={{ color: "var(--accent)" }}>faster</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Marquee ----------------------------- */

function Marquee() {
  const words = ["Spreadsheets", "WhatsApp groups", "Notion", "Asana", "Trello", "Email threads", "Sticky notes", "Stand-ups"];
  const row = [...words, ...words];
  return (
    <section className="border-y border-hairline bg-paper py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="eyebrow reveal">Replacing the patchwork teams outgrow</p>
      </div>
      <div className="relative mt-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10" />
        <div className="flex w-max animate-marquee gap-12 pr-12">
          {row.map((w, i) => (
            <span key={i} className="serif text-[clamp(2rem,4vw,3.4rem)] text-ink/30 italic whitespace-nowrap">
              {w} <span className="text-ink/15 not-italic">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Built For ----------------------------- */

function BuiltFor() {
  const cards = [
    {
      title: "The Operator",
      desc: "You're running campaigns, client work, and internal projects simultaneously. You need to see what's on fire and what's on track — without calling a meeting.",
      size: "3–8 person team",
      icon: Target,
    },
    {
      title: "The Builder",
      desc: "You're growing fast. The team doubled in six months and your old system of check-ins and tabs just doesn't scale. You need structure without bureaucracy.",
      size: "8–15 person team",
      icon: Home,
    },
    {
      title: "The Deliverer",
      desc: "Client commitments, internal deadlines, recurring work — it's a lot to track across people. You want one place to see who promised what, and whether it happened.",
      size: "Agency / service team",
      icon: Zap,
    },
  ];
  return (
    <section
      id="built-for"
      className="border-t border-b border-hairline"
      style={{ background: "#e7f6fc", paddingTop: "clamp(72px,10vw,128px)", paddingBottom: "clamp(72px,10vw,128px)" }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow reveal">Built for</p>
            <h2
              className="reveal mt-3"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(36px,4.8vw,68px)",
                lineHeight: 1.02,
                letterSpacing: "-0.015em",
              }}
            >
              Founders who need their team to <em className="italic">deliver.</em>
            </h2>
          </div>
          <p className="reveal text-[17px] text-sub md:pb-3" style={{ transitionDelay: "0.08s" }}>
            Three kinds of leader, one recurring problem: the work is real, but the system holding it together is you. Task Manager 2.0 takes that weight off your shoulders.
          </p>
        </div>

        <div className="mt-10 sm:mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className="founder-card reveal group"
              style={{ transitionDelay: `${0.08 * i}s` }}
            >
              <div className="founder-icon">
                <c.icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </div>
              <h3 className="serif text-[clamp(20px,3vw,24px)] text-ink">{c.title}</h3>
              <p className="mt-3 text-[clamp(14px,2vw,14.5px)] leading-relaxed text-sub">{c.desc}</p>
              <span className="founder-pill mt-6">{c.size}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ----------------------------- Coverflow + Comparison ----------------------------- */

function ScreenCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="h-full w-full card-soft p-4">
      <div className="flex items-center justify-between border-b border-hairline pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[11px] text-sub">{title}</span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Coverflow() {
  const screens = [
    {
      title: "Task Dashboard",
      body: (
        <div className="space-y-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-hairline px-2 py-1.5 text-[clamp(10px,2vw,11px)]">
              <span className="h-3 w-3 rounded border border-hairline shrink-0" />
              <span className="flex-1 truncate">Task #{i} — client deliverable</span>
              <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px]" style={{ background: "var(--wash)", color: "var(--accent-deep)" }}>Top</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Sticky Notes Board",
      body: (
        <div className="grid grid-cols-3 gap-1.5">
          {["#fff3a8","#cdeefd","#ffd6cc","#dcfce7","#fde2e4","#e0e7ff"].map((c, i) => (
            <div key={i} className="aspect-square rounded-md p-1 text-[clamp(8px,1.6vw,9px)] leading-tight text-ink/70 shadow" style={{ background: c }}>
              Note {i+1}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "New Task",
      body: (
        <div className="space-y-1.5">
          <div className="rounded-lg border border-hairline px-2 py-1.5 text-[clamp(10px,2vw,11px)] text-sub">Title — Send weekly client report</div>
          <div className="rounded-lg border border-hairline px-2 py-1.5 text-[clamp(10px,2vw,11px)] text-sub">Assignee — Priya</div>
          <div className="flex flex-wrap gap-1">
            {["Top","Hero","Imp","Rapid"].map(t => (
              <span key={t} className="rounded-full border border-hairline px-2 py-0.5 text-[clamp(9px,1.6vw,10px)]">{t}</span>
            ))}
          </div>
          <div className="rounded-lg bg-ink px-2.5 py-2 text-center text-[clamp(10px,2vw,11px)] text-white">Create task</div>
        </div>
      ),
    },
    {
      title: "Task Modal",
      body: (
        <div className="space-y-1.5">
          <div className="serif text-[clamp(15px,3vw,18px)]">Pre-event checklist</div>
          <div className="text-[clamp(10px,2vw,11px)] text-sub">Assigned to Aarav · Due Fri · Priority Hero</div>
          <div className="rounded-lg bg-alt p-1.5 text-[clamp(10px,2vw,11px)] text-sub">"All vendor confirmations to be locked by Wed EOD."</div>
          <div className="flex items-center justify-between text-[clamp(10px,2vw,11px)] text-sub">
            <span>3 of 7 subtasks done</span>
            <span style={{ color: "var(--accent-deep)" }}>42%</span>
          </div>
          <ProgressBar percent={42} />
        </div>
      ),
    },
  ];
  const n = screens.length;
  const [idx, setIdx] = useState(0);
  const [spread, setSpread] = useState(42);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx((i) => (i + 1) % n), 5600);
  }

  function go(d: number) { resetTimer(); setIdx((i) => (i + d + n) % n); }

  function jumpTo(i: number) { resetTimer(); setIdx(i); }

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    function update() { setSpread(mq.matches ? 52 : 42); }
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div
      ref={carouselRef}
      className="relative overflow-x-hidden"
      onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
      onMouseLeave={() => { resetTimer(); }}
    >
      <div
        className="relative mx-auto w-full"
        style={{ height: "clamp(260px, 60vw, 420px)", maxWidth: "min(100%, 900px)" }}
      >
        {screens.map((s, i) => {
          const d = ((i - idx + n) % n + n) % n;
          const ad = Math.min(d, n - d);
          const sign = d <= n / 2 ? 1 : -1;
          const dir = sign * ad;
          return (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-label={`Show ${s.title}`}
              className="absolute top-1/2 left-1/2"
              style={{
                width: "clamp(300px, 60vw, 620px)",
                height: "clamp(240px, 56vw, 380px)",
                cursor: ad ? "pointer" : "default",
                transform: `translate(-50%, -50%) translateX(${dir * spread}%) scale(${Math.max(0.8, 1 - ad * 0.1)})`,
                filter: ad ? `blur(${ad * 1.1}px)` : "none",
                opacity: ad ? Math.max(0.5, 0.78 - (ad - 1) * 0.26) : 1,
                zIndex: 30 - ad * 10,
                boxShadow: ad ? "0 24px 50px -30px rgba(0,0,0,.4)" : "0 50px 100px -38px rgba(0,0,0,.55), 0 0 0 1px rgba(0,0,0,.04)",
                transition: "transform .6s cubic-bezier(.3,.7,.3,1), filter .6s, opacity .6s",
              }}
            >
              <ScreenCard title={s.title}>{s.body}</ScreenCard>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => go(-1)} aria-label="Previous" className="touch-btn grid h-11 w-11 sm:h-10 sm:w-10 place-items-center rounded-full border border-hairline bg-paper hover:border-ink">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => go(1)} aria-label="Next" className="touch-btn grid h-11 w-11 sm:h-10 sm:w-10 place-items-center rounded-full border border-hairline bg-paper hover:border-ink">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Surgical() {
  const before = [
    "Don't know what your team is working on without asking",
    "WhatsApp tasks forgotten in scroll-back",
    "40-minute stand-ups still leave gaps",
    "Priority is a conversation, not a system",
    "Recurring work rebuilt from scratch every time",
  ];
  const after = [
    "One screen shows every member's load, priority, and status",
    "Tasks logged, assigned, mood-tagged, tracked",
    "40-minute stand-up becomes a 10-minute call",
    "A custom priority system the team actually understands",
    "Template routines fire recurring tasks (Daily, Weekly, Pre-Event)",
  ];
  return (
    <section className="bg-alt border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow reveal">From scattered to surgical</p>
          <h2 className="reveal mt-3 section-h">
            The difference one screen <em className="italic">makes.</em>
          </h2>
        </div>
        <div className="reveal-scale mt-10 sm:mt-14">
          <Coverflow />
        </div>
        <div className="mt-12 sm:mt-20 grid gap-6 sm:grid-cols-2">
          <div className="reveal-left card-soft p-7">
            <div className="eyebrow">Before Task Manager 2.0</div>
            <ul className="mt-5 space-y-3.5">
              {before.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] text-sub">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                    <X className="h-3 w-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="reveal-right card-soft p-7"
            style={{ borderColor: "var(--accent)", boxShadow: "0 0 0 1px var(--accent), var(--shadow-glow), var(--shadow-soft)" }}
          >
            <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>With Task Manager 2.0</div>
            <ul className="mt-5 space-y-3.5">
              {after.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] text-ink">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: "var(--wash)", color: "var(--accent-deep)" }}>
                    <Check className="h-3 w-3" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Workstyle (feature grid) ----------------------------- */

function Workstyle() {
  const items = [
    { eb: "Views", title: "Custom views", desc: "Task Dashboard, Line Up, List View, Task Generator — each shaped to a different decision.", icon: LayoutDashboard, c: "#00d4ff" },
    { eb: "Routines", title: "Routine templates", desc: "Daily, Weekly, 15th-of-month, Pre-Event — recurring work fires itself.", icon: Repeat, c: "#10b981" },
    { eb: "Priority", title: "Priority system", desc: "Mood tags Top, Hero, Imp, Rapid — language your team already speaks.", icon: Flag, c: "#f59e0b" },
    { eb: "Taxonomy", title: "Master tags", desc: "A single source of truth for projects, clients, and themes across the company.", icon: Tags, c: "#a855f7" },
    { eb: "North star", title: "Milestones", desc: "Tie daily tasks to the quarterly thing that actually matters.", icon: Target, c: "#e76f51" },
    { eb: "Speed", title: "Built with AI", desc: "Deployed in days, not months. Iterated in hours, not sprints.", icon: Sparkles, c: "#000000" },
  ];
  return (
    <section className="bg-paper border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow reveal">It fits your workstyle</p>
          <h2 className="reveal mt-3 section-h">
            Six surfaces. <em className="italic">One system.</em>
          </h2>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={it.title} className="reveal bg-paper p-6 sm:p-8 transition-colors hover:bg-alt" style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
              <div className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: it.c, boxShadow: `0 8px 24px -10px ${it.c}55` }}>
                <it.icon className="h-5 w-5" />
              </div>
              <div className="eyebrow mt-6">{it.eb}</div>
              <h3 className="serif mt-2 text-[clamp(22px,3.6vw,26px)]">{it.title}</h3>
              <p className="mt-3 text-[clamp(14px,2vw,15px)] text-sub">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Stats ----------------------------- */

function Stats() {
  return (
    <section className="bg-paper border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard light eyebrow="Task completion visibility" value={<><Counter to={50} suffix="%+" /></>} label="improvement in task completion visibility" percent={70} />
          <StatCard light eyebrow="Team productivity" value={<><Counter to={3} suffix="×" /></>} label="lift in team output, week over week" percent={88} />
          <StatCard eyebrow="Time saved" value={<><Counter to={45} suffix="m" /></>} label="saved daily on check-ins and pings" percent={62} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ eyebrow, value, label, percent, light = false }: { eyebrow: string; value: React.ReactNode; label: string; percent: number; light?: boolean }) {
  return (
    <div
      className={`reveal card-soft p-6 sm:p-8 ${light ? "" : "bg-ink text-white border-ink"}`}
      style={!light ? { borderColor: "#111" } : {}}
    >
      <div className={`eyebrow ${light ? "" : "!text-white/50"}`}>{eyebrow}</div>
      <div className={`serif mt-3 text-[clamp(3rem,6vw,4.4rem)] leading-none ${light ? "" : ""}`}
           style={!light ? { color: "var(--accent)" } : { color: "var(--ink)" }}>
        {value}
      </div>
      <p className={`mt-3 text-[14px] ${light ? "text-sub" : "text-white/70"}`}>{label}</p>
      <div className={`mt-6 ${light ? "" : "opacity-90"}`}>
        <ProgressBar percent={percent} />
      </div>
    </div>
  );
}

/* ----------------------------- Inside ----------------------------- */

function Inside() {
  const items = [
    { title: "Task Dashboard", desc: "Everyone's load, priority and status at a glance.", icon: LayoutDashboard },
    { title: "Line Up", desc: "Sequence the day so your team starts knowing what's next.", icon: ListChecks },
    { title: "List View", desc: "Filter, sort, group — answer any team question in two clicks.", icon: ListChecks },
    { title: "Milestones", desc: "Quarterly outcomes wired to daily tasks.", icon: Target },
    { title: "Builder & Role mapping", desc: "Who owns what — and what to do when they're out.", icon: Users },
    { title: "Master Tags", desc: "One taxonomy across clients, projects and themes.", icon: Tags },
  ];
  return (
    <section id="inside" className="bg-alt border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow reveal">What's inside</p>
          <h2 className="reveal mt-3 section-h">
            Everything you need. <em className="italic">Nothing you don't.</em>
          </h2>
        </div>

        {/* Featured: Task Generator */}
        <div className="reveal-scale mt-14 grid gap-8 overflow-hidden rounded-[22px] border border-hairline bg-paper sm:grid-cols-[1.1fr_1fr]">
          <div className="p-6 sm:p-10">
            <div className="eyebrow">Featured</div>
            <h3 className="serif mt-3 text-[clamp(1.8rem,3vw,2.6rem)]">
              Task Generator 2.0 — <em className="italic">recurring work, on autopilot.</em>
            </h3>
            <p className="mt-4 max-w-md text-[15px] text-sub">
              Define a routine once. The system fires the tasks, assigns the right person, and tags it with the right priority — every Monday, every 15th, every pre-event run-up.
            </p>
            <div className="mt-6 flex gap-2 flex-wrap">
              {["Daily","Weekly","Monthly","Pre-Event"].map(t => (
                <span key={t} className="rounded-full border border-hairline bg-paper px-3 py-1 text-[11px] font-medium text-sub">{t}</span>
              ))}
            </div>
          </div>
          <div className="relative bg-alt p-6 sm:p-10">
            <div className="card-soft p-5">
              <div className="eyebrow">Templates</div>
              <div className="mt-4 space-y-2.5">
                {[
                  { t: "Daily client report", who: "Priya · 09:00", tag: "Daily" },
                  { t: "Weekly review", who: "Aarav · Mon", tag: "Weekly" },
                  { t: "Pre-event checklist", who: "Rohan · -3 days", tag: "Pre-Event" },
                ].map((r) => (
                  <div key={r.t} className="flex items-center justify-between rounded-xl border border-hairline px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium">{r.t}</div>
                      <div className="text-[11px] text-sub">{r.who}</div>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "var(--wash)", color: "var(--accent-deep)" }}>
                      {r.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-3 right-4 sm:right-6 rounded-full bg-ink px-3.5 py-2 text-[11px] font-medium text-white shadow-soft animate-float whitespace-nowrap">
              1 click → assigned
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-[22px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={it.title} className="reveal bg-paper p-7" style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-hairline" style={{ color: "var(--accent-deep)" }}>
                <it.icon className="h-5 w-5" />
              </div>
              <h4 className="serif mt-5 text-[22px]">{it.title}</h4>
              <p className="mt-2 text-[14px] text-sub">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Why not ----------------------------- */

function WhyNot() {
  const rows = [
    ["Fits your specific workflow", "Off-the-shelf compromise", "Designed around your team"],
    ["Custom priority & mood system", "Generic high/med/low", "Top, Hero, Imp, Rapid — your language"],
    ["Template routines by frequency", "Manual recreation each time", "Daily, Weekly, 15th, Pre-Event auto-fire"],
    ["Ongoing evolution as you grow", "You wait for roadmap votes", "Iterated for you, every quarter"],
    ["Per-seat recurring cost", "$$$ forever, scales with team", "One build. You own it."],
    ["Team actually uses it", "Half-adopted within 6 weeks", "Built around their habits, not against them"],
  ];
  return (
    <section className="bg-paper border-b border-hairline">
      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow reveal">Why not just Asana, Notion or Monday?</p>
          <h2 className="reveal mt-3 section-h">
            SaaS is built for everyone. <em className="italic">This is built for you.</em>
          </h2>
        </div>
        <div className="reveal-scale mt-12 table-scroll rounded-[22px]">
          <div className="min-w-[640px] rounded-[22px] border border-hairline">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] text-[13px]">
            <div className="bg-alt p-4 sm:p-5 eyebrow">What matters</div>
            <div className="bg-alt p-4 sm:p-5 eyebrow text-center">SaaS tools</div>
            <div className="p-4 sm:p-5 eyebrow text-center" style={{ background: "var(--wash)", color: "var(--accent-deep)" }}>
              Task Mgr 2.0
            </div>
            {rows.map((r, i) => (
              <div key={i} className="contents">
                <div className={`border-t border-hairline p-4 sm:p-5 text-[14px] ${i % 2 ? "bg-paper" : "bg-paper"}`}>{r[0]}</div>
                <div className="border-t border-hairline p-4 sm:p-5 text-center text-[13px] text-destructive flex items-center justify-center gap-2">
                  <X className="h-3.5 w-3.5" /> {r[1]}
                </div>
                <div className="border-t border-hairline p-4 sm:p-5 text-center text-[13px] flex items-center justify-center gap-2" style={{ background: "color-mix(in oklab, var(--wash) 60%, white)", color: "var(--accent-deep)" }}>
                  <Check className="h-3.5 w-3.5" /> {r[2]}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Timeline ----------------------------- */

function Timeline() {
  const steps = [
    { n: "01", t: "Discovery questionnaire", d: "We learn how your team really works — the tools, the friction, the non-negotiables.", tag: "60 minutes" },
    { n: "02", t: "Workstyle brainstorm", d: "A working session with your team to surface the priority language and routines they need.", tag: "With your team" },
    { n: "03", t: "Phase 1 deployment", d: "First working version in your hands, with the core workflows wired up.", tag: "Fast deployment" },
    { n: "04", t: "Run it for a week", d: "Your team uses it for real work. We watch where it bends and where it breaks.", tag: "Your feedback" },
    { n: "05", t: "Iteration and refinement", d: "We translate that week of feedback into surfaces, fields, and routines that fit.", tag: "We do the work" },
    { n: "06", t: "Cloud deployment — it's yours", d: "Production deployment with documentation and a support cadence that keeps it evolving.", tag: "Ongoing support", done: true },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * 0.6;
      const passed = Math.min(total, Math.max(0, vh * 0.85 - r.top));
      setFill(Math.min(100, (passed / total) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="how" className="bg-alt border-b border-hairline">
      <div className="mx-auto max-w-5xl px-5 section-pad sm:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow reveal">How it works</p>
          <h2 className="reveal mt-3 section-h">
            From discovery to deployed — <em className="italic">fast.</em>
          </h2>
        </div>

        <div ref={trackRef} className="relative mt-16 pl-10 sm:pl-14">
          {/* Track */}
          <div className="absolute left-3 sm:left-5 top-2 bottom-2 w-px bg-hairline">
            <div
              className="w-full origin-top transition-all duration-200"
              style={{ height: `${fill}%`, background: "linear-gradient(180deg, var(--accent), var(--accent-deep))", boxShadow: "0 0 10px rgba(0,212,255,0.5)" }}
            />
          </div>

          <ol className="space-y-12">
            {steps.map((s, i) => (
              <li key={s.n} className="reveal-left relative" style={{ transitionDelay: `${i * 0.05}s` }}>
                <span
                  className={`absolute -left-[34px] sm:-left-[44px] top-1 grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-semibold ${
                    s.done ? "text-white" : "text-ink"
                  }`}
                  style={s.done
                    ? { background: "var(--accent)", borderColor: "var(--accent)", boxShadow: "0 0 0 4px rgba(0,212,255,0.18)" }
                    : { background: "var(--paper)", borderColor: "var(--hairline)" }
                  }
                >
                  {s.done ? <Check className="h-3.5 w-3.5" /> : s.n}
                </span>
                <div className="card-soft p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="serif text-[clamp(20px,3.6vw,24px)]">{s.t}</h3>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: "var(--wash)", color: "var(--accent-deep)" }}>
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] text-sub">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Testimonials ----------------------------- */

function Avatar({ name, gradient }: { name: string; gradient: string }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  return (
    <div className="grid h-12 w-12 place-items-center rounded-full text-white font-semibold text-[14px]" style={{ background: gradient }}>
      {initials}
    </div>
  );
}

function Testimonials() {
  const quotes = [
    { name: "Aarav Mehta", role: "Founder, Studio Nila", g: "linear-gradient(135deg,#00d4ff,#0091b0)", quote: "We replaced four tools and a stand-up. The team finally sees what each other is doing — without a single 'what are you working on?' message." },
    { name: "Priya Nair", role: "COO, Brightwork", g: "linear-gradient(135deg,#f59e0b,#e76f51)", quote: "The custom priority tags changed everything. Our team uses Top, Hero, Imp, Rapid — and there's no ambiguity in any standup anymore." },
    { name: "Rohan Iyer", role: "Founder, Pixelclub Agency", g: "linear-gradient(135deg,#a855f7,#6366f1)", quote: "Recurring tasks used to slip through every week. Now the templates fire themselves. Easily 45 minutes back daily." },
    { name: "Neha Kulkarni", role: "Director, Lumora Design", g: "linear-gradient(135deg,#10b981,#0d9488)", quote: "It feels like the system was designed by someone who'd sat in our team meetings. Because it was." },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, [quotes.length]);
  return (
    <section id="stories" className="bg-alt border-b border-hairline">
      <div className="mx-auto max-w-5xl px-5 section-pad sm:px-8 text-center">
        <p className="eyebrow reveal">Stories</p>
        <h2 className="reveal mt-3 section-h">
          Leaders who made the <em className="italic">switch.</em>
        </h2>

        <div className="reveal-scale mt-12 relative">
          <div className="card-soft mx-auto max-w-3xl p-10 sm:p-14 min-h-[280px]">
            <div key={i} className="animate-[fade-in_0.5s_ease-out]">
              <p className="serif text-[clamp(1.4rem,2.6vw,2rem)] leading-snug italic text-ink">
                "{quotes[i].quote}"
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Avatar name={quotes[i].name} gradient={quotes[i].g} />
                <div className="text-left">
                  <div className="text-[14px] font-semibold">{quotes[i].name}</div>
                  <div className="text-[12px] text-sub">{quotes[i].role}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={() => setI((p) => (p - 1 + quotes.length) % quotes.length)} aria-label="Previous testimonial" className="touch-btn grid h-11 w-11 sm:h-10 sm:w-10 place-items-center rounded-full border border-hairline bg-paper hover:border-ink">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: idx === i ? 24 : 8,
                    background: idx === i ? "var(--accent)" : "var(--hairline)",
                  }}
                />
              ))}
            </div>
            <button onClick={() => setI((p) => (p + 1) % quotes.length)} aria-label="Next testimonial" className="touch-btn grid h-11 w-11 sm:h-10 sm:w-10 place-items-center rounded-full border border-hairline bg-paper hover:border-ink">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Final CTA ----------------------------- */

function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative bg-paper overflow-hidden">
      <div aria-hidden className="glow-blob h-[600px] w-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" />
      <div className="relative mx-auto max-w-3xl px-5 section-pad text-center">
        <span className="reveal inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-3.5 py-1.5 text-[12px] text-sub">
          <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: "var(--accent)", boxShadow: "0 0 8px rgba(0,212,255,0.8)" }} />
          Your next chapter
        </span>
        <h2 className="reveal mt-6 section-h">
          Ready to stop managing <em className="italic">from memory?</em>
        </h2>
        <p className="reveal mt-6 text-[17px] text-sub" style={{ transitionDelay: "0.08s" }}>
          Book a 60-minute discovery call. We'll map your team's workflow, show you what Task Manager 2.0 could look like for you,
          and tell you honestly if it's a fit.
        </p>
        <div className="reveal mt-9 flex justify-center" style={{ transitionDelay: "0.16s" }}>
          <MagneticButton
            href="/book"
            onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate({ to: "/book" }); }}
            className="btn-shimmer touch-btn rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-white"
          >
            Book your discovery call <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
        <p className="reveal mt-5 text-[12px] text-sub" style={{ transitionDelay: "0.24s" }}>
          No commitment. No pitch deck. Just a conversation about how your team works.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- Footer ----------------------------- */

function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8 grid gap-10 sm:gap-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="serif mt-5 max-w-sm text-[22px] leading-snug text-white/85">
            Making businesses easier to run — <em className="italic">one custom system at a time.</em>
          </p>
          <div className="mt-7 flex gap-3">
            {[
              { Icon: Twitter, label: "Twitter", href: "#" },
              { Icon: Linkedin, label: "LinkedIn", href: "#" },
              { Icon: Mail, label: "Email", href: "mailto:hello@nextchapter.in" },
            ].map(({ Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 hover:border-white hover:bg-white/5 transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow !text-white/50">Get the monthly note</div>
          <p className="mt-3 text-[14px] text-white/70">One short read each month on building systems your team actually uses.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="mt-5 flex flex-col sm:flex-row gap-2 rounded-2xl sm:rounded-full border border-white/20 bg-white/5 p-3 sm:p-1.5"
          >
            <input
              type="email"
              required
              placeholder="you@company.com"
              aria-label="Email address"
              className="w-full sm:flex-1 bg-transparent px-4 py-2.5 sm:py-2 text-[14px] text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              className="btn-shimmer touch-btn w-full sm:w-auto rounded-full px-4 py-2.5 sm:py-2 text-[13px] font-medium text-ink"
              style={{ background: "var(--accent)", boxShadow: "0 0 24px rgba(0,212,255,0.4)" }}
            >
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <div className="eyebrow !text-white/50">Talk to us</div>
          <a href="mailto:hello@nextchapter.in" className="mt-3 block serif text-[22px] hover:opacity-80">hello@nextchapter.in</a>
          <p className="mt-2 text-[13px] text-white/60">Mon–Fri · We reply within a day.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-white/50">
          <span>Task Manager 2.0 © 2026 Next Chapter. All rights reserved.</span>
          <span className="italic">Built for teams that move.</span>
        </div>
      </div>
    </footer>
  );
}
