import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, Input, PrimaryButton, SectionHeading, Surface } from "../components/ui.jsx";

export const RecipientDetailPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [recipient, setRecipient] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [urgency, setUrgency] = useState(8);

  const loadDetail = async () => {
    const [recipientData, allocationData] = await Promise.all([
      apiRequest(`/recipients/${id}`, {}, token),
      apiRequest(`/allocations?recipientId=${id}`, {}, token),
    ]);
    setRecipient(recipientData);
    setUrgency(recipientData.urgency);
    setAllocations(allocationData);
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const saveUrgency = async () => {
    try {
      await apiRequest(
        `/recipients/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ urgency: Number(urgency) }),
        },
        token,
      );
      await loadDetail();
      showToast({ title: "Recipient updated", description: "Urgency level saved successfully." });
    } catch (error) {
      showToast({ title: "Unable to save urgency", description: error.message, tone: "error" });
    }
  };

  if (!recipient) {
    return <div className="text-sm text-slate-500">Loading recipient details...</div>;
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Recipient detail"
        title={recipient.name}
        subtitle="Review recipient status, urgency, and allocation history for this patient."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
        <Surface>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Organ Needed</span><span className="font-semibold text-slate-900">{recipient.organType}</span></div>
            <div className="flex items-center justify-between"><span>Blood Group</span><span className="font-semibold text-slate-900">{recipient.bloodGroup}</span></div>
            <div className="flex items-center justify-between"><span>Status</span><Badge tone={recipient.status === "ALLOCATED" ? "success" : recipient.status === "RESERVED" ? "warning" : "info"}>{recipient.status}</Badge></div>
            <div className="flex items-center justify-between"><span>Waiting Time</span><span className="font-semibold text-slate-900">{recipient.waitingTime} days</span></div>
          </div>
          <div className="mt-6 flex items-end gap-3">
            <div className="flex-1">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Urgency</p>
              <Input type="number" min="1" max="10" value={urgency} onChange={(event) => setUrgency(event.target.value)} />
            </div>
            <PrimaryButton onClick={saveUrgency}>Save</PrimaryButton>
          </div>
        </Surface>

        <Surface>
          <h3 className="text-2xl font-semibold text-slate-900">Allocation History</h3>
          <div className="mt-5 space-y-4">
            {allocations.length > 0 ? (
              allocations.map((allocation) => (
                <div key={allocation.id} className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{allocation.donorSnapshot?.organType} donor</p>
                      <p className="mt-1 text-sm text-slate-500">Score {allocation.score}</p>
                    </div>
                    <Badge tone={allocation.status === "APPROVED" ? "success" : allocation.status === "REJECTED" ? "danger" : "warning"}>
                      {allocation.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No allocation history yet.</p>
            )}
          </div>
        </Surface>
      </div>
    </div>
  );
};
