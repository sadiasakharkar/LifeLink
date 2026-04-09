import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { AppLayout } from "./layout/AppLayout.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";

const AuthPage = lazy(() => import("./pages/AuthPage.jsx").then((module) => ({ default: module.AuthPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx").then((module) => ({ default: module.DashboardPage })));
const DonorEntryPage = lazy(() => import("./pages/DonorEntryPage.jsx").then((module) => ({ default: module.DonorEntryPage })));
const DonorDetailPage = lazy(() => import("./pages/DonorDetailPage.jsx").then((module) => ({ default: module.DonorDetailPage })));
const RecipientsPage = lazy(() => import("./pages/RecipientsPage.jsx").then((module) => ({ default: module.RecipientsPage })));
const RecipientDetailPage = lazy(() => import("./pages/RecipientDetailPage.jsx").then((module) => ({ default: module.RecipientDetailPage })));
const AllocationPage = lazy(() => import("./pages/AllocationPage.jsx").then((module) => ({ default: module.AllocationPage })));
const ApprovalPanelPage = lazy(() => import("./pages/ApprovalPanelPage.jsx").then((module) => ({ default: module.ApprovalPanelPage })));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage.jsx").then((module) => ({ default: module.AnalyticsPage })));
const TransportPage = lazy(() => import("./pages/TransportPage.jsx").then((module) => ({ default: module.TransportPage })));
const AuditLogsPage = lazy(() => import("./pages/AuditLogsPage.jsx").then((module) => ({ default: module.AuditLogsPage })));

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading LifeLink...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="donor" element={<DonorEntryPage />} />
          <Route path="donor/:id" element={<DonorDetailPage />} />
          <Route path="recipients" element={<RecipientsPage />} />
          <Route path="recipients/:id" element={<RecipientDetailPage />} />
          <Route path="allocation" element={<AllocationPage />} />
          <Route path="approvals" element={<ApprovalPanelPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="transport" element={<TransportPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
