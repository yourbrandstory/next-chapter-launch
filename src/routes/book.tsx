import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { getSupabase } from "../lib/supabaseClient";

export const Route = createFileRoute("/book")({
  component: BookACall,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      ".book-reveal, .book-reveal-left, .book-reveal-right"
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

type TeamSize = "1-5" | "6-10" | "11-20" | "20+";
type Tool = "Spreadsheets" | "WhatsApp" | "Notion" | "Asana" | "Trello" | "Email threads";
type CallTime = "Mornings" | "Afternoons" | "Evenings";

const TEAM_SIZES: TeamSize[] = ["1-5", "6-10", "11-20", "20+"];
const TOOLS: Tool[] = ["Spreadsheets", "WhatsApp", "Notion", "Asana", "Trello", "Email threads"];
const CALL_TIMES: CallTime[] = ["Mornings", "Afternoons", "Evenings"];

const AVATARS = [
  { initials: "AM", gradient: "linear-gradient(135deg,#00d4ff,#0091b0)" },
  { initials: "PN", gradient: "linear-gradient(135deg,#f59e0b,#e76f51)" },
  { initials: "RI", gradient: "linear-gradient(135deg,#a855f7,#6366f1)" },
];

function BookACall() {
  const scrolled = useScrolled(12);
  useReveal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [painPoints, setPainPoints] = useState("");
  const [callTime, setCallTime] = useState<CallTime | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function toggleTool(tool: Tool) {
    setTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await getSupabase().from("discovery_requests").insert({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        team_size: teamSize,
        tools: tools.length > 0 ? tools : null,
        message: painPoints.trim() || null,
        best_time: callTime,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setName("");
    setEmail("");
    setCompany("");
    setTeamSize(null);
    setTools([]);
    setPainPoints("");
    setCallTime(null);
    setSubmitted(false);
    setSubmitError(null);
  }

  return (
    <main className="bg-paper text-ink">
      <Nav scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-5 section-pad sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Left column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="book-reveal">
              <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-3.5 py-1.5 text-[12px] text-sub">
                <span className="h-1.5 w-1.5 rounded-full animate-blink" style={{ background: "var(--accent)", boxShadow: "0 0 8px rgba(0,212,255,0.8)" }} />
                Book your discovery call
              </span>
            </div>

            <h1 className="book-reveal mt-6 hero-h" style={{ transitionDelay: "0.08s" }}>
              Let's map your team's{" "}
              <em className="italic">next chapter.</em>
            </h1>

            <p className="book-reveal mt-6 max-w-xl text-[17px] leading-relaxed text-sub" style={{ transitionDelay: "0.16s" }}>
              Tell us a little about your team. We'll reply within a day to schedule
              a 60-minute call — no pitch deck, just a conversation about how your team
              works and whether we can help.
            </p>

            <div className="book-reveal mt-10 space-y-6" style={{ transitionDelay: "0.24s" }}>
              <h3 className="eyebrow">What happens next</h3>
              {[
                { num: "1", title: "You send this over", desc: "Fill out the form and we'll get it on our end." },
                { num: "2", title: "We reply within a day", desc: "We read every submission personally and reach out to schedule." },
                { num: "3", title: "We talk, then we build", desc: "A 60-min discovery call to map your workflow. If it's a fit, we build." },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">
                    {step.num}
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-ink">{step.title}</div>
                    <div className="mt-0.5 text-[14px] text-sub">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="book-reveal mt-10 flex items-center gap-4 rounded-2xl border border-hairline bg-paper px-5 py-4 shadow-soft" style={{ transitionDelay: "0.32s" }}>
              <div className="flex -space-x-3">
                {AVATARS.map((a) => (
                  <div
                    key={a.initials}
                    className="grid h-10 w-10 place-items-center rounded-full border-2 border-paper text-[11px] font-semibold text-white"
                    style={{ background: a.gradient }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-sub">
                Trusted by founders at <strong className="text-ink">Studio Nila</strong>,{" "}
                <strong className="text-ink">Brightwork</strong> &amp; more.
              </p>
            </div>
          </div>

          {/* Right column — form card */}
          <div className="book-reveal-right">
            {submitted ? (
              <div className="card-soft p-6 sm:p-14 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--wash)" }}>
                  <Check className="h-8 w-8" style={{ color: "var(--accent-deep)" }} />
                </div>
                <h2 className="serif mt-6 text-[clamp(1.8rem,3vw,2.4rem)]">Your request is in.</h2>
                <p className="mt-3 text-[15px] text-sub">
                  Thanks, {name || "there"} — we'll be in touch within a day…
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Back to site
                  </Link>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink"
                  >
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-[24px] border border-[#eaeaea] bg-paper p-5 sm:p-10 shadow-soft"
                style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.18), 0 8px 20px -10px rgba(0,0,0,0.08)" }}
              >
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="book-name" className="block text-[13px] font-semibold text-ink mb-1.5">
                      Your name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="book-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-[border,box-shadow] placeholder:text-sub/50 focus:border-[#00d4ff] focus:ring-[4px] focus:ring-[rgba(0,212,255,0.16)]"
                      placeholder="e.g. Aarav Mehta"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="book-email" className="block text-[13px] font-semibold text-ink mb-1.5">
                      Work email <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="book-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-[border,box-shadow] placeholder:text-sub/50 focus:border-[#00d4ff] focus:ring-[4px] focus:ring-[rgba(0,212,255,0.16)]"
                      placeholder="aarav@studio.co"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="book-company" className="block text-[13px] font-semibold text-ink mb-1.5">
                      Company / studio
                    </label>
                    <input
                      id="book-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-[border,box-shadow] placeholder:text-sub/50 focus:border-[#00d4ff] focus:ring-[4px] focus:ring-[rgba(0,212,255,0.16)]"
                      placeholder="Studio Nila"
                    />
                  </div>

                  {/* Team size */}
                  <div>
                    <label className="block text-[13px] font-semibold text-ink mb-2">
                      Team size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          className={`flex-1 min-w-[70px] rounded-full px-4 py-2.5 text-[13px] font-medium transition-all ${
                            teamSize === size
                              ? "bg-ink text-white ring-4 ring-[rgba(0,212,255,0.25)]"
                              : "bg-paper text-sub border border-hairline hover:border-ink"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <label className="block text-[13px] font-semibold text-ink mb-2">
                      What are you using today?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TOOLS.map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleTool(tool)}
                          className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                            tools.includes(tool)
                              ? "bg-ink text-white ring-4 ring-[rgba(0,212,255,0.25)]"
                              : "bg-paper text-sub border border-hairline hover:border-ink"
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pain points */}
                  <div>
                    <label htmlFor="book-pain" className="block text-[13px] font-semibold text-ink mb-1.5">
                      What's slowing your team down right now?
                    </label>
                    <textarea
                      id="book-pain"
                      rows={4}
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      className="w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-[border,box-shadow] placeholder:text-sub/50 resize-y focus:border-[#00d4ff] focus:ring-[4px] focus:ring-[rgba(0,212,255,0.16)]"
                      placeholder="e.g. We're using three tools and still losing track of tasks..."
                    />
                  </div>

                  {/* Call time */}
                  <div>
                    <label className="block text-[13px] font-semibold text-ink mb-2">
                      Best time for a call
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CALL_TIMES.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setCallTime(time)}
                          className={`flex-1 min-w-[100px] rounded-full px-4 py-2.5 text-[13px] font-medium transition-all ${
                            callTime === time
                              ? "bg-ink text-white ring-4 ring-[rgba(0,212,255,0.25)]"
                              : "bg-paper text-sub border border-hairline hover:border-ink"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error banner */}
                  {submitError && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      <p className="text-[13px] text-destructive">{submitError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-shimmer touch-btn w-full rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>Sending&hellip;</>
                    ) : (
                      <>Request my discovery call <ArrowRight className="ml-1 inline h-4 w-4" /></>
                    )}
                  </button>

                  <p className="text-center text-[12px] text-sub">
                    No subscription. No pitch deck. We reply within a day.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-hairline shadow-[0_8px_24px_-18px_rgba(0,0,0,0.2)]"
          : "bg-paper/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-ink">
            <span
              className="h-2 w-2 rounded-full animate-blink"
              style={{ background: "var(--accent)", boxShadow: "0 0 12px rgba(0,212,255,0.8)" }}
            />
          </span>
          <span className="serif text-[20px] leading-none text-ink">Next Chapter</span>
        </Link>
        <Link
          to="/"
          className="text-[14px] text-sub transition-colors hover:text-ink"
        >
          &larr; Back to site
        </Link>
      </div>
    </header>
  );
}
