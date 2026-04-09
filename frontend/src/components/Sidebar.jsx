import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  IconAllocation,
  IconAnalytics,
  IconClipboard,
  IconDashboard,
  IconDonor,
  IconFile,
  IconRecipients,
  IconSettings,
  IconSupport,
  IconTransport,
} from "./icons.jsx";

const navigation = [
  { to: "/app", label: "Dashboard", icon: IconDashboard, roles: ["Hospital Admin", "Doctor", "Transport Team"] },
  { to: "/app/donor", label: "Donor Entry", icon: IconDonor, roles: ["Hospital Admin"] },
  { to: "/app/recipients", label: "Recipients", icon: IconRecipients, roles: ["Hospital Admin", "Doctor"] },
  { to: "/app/allocation", label: "Allocation", icon: IconAllocation, roles: ["Hospital Admin", "Doctor", "Transport Team"] },
  { to: "/app/approvals", label: "Approvals", icon: IconClipboard, roles: ["Hospital Admin", "Doctor"] },
  { to: "/app/analytics", label: "Analytics", icon: IconAnalytics, roles: ["Hospital Admin"] },
  { to: "/app/transport", label: "Transport", icon: IconTransport, roles: ["Transport Team", "Hospital Admin"] },
  { to: "/app/audit-logs", label: "Audit Logs", icon: IconFile, roles: ["Hospital Admin"] },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const links = navigation.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="flex w-full flex-col rounded-none border-r border-slate-200 bg-[linear-gradient(180deg,#fbfcff_0%,#f4f7fb_100%)] px-5 py-6 lg:min-h-screen lg:max-w-[220px]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 text-lg font-bold text-white shadow-[0_16px_34px_rgba(29,78,216,0.28)]">
          +
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-900">LifeLink</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Clinical Sanctuary</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/app"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-brand-700 shadow-[inset_3px_0_0_#2563eb]"
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-8">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500">
          <IconSettings className="h-4.5 w-4.5" />
          Settings
        </div>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500">
          <IconSupport className="h-4.5 w-4.5" />
          Support
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_30px_rgba(15,23,42,0.04)]">
        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">{user?.role}</p>
        <button
          onClick={logout}
          className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
