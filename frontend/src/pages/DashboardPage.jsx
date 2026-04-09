import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { usePolling } from "../hooks/usePolling.js";
import { IconAllocation, IconCheck, IconClipboard, IconClock, IconDonor } from "../components/icons.jsx";
import { Badge, StatCard, Surface } from "../components/ui.jsx";

export const DashboardPage = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState({ stats: [], alerts: [], recentAllocations: [] });
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/dashboard", {}, token);
      setDashboard(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  usePolling(loadDashboard, 12000, Boolean(token));

  const statIcons = [<IconDonor />, <IconClipboard />, <IconAllocation />, <IconCheck />];
  const timeline = [
    ["UNOS Protocol Compliance Check", "System-wide audit completed. All current matches comply with regional allocation algorithms.", "14:20 PM"],
    ["St. Jude Medical Center Integration", "New facility node added to the sanctuary network. Bi-directional data sync established.", "13:45 PM"],
    ["Bio-Transport Mission #4492 Dispatched", "Emergency courier dispatched for heart allocation. Flight path optimized for minimal transit time.", "12:10 PM"],
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {dashboard.stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={loading ? "..." : stat.value}
            detail={stat.trend}
            accent={index === 2 ? "text-emerald-600" : index === 3 ? "text-rose-500" : "text-slate-500"}
            icon={statIcons[index] ?? <IconClock />}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr,0.65fr]">
        <Surface className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Recent Allocations</h3>
            </div>
            <Link to="/app/allocation" className="text-sm font-semibold text-brand-700">
              View All
            </Link>
          </div>
          <div className="px-6 py-5">
            {dashboard.recentAllocations.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-[1.1fr,1fr,0.9fr,1fr,40px] gap-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  <p>Organ Type</p>
                  <p>Recipient</p>
                  <p>Status</p>
                  <p>Viability Clock</p>
                  <p>Action</p>
                </div>
                {dashboard.recentAllocations.map((allocation, index) => (
                  <div key={allocation.id} className="grid grid-cols-[1.1fr,1fr,0.9fr,1fr,40px] items-center gap-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-brand-600" : index === 1 ? "bg-slate-400" : "bg-emerald-600"}`} />
                      <span className="font-semibold">{allocation.donorSnapshot?.organType} {allocation.donorSnapshot?.bloodGroup}+</span>
                    </div>
                    <p className="font-medium text-slate-700">{allocation.recipientSnapshot?.name}</p>
                    <Badge tone={allocation.status === "APPROVED" ? "success" : allocation.status === "REJECTED" ? "danger" : "info"}>
                      {allocation.status === "APPROVED" ? "IN TRANSIT" : allocation.status}
                    </Badge>
                    <p className="font-semibold text-rose-500">0{index + 1}:4{index + 1}:45</p>
                    <button className="text-slate-400">⋮</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No allocations available yet.</p>
            )}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <h3 className="text-xl font-semibold text-slate-900">Live Alerts</h3>
          </div>
          <div className="mt-5 space-y-4">
            {(dashboard.notifications?.length ? dashboard.notifications : dashboard.alerts.length ? dashboard.alerts : [
              { id: "default-1", title: "Approval queue active", detail: "Pending donor matches need clinical review." },
              { id: "default-2", title: "Transport updates simulated", detail: "Fleet status remains available for review." },
            ]).map((alert) => (
              <div key={alert.id} className={`rounded-[20px] border border-slate-100 border-l-[3px] p-4 ${alert.priority === "danger" ? "border-l-rose-500" : alert.priority === "success" ? "border-l-emerald-600" : "border-l-brand-600"}`}>
                <p className="font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{alert.detail}</p>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">2 mins ago</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast({ title: "Alerts acknowledged", description: "This demo clears the active notification stack visually.", tone: "success" })}
            className="mt-5 w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Acknowledge All
          </button>
        </Surface>
      </section>

      <Surface>
        <h3 className="text-2xl font-semibold text-slate-900">System Activity Timeline</h3>
        <p className="mt-1 text-sm text-slate-400">Real-time audit trail of all clinical sanctuary operations</p>
        <div className="mt-6 space-y-6">
          {timeline.map(([title, detail, time], index) => (
            <div key={title} className="grid grid-cols-[24px,1fr,70px] gap-4">
              <div className="flex flex-col items-center">
                <span className={`mt-1 h-3 w-3 rounded-full ${index === 2 ? "bg-emerald-500" : "bg-brand-600"}`} />
                {index !== timeline.length - 1 ? <span className="mt-2 h-full w-px bg-slate-200" /> : null}
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
                <div className="mt-3 flex gap-2">
                  <Badge>{index === 0 ? "System" : index === 1 ? "Network" : "Logistics"}</Badge>
                  <Badge tone="info">{index === 0 ? "Audit" : index === 1 ? "Cloud-Sync" : "Critical"}</Badge>
                </div>
              </div>
              <p className="pt-1 text-right text-xs font-medium text-slate-400">{time}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
};
