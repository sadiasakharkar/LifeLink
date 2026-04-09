import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useSocket } from "../hooks/useSocket.js";
import { IconAllocation, IconCheck, IconClipboard, IconClock, IconDonor } from "../components/icons.jsx";
import { Badge, SectionHeading, StatCard, Surface } from "../components/ui.jsx";

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

  useSocket({
    "allocation:created": () => {
      loadDashboard();
      showToast({ title: "Allocation updated", description: "Dashboard refreshed with the latest allocation state.", tone: "info" });
    },
    "donor:created": () => loadDashboard(),
  });

  const statIcons = [<IconDonor />, <IconClipboard />, <IconAllocation />, <IconCheck />];

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={user?.role}
        title="Dashboard"
        subtitle="Role-aware operational overview for donor intake, pending approvals, active alerts, and recent allocation decisions."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {dashboard.stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={loading ? "..." : stat.value}
            detail={stat.trend}
            accent={index === 2 ? "text-amber-600" : index === 3 ? "text-emerald-600" : "text-slate-500"}
            icon={statIcons[index] ?? <IconClock />}
          />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <Surface className="p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Recent Allocations</h3>
              <p className="mt-1 text-sm text-slate-400">Pending, approved, and recently reviewed allocation decisions</p>
            </div>
            <Link to="/app/allocation" className="text-sm font-semibold text-brand-700">
              View All
            </Link>
          </div>
          <div className="space-y-4 px-6 py-5">
            {dashboard.recentAllocations.length > 0 ? (
              dashboard.recentAllocations.map((allocation) => (
                <div key={allocation.id} className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {allocation.donorSnapshot?.organType} donor for {allocation.recipientSnapshot?.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {allocation.donorSnapshot?.bloodGroup} to {allocation.recipientSnapshot?.bloodGroup} · score {allocation.score}
                      </p>
                    </div>
                    <Badge tone={allocation.status === "APPROVED" ? "success" : allocation.status === "REJECTED" ? "danger" : "warning"}>
                      {allocation.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No allocations available yet.</p>
            )}
          </div>
        </Surface>

        <Surface>
          <h3 className="text-xl font-semibold text-slate-900">Live Alerts</h3>
          <div className="mt-5 space-y-4">
            {(dashboard.alerts.length ? dashboard.alerts : [
              { id: "default-1", title: "Approval queue active", detail: "Pending donor matches need clinical review." },
              { id: "default-2", title: "Transport updates simulated", detail: "Fleet status remains available for review." },
            ]).map((alert, index) => (
              <div key={alert.id} className={`rounded-[24px] border-l-[3px] p-4 ${index === 0 ? "border-brand-600 bg-blue-50/60" : "border-emerald-600 bg-emerald-50/60"}`}>
                <p className="font-semibold text-slate-900">{alert.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{alert.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/app/approvals" className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
              Open Approval Panel
            </Link>
            <button
              onClick={() => showToast({ title: "Notifications simulated", description: "Teams would be notified in a production messaging integration.", tone: "info" })}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Simulate Notification
            </button>
          </div>
        </Surface>
      </section>
    </div>
  );
};
