import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { usePolling } from "../hooks/usePolling.js";
import { Badge, SectionHeading, Surface } from "../components/ui.jsx";

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
      <SectionHeading
        eyebrow="Decision layer"
        title="Allocation Center"
        subtitle="Review all generated allocations, ranking explanations, and move pending matches into approval."
      />

      {latest ? (
        <Surface>
          <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-semibold text-slate-900">{latest.status === "APPROVED" ? "Organ Allocated" : "Allocation Awaiting Review"}</h2>
                <Badge tone={latest.status === "APPROVED" ? "success" : latest.status === "REJECTED" ? "danger" : "warning"}>{latest.status}</Badge>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Recipient</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{latest.recipientSnapshot?.name}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Organ Type</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{latest.donorSnapshot?.organType}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Match Score</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-700">{latest.score}</p>
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

      <Surface>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-slate-900">All Allocations</h3>
          <div className="flex gap-3">
            <Link to="/app/approvals" className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white">
              Open Approvals
            </Link>
            <button
              onClick={() => showToast({ title: "Export simulated", description: "Audit export would download from a secure reporting service.", tone: "info" })}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Export Audit Log
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {allocations.map((allocation) => (
            <div key={allocation.id} className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {allocation.recipientSnapshot?.name} · {allocation.donorSnapshot?.organType}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Donor {allocation.donorSnapshot?.bloodGroup} → Recipient {allocation.recipientSnapshot?.bloodGroup}
                  </p>
                </div>
                <Badge tone={allocation.status === "APPROVED" ? "success" : allocation.status === "REJECTED" ? "danger" : "warning"}>
                  {allocation.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
};
