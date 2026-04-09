import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { SectionHeading, Select, Surface } from "../components/ui.jsx";

export const AuditLogsPage = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ action: "", entityType: "" });

  const loadLogs = async () => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value).reduce((accumulator, [key, value]) => ({ ...accumulator, [key]: value }), {}),
    );
    const response = await apiRequest(`/audit-logs${query.toString() ? `?${query.toString()}` : ""}`, {}, token);
    setLogs(response);
  };

  useEffect(() => {
    loadLogs();
  }, [filters.action, filters.entityType]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Compliance"
        title="Audit Logs"
        subtitle="Review login, create, update, delete, approve, and reject actions across the LifeLink system."
      />

      <Surface>
        <div className="grid gap-4 md:grid-cols-2">
          <Select value={filters.action} onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))}>
            <option value="">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="APPROVE">Approve</option>
            <option value="REJECT">Reject</option>
          </Select>
          <Select value={filters.entityType} onChange={(event) => setFilters((current) => ({ ...current, entityType: event.target.value }))}>
            <option value="">All Entities</option>
            <option value="USER">User</option>
            <option value="DONOR">Donor</option>
            <option value="RECIPIENT">Recipient</option>
            <option value="ALLOCATION">Allocation</option>
          </Select>
        </div>
      </Surface>

      <Surface className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-100">
              <tr className="text-left text-[11px] uppercase tracking-[0.24em] text-slate-400">
                <th className="px-6 py-5 font-semibold">Timestamp</th>
                <th className="px-6 py-5 font-semibold">Action</th>
                <th className="px-6 py-5 font-semibold">Entity</th>
                <th className="px-6 py-5 font-semibold">User</th>
                <th className="px-6 py-5 font-semibold">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-5 text-sm text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-900">{log.action}</td>
                  <td className="px-6 py-5 text-sm text-slate-600">{log.entityType}</td>
                  <td className="px-6 py-5 text-sm text-slate-600">{log.userId}</td>
                  <td className="px-6 py-5 text-xs text-slate-500">{JSON.stringify(log.metadata)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
};
