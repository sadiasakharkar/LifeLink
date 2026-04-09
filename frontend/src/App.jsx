import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { AppLayout } from "./layout/AppLayout.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { DonorEntryPage } from "./pages/DonorEntryPage.jsx";
import { DonorDetailPage } from "./pages/DonorDetailPage.jsx";
import { RecipientsPage } from "./pages/RecipientsPage.jsx";
import { RecipientDetailPage } from "./pages/RecipientDetailPage.jsx";
import { AllocationPage } from "./pages/AllocationPage.jsx";
import { ApprovalPanelPage } from "./pages/ApprovalPanelPage.jsx";
import { AnalyticsPage } from "./pages/AnalyticsPage.jsx";
import { TransportPage } from "./pages/TransportPage.jsx";
import { AuditLogsPage } from "./pages/AuditLogsPage.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
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
  );
}
