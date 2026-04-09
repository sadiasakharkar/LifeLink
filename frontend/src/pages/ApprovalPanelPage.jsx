import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, Input, PrimaryButton, SectionHeading, Surface } from "../components/ui.jsx";

export const ApprovalPanelPage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [allocations, setAllocations] = useState([]);
  const [notesById, setNotesById] = useState({});
  const [busyId, setBusyId] = useState("");

  const loadAllocations = async () => {
    const response = await apiRequest("/allocations", {}, token);
    setAllocations(response.filter((item) => item.status === "PENDING"));
  };

  useEffect(() => {
    loadAllocations();
  }, []);

  const reviewAllocation = async (allocationId, status) => {
    setBusyId(allocationId);
    try {
      await apiRequest(
        `/allocations/${allocationId}/approval`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            notes: notesById[allocationId] ?? "",
          }),
        },
        token,
      );
      await loadAllocations();
      showToast({
        title: `Allocation ${status.toLowerCase()}`,
        description: status === "APPROVED" ? "The donor and recipient were updated successfully." : "The donor and recipient were returned to review state.",
      });
    } catch (error) {
      showToast({ title: "Unable to update allocation", description: error.message, tone: "error" });
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Clinical approvals"
        title="Approval Panel"
        subtitle="Approve or reject pending allocations with notes. Only doctor and admin roles can complete this step."
      />

      <div className="space-y-4">
        {allocations.length > 0 ? (
          allocations.map((allocation) => (
            <Surface key={allocation.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-2">
                  <Badge tone="warning">PENDING</Badge>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {allocation.donorSnapshot?.organType} donor for {allocation.recipientSnapshot?.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Score {allocation.score} · {allocation.donorSnapshot?.bloodGroup} to {allocation.recipientSnapshot?.bloodGroup}
                  </p>
                  <div className="pt-2 text-sm leading-6 text-slate-500">
                    {(allocation.explanation ?? []).map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
                <div className="w-full max-w-md space-y-3">
                  <Input
                    value={notesById[allocation.id] ?? ""}
                    onChange={(event) => setNotesById((current) => ({ ...current, [allocation.id]: event.target.value }))}
                    placeholder="Approval or rejection notes"
                  />
                  <div className="flex gap-3">
                    <PrimaryButton disabled={busyId === allocation.id} onClick={() => reviewAllocation(allocation.id, "APPROVED")} className="flex-1">
                      {busyId === allocation.id ? "Saving..." : "Approve"}
                    </PrimaryButton>
                    <button
                      disabled={busyId === allocation.id}
                      onClick={() => reviewAllocation(allocation.id, "REJECTED")}
                      className="flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </Surface>
          ))
        ) : (
          <Surface>
            <p className="text-sm text-slate-500">No pending allocations need review right now.</p>
          </Surface>
        )}
      </div>
    </div>
  );
};
