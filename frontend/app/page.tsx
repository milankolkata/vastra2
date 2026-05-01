import Link from "next/link";
import {
  ArrowRight, BarChart3, Users, MapPin, TrendingUp, Sparkles,
  AlertTriangle, Package, CheckCircle2, Shirt, Flame, ChevronRight,
  Star, ShoppingBag, Target, Zap,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */

const problems = [
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Buying on gut feel",
    desc: "You reorder what feels popular — but gut feel leads to wrong stock, wrong quantities, and capital locked in unsold pieces.",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Dead stock piling up",
    desc: "Designs that don't move sit in your store for months. Every unsold piece is cash that can't be reinvested in the next season.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "No idea who wants what",
    desc: "You have buyers across cities but no clear picture of which customer wants which design — so you blast everyone and convert few.",
  },
];

const features = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    color: "bg-violet-100 text-violet-600",
    title: "Sales Intelligence",
    desc: "Upload any CSV or Excel file. Get instant breakdown of top-selling designs, revenue trends, and actionable restock alerts.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    color: "bg-sky-100 text-sky-600",
    title: "Smart Customer Matching",
    desc: "Build buyer profiles once. AI instantly tells you which customers are most likely to buy each design — by preference, budget, and city.",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    color: "bg-rose-100 text-rose-600",
    title: "Lead Discovery",
    desc: "Find ethnic wear buyers and retailers in any Indian city — Mumbai, Delhi, Surat, Jaipur. Get names, phones, and Maps links in one click.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-600",
    title: "30-Day Demand Forecast",
    desc: "AI-powered predictions so you order the right quantity before the season peaks — never over-buy or under-stock again.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-600",
    title: "Festival Opportunity Alerts",
    desc: "Never miss Diwali, Navratri, or Eid. Get stock and colour suggestions weeks in advance so you're always prepared.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "bg-red-100 text-red-600",
    title: "Dead Stock Detection",
    desc: "Identify slow-moving designs before they become a problem. Get liquidation suggestions and pricing recommendations.",
  },
];

const steps = [
  {
    n: "01",
    title: "Upload Your Sales Data",
    desc: "Drop in a CSV or Excel file of your past sales. Our engine processes it in seconds — no formatting rules, no setup.",
    icon: <Package className="w-6 h-6" />,
  },
  {
    n: "02",
    title: "Add Your Buyers",
    desc: "Build a quick profile for each customer: their city, budget, preferred styles, and favourite colours. Takes 2 minutes per buyer.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    n: "03",
    title: "Get Instant Suggestions",
    desc: "See exactly which designs to restock, which buyers to call, and which cities have untapped demand — before you spend a rupee.",
    icon: <Zap className="w-6 h-6" />,
  },
];

const testimonials = [
  {
    quote: "Vastra AI helped me identify dead stock before Diwali. Saved me ₹2 lakhs in over-buying. I now know exactly what to reorder each season.",
    name: "Priya Mehta",
    role: "Owner, Surat Ethnic Boutique",
    initials: "PM",
  },
  {
    quote: "The customer matching feature is incredible. I WhatsApp the right buyers when a new design arrives — my conversion rate went up 3x.",
    name: "Rajesh Patel",
    role: "Proprietor, Mumbai Textile House",
    initials: "RP",
  },
  {
    quote: "I used to guess which fabrics to stock for each season. Now I get forecasts 30 days in advance. It completely changed how I buy.",
    name: "Anita Singh",
    role: "Founder, Delhi Lehenga Store",
    initials: "AS",
  },
];

const included = [
  "Unlimited design uploads",
  "Smart customer matching (AI-powered)",
  "Lead discovery — any Indian city",
  "30-day demand forecast",
  "Festival opportunity alerts",
  "Dead stock detection",
  "Sales trend analysis",
  "Color & fabric insights",
];

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ══════════════ NAV ══════════════ */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-[15px]">Vastra AI</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden pt-20 pb-8 sm:pt-28 sm:pb-16 bg-white">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#6d28d9 1px, transparent 1px), linear-gradient(90deg, #6d28d9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-violet-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Built for Indian Ethnic Wear Retailers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
            Know what will sell{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-amber-500 bg-clip-text text-transparent">
              before you buy stock
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your sales data and designs. Instantly see what to restock, who to sell to,
            and what trends are rising — so every purchase pays off.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-200"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl text-base border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Try Demo
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            No credit card required · Works with any CSV or Excel file
          </p>

          {/* ── Product mockup ── */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-white">
              {/* Browser chrome */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md h-5 mx-4 flex items-center px-2.5">
                  <span className="text-xs text-slate-400">vastra-ai.com/dashboard</span>
                </div>
              </div>

              {/* App layout */}
              <div className="flex h-52 sm:h-72">
                {/* Sidebar */}
                <div className="w-36 sm:w-44 bg-[#16082a] flex flex-col p-3 shrink-0 border-r border-white/5">
                  <div className="flex items-center gap-2 px-2 py-2 mb-3">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-amber-500 shrink-0" />
                    <span className="text-white text-[11px] font-bold">Vastra AI</span>
                  </div>
                  <p className="text-white/25 text-[9px] font-semibold uppercase tracking-widest px-2 mb-1.5">Sales</p>
                  {[
                    { label: "Upload Data", active: false },
                    { label: "Insights", active: true },
                    { label: "Forecast", active: false },
                    { label: "Festivals", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-2.5 py-1.5 rounded-md text-[10px] sm:text-[11px] mb-0.5 font-medium ${
                        item.active ? "bg-violet-600 text-white" : "text-white/40"
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                  <p className="text-white/25 text-[9px] font-semibold uppercase tracking-widest px-2 mb-1.5 mt-3">Catalog</p>
                  {["Designs", "Customers"].map((item) => (
                    <div key={item} className="px-2.5 py-1.5 rounded-md text-[10px] sm:text-[11px] text-white/40 mb-0.5">
                      {item}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-50 p-3 sm:p-4 overflow-hidden">
                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {[
                      { label: "Units Sold", value: "4,280", color: "text-violet-600" },
                      { label: "Revenue",    value: "₹8.4L", color: "text-emerald-600" },
                      { label: "Designs",    value: "128",   color: "text-amber-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-lg p-2 sm:p-2.5 border border-slate-200 shadow-sm">
                        <div className={`text-xs sm:text-sm font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-lg border border-slate-200 p-2.5 sm:p-3 mb-2.5 sm:mb-3">
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium mb-2">Sales Trend</div>
                    <svg viewBox="0 0 200 36" className="w-full h-8 sm:h-9" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polyline
                        points="0,32 25,26 55,20 80,23 110,13 140,9 170,11 200,6"
                        fill="none" stroke="#7c3aed" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                      <polygon
                        points="0,32 25,26 55,20 80,23 110,13 140,9 170,11 200,6 200,36 0,36"
                        fill="url(#heroChartGrad)"
                      />
                    </svg>
                  </div>

                  {/* Insight card */}
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-2 sm:p-2.5 flex items-start gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-violet-800">
                      <span className="font-semibold">Restock Banarasi Silk Saree</span> — 42 units sold last month, stock running low
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -bottom-4 inset-x-12 h-10 bg-violet-300/20 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ══════════════ CITIES STRIP ══════════════ */}
      <div className="border-y border-slate-100 bg-slate-50/80 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Trusted by store owners in &nbsp;
            <span className="text-slate-600">Mumbai</span> ·{" "}
            <span className="text-slate-600">Delhi</span> ·{" "}
            <span className="text-slate-600">Surat</span> ·{" "}
            <span className="text-slate-600">Jaipur</span> ·{" "}
            <span className="text-slate-600">Ahmedabad</span> ·{" "}
            <span className="text-slate-600">Lucknow</span>
          </p>
        </div>
      </div>

      {/* ══════════════ PROBLEM ══════════════ */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Running a store on guesswork is expensive
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {problems.map((p) => (
              <div
                key={p.title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-5">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything you need to sell smarter
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              One platform that replaces spreadsheets, guesswork, and scattered buyer notes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 transition-all duration-200"
              >
                <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Up and running in 3 steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-gradient-to-r from-slate-200 to-slate-100" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200/60 group-hover:scale-105 transition-transform duration-200">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-violet-500 mb-2 tracking-widest">{s.n}</div>
                <h3 className="font-bold text-slate-900 mb-2 text-[15px]">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Store owners love Vastra AI
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRICING ══════════════ */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-sm mx-auto px-4 sm:px-6 text-center">
          <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple, honest pricing</h2>
          <p className="text-slate-500 mb-12 text-base">All features included. No hidden fees. Cancel anytime.</p>

          <div className="bg-white border-2 border-violet-600 rounded-3xl p-8 shadow-xl shadow-violet-100 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                Most Popular
              </span>
            </div>

            <div className="text-slate-500 text-sm font-medium mb-2">All Features Included</div>
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="text-5xl font-black text-slate-900 tracking-tight">₹1,000</span>
              <span className="text-slate-400 mb-2 text-sm">/month</span>
            </div>
            <p className="text-slate-400 text-sm mb-8">Cancel anytime</p>

            <ul className="space-y-3 mb-8 text-left">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3.5 rounded-xl text-base transition-colors shadow-md"
            >
              Start Now <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-3 text-xs text-slate-400">No credit card required for trial</p>
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="py-24 bg-gradient-to-br from-violet-700 via-violet-600 to-violet-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
            Stop guessing.<br />Start selling smarter.
          </h2>
          <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto">
            Join store owners across India who use Vastra AI to buy right, sell faster, and grow without the guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 hover:bg-violet-50 font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-base border border-white/30 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Shirt className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Vastra AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/login"     className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link href="/register"  className="hover:text-slate-300 transition-colors">Sign Up</Link>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Demo</Link>
          </div>
          <p className="text-slate-600 text-sm">Built for Indian store owners</p>
        </div>
      </footer>
    </div>
  );
}
