import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { IconBell, IconSearch } from "./icons.jsx";

const routeMeta = [
  { path: "/app/donor/", title: "Donor Detail", search: "Search donor timeline..." },
  { path: "/app/donor", title: "Donor Entry", search: "Quick search donor ID..." },
  { path: "/app/recipients/", title: "Recipient Detail", search: "Search recipient record..." },
  { path: "/app/recipients", title: "Recipient Directory", search: "Quick find patient..." },
  { path: "/app/allocation", title: "Allocation", search: "Search recipient or audit trail..." },
  { path: "/app/approvals", title: "Approval Panel", search: "Search pending approvals..." },
  { path: "/app/analytics", title: "Analytics Overview", search: "Search analytics..." },
  { path: "/app/transport", title: "Transport Command", search: "Track delivery or route..." },
  { path: "/app/audit-logs", title: "Audit Logs", search: "Search audit events..." },
  { path: "/app", title: "Dashboard", search: "Search patient, donor, or organ type..." },
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const AppTopbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const meta = routeMeta.find((item) => location.pathname.startsWith(item.path)) ?? routeMeta[routeMeta.length - 1];

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/90 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-brand-700">{meta.title}</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.26em] text-slate-400">Clinical sanctuary</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-3 text-slate-400 sm:min-w-[320px]">
          <IconSearch className="h-4 w-4" />
          <span className="text-sm">{meta.search}</span>
        </div>
        <button
          onClick={() => showToast({ title: "Notifications checked", description: "Live notification feeds are simulated in this MVP.", tone: "info" })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100"
        >
          <IconBell className="h-4.5 w-4.5" />
        </button>
        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-3 py-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700">{user?.name ?? "Coordinator"}</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{user?.role}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-emerald-500 text-xs font-bold text-white">
            {initials(user?.name ?? "LL")}
          </div>
        </div>
      </div>
    </div>
  );
};
