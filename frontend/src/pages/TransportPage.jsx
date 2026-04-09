import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { usePolling } from "../hooks/usePolling.js";
import { SectionHeading, StatCard, Surface } from "../components/ui.jsx";
import { IconAllocation, IconClock, IconTransport } from "../components/icons.jsx";

export const TransportPage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState([]);

  const loadAssignments = async () => {
    const response = await apiRequest("/dashboard/transport", {}, token);
    setAssignments(response);
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  usePolling(loadAssignments, 12000, Boolean(token));

  const updateTransportStage = async (assignment, stage) => {
    try {
      await apiRequest(
        `/allocations/${assignment.id}/transport`,
        {
          method: "PATCH",
          body: JSON.stringify({
            stage,
            note: stage === "DELIVERED" ? "Organ delivered to recipient surgical unit." : `Transport stage updated to ${stage.toLowerCase()}.`,
          }),
        },
        token,
      );
      await loadAssignments();
      showToast({ title: "Transport updated", description: `Mission moved to ${stage.toLowerCase()}.` });
    } catch (error) {
      showToast({ title: "Unable to update transport", description: error.message, tone: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Route operations"
        title="Transport Command"
        subtitle="Static transport tracking is simulated in this MVP, but all buttons and assignment states are functional."
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <StatCard label="Active Deliveries" value={String(assignments.length).padStart(2, "0")} detail="On schedule" accent="text-emerald-600" icon={<IconTransport />} />
        <StatCard label="Avg Transit Time" value="42 min" detail="Optimized routes" accent="text-slate-500" icon={<IconClock />} />
        <StatCard label="Fleet Status" value="98%" detail="Operational" accent="text-emerald-600" icon={<IconAllocation />} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.35fr,0.65fr]">
        <Surface>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-slate-900">{assignment.donorSnapshot?.organType}</p>
                    <p className="mt-1 text-sm text-slate-500">Destination: {assignment.dropLocation}</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-700">{assignment.trackingStatus}</p>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Current Location</p>
                    <p className="mt-2 font-semibold text-slate-800">{assignment.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">ETA</p>
                    <p className="mt-2 font-semibold text-slate-800">{assignment.etaMinutes} mins</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Recipient</p>
                    <p className="mt-2 font-semibold text-slate-800">{assignment.recipientSnapshot?.name}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => showToast({ title: "Driver contacted", description: "This is a simulated dispatch action.", tone: "info" })}
                    className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700"
                  >
                    Contact Driver
                  </button>
                  <button
                    onClick={() => updateTransportStage(assignment, assignment.trackingStatus === "PREPARING" ? "DISPATCHED" : "DELIVERED")}
                    className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
                  >
                    {assignment.trackingStatus === "PREPARING" ? "Dispatch Mission" : assignment.trackingStatus === "IN_TRANSIT" ? "Mark Delivered" : "Delivered"}
                  </button>
                </div>
                {assignment.transportUpdates?.length ? (
                  <div className="mt-5 space-y-2 rounded-2xl bg-white p-4">
                    {assignment.transportUpdates.map((update) => (
                      <p key={update.label} className="text-sm text-slate-600">
                        {update.label}: <span className="font-semibold">{update.status}</span>
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Surface>

        <div className="space-y-5">
          <Surface>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Logistics Command</p>
            <div className="mt-5 space-y-4">
              <button onClick={() => showToast({ title: "Dispatch Alpha reached", description: "The dispatch team acknowledges the transport request.", tone: "info" })} className="w-full rounded-[22px] bg-slate-50 p-4 text-left">
                <p className="font-semibold text-slate-900">Dispatch Alpha</p>
                <p className="mt-1 text-sm text-slate-500">Active now</p>
              </button>
              <button onClick={() => showToast({ title: "Emergency broadcast sent", description: "This static MVP simulates a regional logistics alert.", tone: "success" })} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                Emergency Broadcast
              </button>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};
