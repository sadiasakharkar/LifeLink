import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { usePolling } from "../hooks/usePolling.js";
import { Badge, Surface } from "../components/ui.jsx";

export const AllocationPage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [allocations, setAllocations] = useState([]);

  const loadAllocations = async () => {
    const response = await apiRequest("/allocations", {}, token);
    setAllocations(response);
  };

  useEffect(() => {
    loadAllocations();
  }, []);

  usePolling(loadAllocations, 12000, Boolean(token));

  const latest = allocations[0];

  return (
    <div className="space-y-6">
      {latest ? (
        <Surface className="bg-[linear-gradient(180deg,#fbfefb_0%,#f8fdf7_100%)] p-8">
          <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</div>
                <h2 className="text-5xl font-semibold text-slate-900">{latest.status === "APPROVED" ? "Organ Allocated Successfully" : "Allocation Awaiting Review"}</h2>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Patient Name</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{latest.recipientSnapshot?.name}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Organ Type</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{latest.donorSnapshot?.organType}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Total Time</p>
                  <p className="mt-2 text-4xl font-semibold text-brand-700">2m 45s</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-lg font-semibold text-slate-900">Allocation Reason</p>
              <div className="mt-4 space-y-3">
                {(latest.explanation ?? []).map((reason) => (
                  <p key={reason} className="text-sm leading-6 text-slate-600">{reason}</p>
                ))}
              </div>
            </div>
          </div>
          {latest.rankingList?.length ? (
            <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
              <p className="text-lg font-semibold text-slate-900">Ranked Candidate List</p>
              <div className="mt-4 space-y-3">
                {latest.rankingList.slice(0, 3).map((candidate, index) => (
                  <div key={candidate.recipientId} className="rounded-2xl bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          #{index + 1} {candidate.recipientName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{candidate.organType} · {candidate.bloodGroup}</p>
                      </div>
                      <Badge tone={index === 0 ? "success" : "info"}>{candidate.score}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Surface>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.8fr,1.2fr]">
        <Surface>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Transport Logistics</p>
          <div className="mt-5 rounded-[20px] bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">Air Ambulance Alpha</p>
            <p className="mt-1 text-sm text-slate-500">Estimated Departure: 14:20</p>
            <div className="mt-5 h-2 rounded-full bg-slate-200">
              <div className="h-full w-3/5 rounded-full bg-brand-600" />
            </div>
            <p className="mt-4 text-sm font-semibold text-brand-700">In Transit to Donor Site</p>
          </div>
        </Surface>
        <Surface>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-900">Allocation Decision History</h3>
            <button
              onClick={() => showToast({ title: "Export simulated", description: "Audit export would download from a secure reporting service.", tone: "info" })}
              className="text-sm font-semibold text-brand-700"
            >
              Export Audit Log
            </button>
          </div>
          <div className="space-y-4">
            {allocations.map((allocation, index) => (
              <div key={allocation.id} className="grid grid-cols-[60px,1.1fr,0.8fr,0.7fr,0.6fr] items-center gap-4 rounded-[20px] px-2 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{index + 1}</div>
                <div>
                  <p className="font-semibold text-slate-900">{index === 0 ? "Primary Match" : index === 1 ? "Secondary Backup" : "Backup List"}</p>
                  <p className="mt-1 text-sm text-slate-500">{allocation.recipientSnapshot?.name}</p>
                </div>
                <p className="font-semibold text-slate-900">{allocation.score}</p>
                <Badge tone={allocation.status === "APPROVED" ? "success" : allocation.status === "REJECTED" ? "danger" : "warning"}>
                  {allocation.status === "APPROVED" ? "Allocated" : allocation.status}
                </Badge>
                <p className="text-sm text-slate-400">14:0{index + 2}:3{index}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
};
