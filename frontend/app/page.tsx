import Link from "next/link";

/* ─── Icon components (inline SVG — no extra package needed) ─── */
function IconUpload() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ─── Data ────────────────────────────────────────────────────── */
const problems = [
  {
    icon: "🎲",
    title: "Buying on Gut Feel",
    desc: "You reorder what feels popular — but gut feel leads to wrong stock, wrong quantities, and money locked up in unsold pieces.",
  },
  {
    icon: "📦",
    title: "Dead Stock Piling Up",
    desc: "Designs that don't move sit in your store for months. Every unsold piece is cash that can't be reinvested.",
  },
  {
    icon: "🤷",
    title: "No Idea Who Wants What",
    desc: "You have buyers in multiple cities but no clear picture of which customer wants which design — so you blast everyone and convert few.",
  },
];

const features = [
  {
    icon: <IconChart />,
    color: "bg-purple-100 text-purple-600",
    title: "Design Library",
    desc: "Upload and organise every design you carry. Vastra AI auto-detects dominant colours, fabric, and style — and ties each design to your sales history.",
  },
  {
    icon: <IconUsers />,
    color: "bg-blue-100 text-blue-600",
    title: "Smart Customer Matching",
    desc: "Build buyer profiles once. Vastra AI instantly tells you which customers are most likely to buy each design — by preference, budget, and city.",
  },
  {
    icon: <IconMap />,
    color: "bg-orange-100 text-orange-600",
    title: "Lead Discovery",
    desc: "Search for ethnic wear buyers and retailers in any Indian city — Mumbai, Delhi, Surat, Jaipur. Get names, phones, and Maps links in one click.",
  },
];

const steps = [
  {
    n: "1",
    title: "Upload Your Sales Data",
    desc: "Drop in a CSV or Excel file of your past sales. Our engine processes it in seconds — no formatting rules, no setup.",
  },
  {
    n: "2",
    title: "Add Your Buyers",
    desc: "Build a quick profile for each customer: their city, budget, preferred styles, and favourite colours. Takes 2 minutes per buyer.",
  },
  {
    n: "3",
    title: "Get Instant Selling Suggestions",
    desc: "See exactly which designs to restock, which buyers to call, and which cities have untapped demand — before you spend a rupee.",
  },
];

const included = [
  "Unlimited designs",
  "Smart customer matching",
  "Lead discovery (any Indian city)",
  "30-day demand forecast",
  "Festival opportunity alerts",
  "Dead stock detection",
];

/* ─── Page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ══════════════════ NAV ══════════════════ */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              V
            </div>
            <span className="font-bold text-gray-900 text-base">Vastra AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              Get Started <IconArrow />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-white to-white">
        {/* decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold tracking-wide uppercase">
            Built for Indian Ethnic Wear Retailers
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Know What Designs Will Sell{" "}
            <span className="bg-gradient-to-r from-brand-500 to-orange-500 bg-clip-text text-transparent">
              Before You Buy Stock
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your sales data and designs. Instantly see what to restock, who to sell
            to, and what trends are rising — so every purchase pays off.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl"
            >
              Get Started — Free Trial <IconArrow />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base border border-gray-200 transition-all"
            >
              Try Demo
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-400">No credit card required · Works with any CSV or Excel file</p>

          {/* Mock dashboard preview */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-md h-5 mx-4 text-xs text-gray-400 flex items-center px-2">
                  vastra-ai.com/dashboard
                </div>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-br from-gray-50 to-white">
                {[
                  { label: "Units Sold", value: "4,280", icon: "📦", color: "text-purple-600" },
                  { label: "Revenue", value: "₹8.4L", icon: "💰", color: "text-green-600" },
                  { label: "Designs", value: "128", icon: "🎨", color: "text-orange-500" },
                  { label: "Period", value: "90 days", icon: "📅", color: "text-blue-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl p-4 text-left">
                  <p className="text-xs font-semibold text-gray-500 mb-2">💡 Top Insight</p>
                  <p className="text-sm font-medium text-gray-800">Restock Banarasi Silk Saree — it sold 42 units last month and stock is running low.</p>
                </div>
              </div>
            </div>
            {/* glow under the card */}
            <div className="absolute -bottom-6 inset-x-8 h-12 bg-purple-300/20 blur-2xl rounded-full" />
          </div>
        </div>
      </section>

      {/* ══════════════════ PROBLEM ══════════════════ */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Running a store on guesswork is expensive
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ SOLUTION ══════════════════ */}
      <section className="py-20 bg-gradient-to-b from-purple-50/40 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">The Solution</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
            Data-driven decisions in minutes, not months
          </h2>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
            Vastra AI turns your existing sales file into a complete intelligence system —
            telling you exactly what to buy, who to sell to, and where to find new buyers.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { e: "📊", t: "Upload designs", d: "Your catalogue, organised and searchable in seconds." },
              { e: "🎯", t: "Track buyers", d: "Build profiles for each customer with preferences, budget, and city." },
              { e: "✅", t: "Know exactly who to call", d: "AI matches every design to the buyers most likely to purchase it." },
            ].map((item) => (
              <div key={item.t} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.e}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{item.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to sell smarter
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group">
                <div className={`inline-flex p-3 rounded-2xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* extra feature row */}
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {[
              { e: "🔮", t: "30-Day Demand Forecast", d: "AI-powered predictions so you order the right quantity before the season hits." },
              { e: "🪔", t: "Festival Opportunity Alerts", d: "Never miss Diwali, Navratri, or Eid. Get stock and colour suggestions weeks in advance." },
            ].map((f) => (
              <div key={f.t} className="bg-gradient-to-br from-purple-50 to-orange-50 border border-purple-100 rounded-2xl p-6 flex gap-4">
                <span className="text-3xl">{f.e}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.t}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Up and running in 3 steps
            </h2>
          </div>
          <div className="relative">
            {/* connector line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-orange-300" />
            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.n} className="relative text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-200">
                    {s.n}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PRICING ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
            Simple, honest pricing
          </h2>

          <div className="bg-white border-2 border-brand-500 rounded-3xl p-8 shadow-xl shadow-brand-100 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <div className="mb-2 text-gray-500 text-sm font-medium">All Features Included</div>
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="text-5xl font-extrabold text-gray-900">₹1,000</span>
              <span className="text-gray-400 mb-2">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">Cancel anytime</p>

            <ul className="space-y-3 mb-8 text-left">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <IconCheck />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-4 rounded-2xl text-base transition-all shadow-md hover:shadow-lg"
            >
              Start Now <IconArrow />
            </Link>
            <p className="mt-3 text-xs text-gray-400">No credit card required for trial</p>
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <section className="py-24 bg-gradient-to-br from-brand-600 via-brand-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Stop guessing.<br />Start selling smarter.
          </h2>
          <p className="text-purple-100 text-lg mb-10 max-w-xl mx-auto">
            Join store owners across India who use Vastra AI to buy right, sell faster, and grow without the guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-purple-50 font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg"
            >
              Get Started Free <IconArrow />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-base border border-white/30 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="bg-gray-950 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            <span className="text-gray-400 text-sm">Vastra AI · Ethnic Wear Sales Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/login" className="hover:text-gray-300 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-gray-300 transition-colors">Sign Up</Link>
            <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Demo</Link>
          </div>
          <p className="text-gray-600 text-sm">Built for Indian store owners 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
