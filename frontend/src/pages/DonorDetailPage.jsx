import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, PrimaryButton, SectionHeading, Surface } from "../components/ui.jsx";

export const DonorDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [donor, setDonor] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const [donorData, allocationData] = await Promise.all([
        apiRequest(`/donors/${id}`, {}, token),
        apiRequest(`/allocations?donorId=${id}`, {}, token),
      ]);
      setDonor(donorData);
      setAllocations(allocationData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const createPendingAllocation = async () => {
    setMatching(true);
    try {
      await apiRequest(
        "/match/allocate",
        {
          method: "POST",
          body: JSON.stringify({ donorId: id }),
        },
        token,
      );
      await loadDetail();
      showToast({ title: "Pending allocation generated", description: "Approval panel has been updated with a new match." });
    } catch (error) {
      showToast({ title: "Unable to generate match", description: error.message, tone: "error" });
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading donor details...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Donor detail"
        title={donor?.organType ?? "Donor"}
        subtitle="Review donor status, current matching state, and linked allocations."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
        <Surface>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge tone={donor.status === "ALLOCATED" ? "success" : donor.status === "MATCH_PENDING" ? "warning" : "info"}>{donor.status}</Badge>
            </div>
            <div className="flex items-center justify-between"><span>Blood Group</span><span className="font-semibold text-slate-900">{donor.bloodGroup}</span></div>
            <div className="flex items-center justify-between"><span>Location</span><span className="font-semibold text-slate-900">{donor.location}</span></div>
            <div className="flex items-center justify-between"><span>Hospital</span><span className="font-semibold text-slate-900">{donor.hospitalName ?? donor.hospitalId}</span></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton disabled={matching || donor.status === "ALLOCATED"} onClick={createPendingAllocation}>
              {matching ? "Generating..." : "Generate Pending Match"}
            </PrimaryButton>
            <button
              onClick={() => showToast({ title: "Notification simulated", description: "Transport and care teams would be alerted here.", tone: "info" })}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Notify Teams
            </button>
          </div>
        </Surface>

        <Surface>
          <h3 className="text-2xl font-semibold text-slate-900">Linked Allocations</h3>
          <div className="mt-5 space-y-4">
            {allocations.length > 0 ? (
              allocations.map((allocation) => (
                <div key={allocation.id} className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{allocation.recipientSnapshot?.name}</p>
                      <p className="mt-1 text-sm text-slate-500">Score {allocation.score}</p>
                    </div>
                    <Badge tone={allocation.status === "APPROVED" ? "success" : allocation.status === "REJECTED" ? "danger" : "warning"}>
                      {allocation.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No allocations linked to this donor yet.</p>
            )}
          </div>
        </Surface>
      </div>
    </div>
  );
};
