import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  "Dynamic cashback engine",
  "Merchant offer management",
  "Role-based admin controls",
  "Realtime transaction insights"
];

const testimonials = [
  {
    quote: "Smart Reward gave us measurable repeat purchases in 3 weeks.",
    name: "Ananya Sharma",
    role: "Growth Lead, DineKart"
  },
  {
    quote: "Feels like a premium fintech console with surprisingly simple workflows.",
    name: "Rahul Batra",
    role: "Product Manager, SwiftPay"
  }
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-midnight text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-midnight to-midnight" />

      <header className="relative z-10 mx-auto flex w-[94%] max-w-7xl items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500" />
          <span className="font-display text-xl font-semibold">Smart Reward System</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-xl border border-white/20 px-4 py-2 text-sm">Login</Link>
          <Link to="/signup" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-midnight">Signup</Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-[94%] max-w-7xl gap-8 pb-20 pt-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-4 inline-flex rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1 text-xs uppercase tracking-widest text-cyan-100">
            Fintech loyalty platform
          </p>
          <h1 className="font-display text-5xl leading-tight md:text-6xl">
            The startup-grade way to scale cashback rewards
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Build high-retention customer journeys with personalized offers, merchant-level controls, and real-time reward intelligence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-5 py-2.5 font-semibold text-midnight">Get Started</Link>
            <a href="#features" className="rounded-xl border border-white/20 px-5 py-2.5">How it works</a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-glass backdrop-blur-xl">
          <p className="text-sm text-slate-300">Live Control Panel</p>
          <div className="mt-4 grid gap-3">
            {[
              ["Total Spend", "INR 2.4L"],
              ["Cashback Issued", "INR 37K"],
              ["Active Offers", "12"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto w-[94%] max-w-7xl py-16">
        <h2 className="font-display text-3xl font-semibold">Features</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <motion.div key={f} whileHover={{ y: -3 }} className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
              {f}
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 mx-auto w-[94%] max-w-7xl py-16">
        <h2 className="font-display text-3xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Create offers", "Users transact", "Rewards auto-calculate"].map((step, i) => (
            <div key={step} className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <p className="text-xs text-cyan-100">Step 0{i + 1}</p>
              <p className="mt-2 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="relative z-10 mx-auto w-[94%] max-w-7xl py-16">
        <h2 className="font-display text-3xl font-semibold">Testimonials</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-slate-200">\"{t.quote}\"</p>
              <p className="mt-4 font-medium">{t.name}</p>
              <p className="text-sm text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
