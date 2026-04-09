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
    <aside className="flex w-full flex-col border-r border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#f2f6fc_100%)] px-5 py-6 lg:min-h-screen lg:max-w-[190px] lg:px-4">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 text-sm font-bold text-white shadow-[0_14px_26px_rgba(29,78,216,0.22)]">
          ✦
        </div>
        <div>
          <p className="text-[1.1rem] font-semibold leading-none text-slate-900">LifeLink</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Clinical Sanctuary</p>
        </div>
      </div>

      <nav className="mt-10 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/app"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-medium transition ${
                isActive
                  ? "bg-[#eef4ff] text-brand-700 shadow-[inset_3px_0_0_#2563eb]"
                  : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
              }`
            }
          >
            <item.icon className="h-[17px] w-[17px] transition group-hover:scale-105" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1 pt-10">
        <div className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-medium text-slate-500">
          <IconSettings className="h-[17px] w-[17px]" />
          Settings
        </div>
        <div className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-medium text-slate-500">
          <IconSupport className="h-[17px] w-[17px]" />
          Support
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_18px_30px_rgba(15,23,42,0.04)]">
        <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">{user?.role}</p>
        <button
          onClick={logout}
          className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Reset Demo
        </button>
      </div>
    </aside>
  );
};
