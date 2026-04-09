import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, SectionHeading, StatCard, Surface } from "../components/ui.jsx";
import { IconAllocation, IconAnalytics, IconCheck, IconClock } from "../components/icons.jsx";

const areaData = [
  { month: "Jan", volume: 120 },
  { month: "Feb", volume: 210 },
  { month: "Mar", volume: 275 },
  { month: "Apr", volume: 310 },
  { month: "May", volume: 295 },
  { month: "Jun", volume: 342 },
];

const pieData = [
  { name: "Critical", value: 15, color: "#dc2626" },
  { name: "Urgent", value: 45, color: "#1d4ed8" },
  { name: "Stable", value: 40, color: "#15803d" },
];

const barData = [
  { organ: "Kidney", volume: 92 },
  { organ: "Liver", volume: 76 },
  { organ: "Heart", volume: 54 },
  { organ: "Lung", volume: 39 },
  { organ: "Pancreas", volume: 21 },
  { organ: "Tissue", volume: 61 },
];

export const AnalyticsPage = () => {
  const { showToast } = useToast();

  return (
    <div className="space-y-6">
    <SectionHeading
      eyebrow="Real-time performance metrics"
      title="Analytics Overview"
      subtitle="Track transplant throughput, matching efficiency, organ utilization, urgency distribution, and operational anomalies."
    />

    <section className="grid gap-4 xl:grid-cols-4">
      <StatCard label="Total Transplants" value="1.2k" detail="+12% vs LY" accent="text-emerald-600" icon={<IconAnalytics />} />
      <StatCard label="Avg Matching Time" value="4.5m" detail="-0.8m improved" accent="text-brand-700" icon={<IconClock />} />
      <StatCard label="Success Rate" value="94%" detail="Target: 92%" accent="text-emerald-600" icon={<IconCheck />} />
      <StatCard label="Organs Utilized" value="88%" detail="Low waste" accent="text-rose-500" icon={<IconAllocation />} />
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.3fr,0.7fr]">
      <Surface>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Allocation Over Time</h3>
            <p className="mt-1 text-sm text-slate-400">Monthly volume tracking across all facility networks</p>
          </div>
          <div className="flex gap-2">
            <Badge tone="info">6 months</Badge>
            <Badge>1 year</Badge>
          </div>
        </div>
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} fill="url(#volumeFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Surface>

      <Surface>
        <h3 className="text-2xl font-semibold text-slate-900">Urgency Tiers</h3>
        <p className="mt-1 text-sm text-slate-400">Distribution by medical urgency classification</p>
        <div className="mt-6 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={65} outerRadius={96} paddingAngle={4}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </Surface>
    </section>

    <Surface>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Organ Distribution Volume</h3>
          <p className="mt-1 text-sm text-slate-400">Comparative analysis of organ types processed</p>
        </div>
        <button
          onClick={() => showToast({ title: "Analytics export simulated", description: "Production export would generate a secure report file.", tone: "info" })}
          className="text-sm font-semibold text-brand-700"
        >
          Export Data
        </button>
      </div>
      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid vertical={false} stroke="#edf2f7" />
            <XAxis dataKey="organ" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="volume" radius={[12, 12, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={entry.organ} fill={["#1d4ed8", "#3b82f6", "#6694ea", "#9bbaf1", "#c8daf8", "#e5e7eb"][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Surface>

    <section className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
      <Surface>
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Recent Clinical Anomalies</p>
        <div className="mt-5 space-y-4">
          {[
            ["Waitlist surge detected", "Liver waitlist in Region 4 increased by 14%", "2h ago", "danger"],
            ["Efficiency threshold met", "Average match time reduced for 3 consecutive weeks", "Yesterday", "info"],
          ].map(([title, detail, time, tone]) => (
            <div key={title} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{title}</p>
                <Badge tone={tone}>{time}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="bg-brand-700 text-white">
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">AI Matching Insights</p>
        <h3 className="mt-5 text-3xl font-semibold">Predictive models suggest a 15% increase in donor availability next quarter.</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
          Northeast transport corridors are performing ahead of baseline while multi-center coordination is reducing average wait time for urgent cases.
        </p>
        <button
          onClick={() => showToast({ title: "Optimization simulated", description: "Predictive tuning would trigger a backend optimization job in production.", tone: "success" })}
          className="mt-8 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-700"
        >
          Optimize Allocation
        </button>
      </Surface>
    </section>
    </div>
  );
};
