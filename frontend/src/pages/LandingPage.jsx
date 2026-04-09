import { Link } from "react-router-dom";
import { roles } from "../utils/constants.js";
import { IconCheck, IconChevron, IconShield } from "../components/icons.jsx";
import { Badge, PrimaryButton, SecondaryButton, Surface } from "../components/ui.jsx";

const features = [
  {
    title: "Real-time matching",
    text: "Our priority algorithm processes new donor cases in seconds and updates every portal at once.",
  },
  {
    title: "Fair allocation",
    text: "Blood compatibility, urgency, and waiting time are applied in a clear explainable order.",
  },
  {
    title: "AI-enhanced insights",
    text: "Operational signals surface transport risks, active alerts, and allocation anomalies.",
  },
];

const workflow = [
  "Donor Entry",
  "Smart Matching",
  "Instant Allocation",
];

export const LandingPage = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.1),transparent_30%),linear-gradient(180deg,#f9fbff_0%,#f4f7fc_100%)]">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 text-lg font-bold text-white">+</div>
        <div>
          <p className="text-xl font-semibold text-brand-700">LifeLink</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Clinical sanctuary</p>
        </div>
      </div>
      <nav className="hidden items-center gap-10 text-sm text-slate-500 md:flex">
        <span>Home</span>
        <span>Donors</span>
        <span>Recipients</span>
        <span>Support</span>
      </nav>
      <div className="flex items-center gap-3">
        <Link to="/app">
          <SecondaryButton className="rounded-full px-5 py-2.5">Open Demo</SecondaryButton>
        </Link>
        <Link to="/app">
          <PrimaryButton className="rounded-full px-5 py-2.5">Launch Dashboard</PrimaryButton>
        </Link>
      </div>
    </header>

    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1fr,1.02fr] lg:items-center">
      <div>
        <Badge tone="info">Clinical command platform</Badge>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-900 sm:text-6xl">
          LifeLink
          <span className="block text-brand-700">Real-Time Organ Allocation System</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
          Saving lives through intelligent, real-time organ matching. Our sanctuary data stream gives surgical teams faster, fairer support across every critical decision.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/app">
            <PrimaryButton className="rounded-full px-6">Open Demo Workspace</PrimaryButton>
          </Link>
          <Link to="/login">
            <button className="rounded-full px-2 py-3 text-sm font-semibold text-brand-700">Choose Role</button>
          </Link>
        </div>
      </div>

      <Surface className="overflow-hidden bg-[#10222d] p-0 text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-lg font-semibold">LifeLink OS</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/50">Match overview</p>
          </div>
          <Badge tone="success">Live</Badge>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[24px] bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Current donor registration</p>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3"><span>Organ</span><span>Kidney</span></div>
              <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3"><span>Blood Group</span><span>O</span></div>
              <div className="flex justify-between rounded-2xl bg-white/5 px-4 py-3"><span>Location</span><span>Central Surgical Hub</span></div>
            </div>
          </div>
          <div className="rounded-[24px] bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Eligible recipients</p>
            <div className="mt-4 space-y-3">
              {[
                ["Arjun Rao", "Match 98%"],
                ["Neha Kapoor", "Match 96%"],
                ["ICU Route", "Transport ready"],
              ].map(([label, detail]) => (
                <div key={label} className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="font-medium">{label}</p>
                  <p className="mt-1 text-xs text-white/50">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-6 mb-6 flex items-center gap-3 rounded-[22px] bg-white px-4 py-3 text-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <IconCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Match confirmed</p>
            <p className="text-xs text-slate-400">Allocation reason available instantly</p>
          </div>
        </div>
      </Surface>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">The Clinical Advantage</p>
        <h2 className="mt-4 text-4xl font-semibold text-slate-900">Precision designed for high-stakes teams</h2>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr,1fr,1.1fr]">
        {features.map((feature, index) => (
          <Surface key={feature.title} className={index === 2 ? "lg:row-span-2" : ""}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-brand-700">
              <IconShield className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">{feature.text}</p>
            {index === 2 ? (
              <div className="mt-8 rounded-[24px] bg-[linear-gradient(180deg,#10222d_0%,#173247_100%)] p-6 text-white">
                <div className="grid h-48 place-items-center rounded-[20px] border border-white/10 bg-[radial-gradient(circle,rgba(45,212,191,0.18),transparent_55%)]">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Live dashboard</p>
                    <p className="mt-3 text-4xl font-semibold">94%</p>
                    <p className="mt-2 text-sm text-white/60">Operational success rate</p>
                  </div>
                </div>
              </div>
            ) : (
              <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                Learn More
                <IconChevron className="h-4 w-4" />
              </button>
            )}
          </Surface>
        ))}
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
      <div>
        <h2 className="text-4xl font-semibold text-slate-900">Efficiency at Every Step</h2>
        <div className="mt-8 space-y-6">
          {workflow.map((step, index) => (
            <div key={step} className="flex gap-4">
              <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {index + 1}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{step}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {index === 0 && "Donor details enter the network and generate an immediate matching review."}
                  {index === 1 && "Priority scoring checks organ compatibility, urgency, and waiting time in order."}
                  {index === 2 && "The selected recipient is assigned once and removed from the queue atomically."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Surface className="bg-[linear-gradient(180deg,#0f2332_0%,#123a4f_100%)] text-white">
        <div className="grid h-[360px] place-items-center rounded-[24px] border border-white/10 bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_42%)]">
          <div className="flex h-56 w-56 items-center justify-center rounded-full border border-cyan-200/20 bg-[radial-gradient(circle,rgba(45,212,191,0.2),transparent_55%)]">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border border-cyan-100/25">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">Clinical workflow</p>
                <p className="mt-3 text-lg font-semibold">LifeLink OS</p>
              </div>
            </div>
          </div>
        </div>
      </Surface>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-4xl font-semibold text-slate-900">Choose Your Portal</h2>
        <p className="mt-3 text-sm text-slate-500">Open the frontend demo as an admin, doctor, or transport coordinator.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {roles.map((role) => (
          <Surface key={role}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand-700">
              <IconShield className="h-5 w-5" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-slate-900">{role}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {role === "Hospital Admin" && "Manage donor intake, allocations, and hospital-level oversight."}
              {role === "Doctor" && "Review recipients, match evidence, and clinical allocation details."}
              {role === "Transport Team" && "Track assigned deliveries, routes, and mission-critical ETAs."}
            </p>
            <Link to="/app" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
              Access Portal
              <IconChevron className="h-4 w-4" />
            </Link>
          </Surface>
        ))}
      </div>
    </section>

    <footer className="border-t border-slate-200/80 bg-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-[1.5fr,1fr,1fr]">
        <div>
          <p className="text-xl font-semibold text-brand-700">LifeLink</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
            LifeLink is a clean, secure dashboard for the organ transplant community, designed for fast decisions under pressure.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Platform</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p>Match Engine</p>
            <p>Donor Registry</p>
            <p>Analytics</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Support</p>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <p>Help Center</p>
            <p>Clinical Direct Line</p>
            <p>Legal & Security</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
