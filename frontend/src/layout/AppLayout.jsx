import { Outlet } from "react-router-dom";
import { AppTopbar } from "../components/AppTopbar.jsx";
import { Sidebar } from "../components/Sidebar.jsx";

export const AppLayout = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_25%),linear-gradient(180deg,#f8fbff_0%,#f2f5fb_100%)] lg:flex">
    <Sidebar />
    <main className="flex-1 p-4 sm:p-6 lg:p-7">
      <AppTopbar />
      <Outlet />
    </main>
  </div>
);
