import Link from "next/link";
import {
  ArrowRight, BarChart3, Users, MapPin, TrendingUp, Sparkles,
  AlertTriangle, Package, CheckCircle2, Shirt, Star,
  ShoppingBag, Target, Zap, Lock, Crown, Factory, Truck,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */

const audiences = [
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "bg-violet-100 text-violet-600 border-violet-200",
    type: "Retailers",
    desc: "Know which designs to restock before you run out. Get AI suggestions on what to promote based on your actual sales history.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    color: "bg-amber-100 text-amber-600 border-amber-200",
    type: "Wholesalers",
    desc: "Identify which markets are buying what. Match your catalogue to buyer preferences across cities before you dispatch a single piece.",
  },
  {
    icon: <Factory className="w-6 h-6" />,
    color: "bg-emerald-100 text-emerald-600 border-emerald-200",
    type: "Manufacturers",
    desc: "See demand trends 30 days ahead. Know what fabrics, colours, and styles to produce next season — backed by real retail data.",
  },
];

const features = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    color: "bg-violet-100 text-violet-600",
    title: "AI Sales Insights",
    desc: "Upload any CSV or Excel file. Get instant breakdown of top designs, dead stock alerts, and prioritised restock recommendations.",
    pro: true,
  },
  {
    icon: <Users className="w-5 h-5" />,
    color: "bg-sky-100 text-sky-600",
    title: "Smart Customer Matching",
    desc: "Build buyer profiles once. AI tells you which customers are most likely to buy each design — by preference, budget, and city.",
    pro: true,
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    color: "bg-rose-100 text-rose-600",
    title: "Lead Discovery",
    desc: "Find ethnic wear buyers and retailers in any Indian city — Mumbai, Delhi, Surat, Jaipur. Get names, phones, and Maps links.",
    pro: true,
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-600",
    title: "30-Day Demand Forecast",
    desc: "AI-powered predictions so you order the right quantity before the season peaks — never over-buy or under-stock again.",
    pro: true,
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-600",
    title: "Festival Opportunity Alerts",
    desc: "Never miss Diwali, Navratri, or Eid. Get stock and colour suggestions weeks in advance so you're always prepared.",
    pro: true,
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "bg-red-100 text-red-600",
    title: "Dead Stock Detection",
    desc: "Identify slow-moving designs before they become a problem. Get liquidation suggestions and pricing recommendations.",
    pro: true,
  },
];

const steps = [
  { n: "01", title: "Upload Your Sales Data",     desc: "Drop in a CSV or Excel file of your past sales. Our engine processes it in seconds — no formatting rules.", icon: <Package className="w-6 h-6" /> },
  { n: "02", title: "Add Your Buyers & Designs",  desc: "Build buyer profiles and upload your catalogue. Takes a few minutes. The AI does the heavy lifting.", icon: <Users className="w-6 h-6" /> },
  { n: "03", title: "Get Instant Intelligence",   desc: "See exactly what to buy, who to sell to, and where demand is heading — before you spend a rupee.", icon: <Zap className="w-6 h-6" /> },
];

const testimonials = [
  {
    quote: "As a wholesaler supplying 40+ retailers, I was always over-stocking some designs and under-stocking others. Vastra AI fixed that. My dead stock is down 60%.",
    name: "Rajesh Patel",
    role: "Wholesaler, Surat Textile House",
    initials: "RP",
  },
  {
    quote: "The customer matching feature is incredible. I WhatsApp the right buyers when a new design arrives — my conversion rate went up 3x in the first month.",
    name: "Priya Mehta",
    role: "Retailer, Mumbai Ethnic Boutique",
    initials: "PM",
  },
  {
    quote: "We manufacture over 200 designs a season. The 30-day forecast tells us exactly what to produce — we've cut production waste by nearly half.",
    name: "Anita Singh",
    role: "Manufacturer, Jaipur",
    initials: "AS",
  },
];

const freeFeatures = [
  "Upload unlimited sales files",
  "Basic summary & trend charts",
  "Design library (up to 10 designs)",
  "Sales period overview",
];

const proFeatures = [
  "Everything in Free",
  "AI-powered insights & recommendations",
  "30-day demand forecast",
  "Festival opportunity alerts",
  "Smart customer matching (AI)",
  "Lead discovery — any Indian city",
  "Trends dashboard",
  "Dead stock detection & alerts",
  "Unlimited designs & customers",
  "Priority support",
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
            <a href="#who"      className="hover:text-slate-900 transition-colors">Who it&apos;s for</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing"  className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex text-sm text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              Start Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden pt-20 pb-8 sm:pt-28 sm:pb-16 bg-white">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#6d28d9 1px, transparent 1px), linear-gradient(90deg, #6d28d9 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-violet-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            For Retailers · Wholesalers · Manufacturers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
            Data-driven intelligence
            <br className="hidden sm:block" />
            for Indian{" "}
            <span className="bg-gradient-to-r from-violet-600 via-violet-500 to-amber-500 bg-clip-text text-transparent">
              ethnic wear businesses
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your sales data. Know what to restock, discover city-wise leads of buyers ready
            to purchase, and see where demand is heading — built for Indian ethnic wear businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-violet-200">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl text-base border border-slate-200 hover:border-slate-300 transition-colors">
              Try Demo
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-400">Free plan available · No credit card required</p>

          {/* Product mockup */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-white">
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
              <div className="flex h-52 sm:h-72">
                {/* Sidebar */}
                <div className="w-36 sm:w-44 bg-[#16082a] flex flex-col p-3 shrink-0 border-r border-white/5">
                  <div className="flex items-center gap-2 px-2 py-2 mb-3">
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-amber-500 shrink-0" />
                    <span className="text-white text-[11px] font-bold">Vastra AI</span>
                  </div>
                  <p className="text-white/25 text-[9px] font-semibold uppercase tracking-widest px-2 mb-1.5">Sales</p>
                  {[
                    { label: "Upload Data",  active: false, pro: false },
                    { label: "Insights",     active: true,  pro: false },
                    { label: "Forecast",     active: false, pro: true  },
                    { label: "Festivals",    active: false, pro: true  },
                  ].map((item) => (
                    <div key={item.label} className={`px-2.5 py-1.5 rounded-md text-[10px] sm:text-[11px] mb-0.5 font-medium flex items-center justify-between ${item.active ? "bg-violet-600 text-white" : "text-white/40"}`}>
                      {item.label}
                      {item.pro && !item.active && <Lock className="w-2.5 h-2.5 text-white/20" />}
                    </div>
                  ))}
                  <p className="text-white/25 text-[9px] font-semibold uppercase tracking-widest px-2 mb-1.5 mt-3">Catalog</p>
                  {[
                    { label: "Designs",   pro: false },
                    { label: "Customers", pro: true  },
                  ].map((item) => (
                    <div key={item.label} className="px-2.5 py-1.5 rounded-md text-[10px] sm:text-[11px] text-white/40 mb-0.5 flex items-center justify-between">
                      {item.label}
                      {item.pro && <Lock className="w-2.5 h-2.5 text-white/20" />}
                    </div>
                  ))}
                </div>
                {/* Content */}
                <div className="flex-1 bg-slate-50 p-3 sm:p-4 overflow-hidden">
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
                  <div className="bg-white rounded-lg border border-slate-200 p-2.5 sm:p-3 mb-2.5">
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium mb-2">Sales Trend</div>
                    <svg viewBox="0 0 200 36" className="w-full h-8 sm:h-9" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polyline points="0,32 25,26 55,20 80,23 110,13 140,9 170,11 200,6" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polygon points="0,32 25,26 55,20 80,23 110,13 140,9 170,11 200,6 200,36 0,36" fill="url(#heroChartGrad)" />
                    </svg>
                  </div>
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-2 sm:p-2.5 flex items-start gap-2">
                    <div className="w-3 h-3 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-violet-800">
                      <span className="font-semibold">Restock Banarasi Silk Saree</span> — 42 units sold last month, stock running low
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 inset-x-12 h-10 bg-violet-300/20 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ══════════════ CITIES STRIP ══════════════ */}
      <div className="border-y border-slate-100 bg-slate-50/80 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-slate-400 font-medium">
            Trusted by businesses in &nbsp;
            {["Mumbai", "Delhi", "Surat", "Jaipur", "Ahmedabad", "Lucknow", "Kolkata"].map((c, i, arr) => (
              <span key={c}><span className="text-slate-600">{c}</span>{i < arr.length - 1 ? " · " : ""}</span>
            ))}
          </p>
        </div>
      </div>

      {/* ══════════════ WHO IT'S FOR ══════════════ */}
      <section id="who" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Who It&apos;s For</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Built for every part of the ethnic wear supply chain
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              One platform, three business types — all getting the same data-driven edge.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {audiences.map((a) => (
              <div key={a.type} className={`p-6 rounded-2xl border-2 ${a.color} hover:shadow-md transition-all duration-200 bg-white`}>
                <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-5 ${a.color}`}>
                  {a.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{a.type}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PROBLEM ══════════════ */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Running on guesswork costs real money
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Whether you make it, move it, or sell it — without data, you&apos;re always one bad season away from a crisis.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: <ShoppingBag className="w-6 h-6" />, title: "Buying on gut feel",        desc: "Reordering what 'feels popular' leads to wrong stock, wrong quantities, and capital locked in unsold pieces." },
              { icon: <Package className="w-6 h-6" />,     title: "Dead stock piling up",       desc: "Designs that don't move cost you twice — once when you buy them, again when you mark them down to clear." },
              { icon: <Target className="w-6 h-6" />,      title: "No visibility on demand",    desc: "You have buyers across cities but no picture of which customer wants what — so you blast everyone and convert few." },
            ].map((p) => (
              <div key={p.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-5">{p.icon}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">The complete intelligence toolkit</h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              Every feature is built specifically for the Indian ethnic wear market — not adapted from generic tools.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-200 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 transition-all duration-200 relative">
                {f.pro && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold uppercase tracking-wide">
                    <Crown className="w-2.5 h-2.5" /> Pro
                  </span>
                )}
                <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-4 ${f.color}`}>{f.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Up and running in 3 steps</h2>
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
              Retailers, wholesalers &amp; manufacturers trust Vastra AI
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{t.initials}</div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-violet-600 text-xs font-semibold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Start free. Upgrade when you&apos;re ready.</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              The free plan gives you real value from day one. Upgrade to Pro for the full intelligence layer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Free plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-500 mb-1">Free Plan</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-slate-400 mb-1.5 text-sm">/month forever</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">No credit card needed</p>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {item}
                  </li>
                ))}
                <li className="pt-2 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-400">
                  <Lock className="w-4 h-4 text-slate-300 shrink-0" /> AI insights &amp; forecast
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Lock className="w-4 h-4 text-slate-300 shrink-0" /> Customer matching &amp; lead discovery
                </li>
              </ul>
              <Link href="/register" className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Pro plan */}
            <div className="bg-violet-600 rounded-2xl p-8 shadow-xl shadow-violet-200 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-amber-900 text-xs font-black px-4 py-1 rounded-full shadow-sm uppercase tracking-wide">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <p className="text-sm font-semibold text-violet-200 mb-1">Pro Plan</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">₹999</span>
                  <span className="text-violet-300 mb-1.5 text-sm">/month</span>
                </div>
                <p className="text-violet-300 text-sm mt-1">Cancel anytime</p>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle2 className="w-4 h-4 text-violet-300 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/register?plan=pro" className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md">
                <Crown className="w-4 h-4" /> Upgrade to Pro
              </Link>
            </div>

          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            All plans include data security, regular updates, and access to new features as they ship.
          </p>
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
            Stop guessing.<br />Let data drive your business.
          </h2>
          <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto">
            Join retailers, wholesalers, and manufacturers across India who use Vastra AI to make smarter decisions every season.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 hover:bg-violet-50 font-bold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg">
              Start Free — No Card Needed <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-base border border-white/30 transition-colors">
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
            <Link href="/register"  className="hover:text-slate-300 transition-colors">Sign Up Free</Link>
            <a href="#pricing"      className="hover:text-slate-300 transition-colors">Pricing</a>
            <Link href="/dashboard" className="hover:text-slate-300 transition-colors">Demo</Link>
          </div>
          <p className="text-slate-600 text-sm">Built for Indian ethnic wear businesses</p>
        </div>
      </footer>
    </div>
  );
}
