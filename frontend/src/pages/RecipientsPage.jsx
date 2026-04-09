import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, Field, Input, PrimaryButton, SectionHeading, Select, Surface } from "../components/ui.jsx";
import { bloodGroups, organs } from "../utils/constants.js";

const urgencyTone = (urgency) => (urgency >= 9 ? "danger" : urgency >= 7 ? "warning" : "success");

export const RecipientsPage = () => {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [recipients, setRecipients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ organType: "All Organs", bloodGroup: "Any Type" });
  const [form, setForm] = useState({
    name: "",
    organType: "Kidney",
    bloodGroup: "A",
    urgency: 8,
    waitingTime: 120,
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  });

  const loadRecipients = async () => {
    const response = await apiRequest("/recipients", {}, token);
    setRecipients(response);
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const filteredRecipients = useMemo(
    () =>
      recipients.filter((recipient) => {
        const organMatch = filters.organType === "All Organs" || recipient.organType === filters.organType;
        const bloodMatch = filters.bloodGroup === "Any Type" || recipient.bloodGroup === filters.bloodGroup;
        return organMatch && bloodMatch;
      }),
    [filters, recipients],
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createRecipient = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest(
        "/recipients",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        token,
      );
      await loadRecipients();
      showToast({ title: "Recipient added", description: "The waiting list and approval scoring are now updated." });
      setForm((current) => ({ ...current, name: "" }));
    } catch (error) {
      showToast({ title: "Unable to add recipient", description: error.message, tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const raiseUrgency = async (recipient) => {
    try {
      await apiRequest(
        `/recipients/${recipient.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ urgency: Math.min(10, Number(recipient.urgency) + 1) }),
        },
        token,
      );
      await loadRecipients();
      showToast({ title: "Urgency updated", description: `${recipient.name} was moved higher in review priority.` });
    } catch (error) {
      showToast({ title: "Unable to update urgency", description: error.message, tone: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Live database"
        title="Recipient Directory"
        subtitle="Review, filter, and manage active recipients while keeping the waitlist clinically transparent."
      />

      <Surface>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Organ Type">
            <Select value={filters.organType} onChange={(event) => setFilters((current) => ({ ...current, organType: event.target.value }))}>
              <option>All Organs</option>
              {organs.map((organ) => (
                <option key={organ}>{organ}</option>
              ))}
            </Select>
          </Field>
          <Field label="Blood Group">
            <Select value={filters.bloodGroup} onChange={(event) => setFilters((current) => ({ ...current, bloodGroup: event.target.value }))}>
              <option>Any Type</option>
              {bloodGroups.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Surface>

      {user?.role === "Hospital Admin" ? (
        <Surface>
          <form onSubmit={createRecipient} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input name="name" value={form.name} onChange={updateField} placeholder="Recipient name" required />
            <Select name="organType" value={form.organType} onChange={updateField}>
              {organs.map((organ) => (
                <option key={organ}>{organ}</option>
              ))}
            </Select>
            <Select name="bloodGroup" value={form.bloodGroup} onChange={updateField}>
              {bloodGroups.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </Select>
            <Input name="urgency" type="number" min="1" max="10" value={form.urgency} onChange={updateField} />
            <Input name="waitingTime" type="number" min="1" value={form.waitingTime} onChange={updateField} />
            <Input name="hospitalId" value={form.hospitalId} onChange={updateField} />
            <Input name="hospitalName" value={form.hospitalName} onChange={updateField} className="xl:col-span-2" />
            <PrimaryButton disabled={saving} className="xl:col-span-1">
              {saving ? "Saving..." : "Add Recipient"}
            </PrimaryButton>
          </form>
        </Surface>
      ) : null}

      <Surface className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-100">
              <tr className="text-left text-[11px] uppercase tracking-[0.24em] text-slate-400">
                <th className="px-6 py-5 font-semibold">Patient</th>
                <th className="px-6 py-5 font-semibold">Organ</th>
                <th className="px-6 py-5 font-semibold">Blood Group</th>
                <th className="px-6 py-5 font-semibold">Urgency</th>
                <th className="px-6 py-5 font-semibold">Waiting Time</th>
                <th className="px-6 py-5 font-semibold">Status</th>
                <th className="px-6 py-5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecipients.map((recipient) => (
                <tr key={recipient.id}>
                  <td className="px-6 py-5">
                    <Link to={`/app/recipients/${recipient.id}`} className="text-lg font-semibold text-slate-900">
                      {recipient.name}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{recipient.hospitalName ?? recipient.hospitalId}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">{recipient.organType}</td>
                  <td className="px-6 py-5"><Badge>{recipient.bloodGroup}</Badge></td>
                  <td className="px-6 py-5"><Badge tone={urgencyTone(recipient.urgency)}>{recipient.urgency}</Badge></td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">{recipient.waitingTime} Days</td>
                  <td className="px-6 py-5"><Badge tone={recipient.status === "ALLOCATED" ? "success" : recipient.status === "RESERVED" ? "warning" : "info"}>{recipient.status}</Badge></td>
                  <td className="px-6 py-5">
                    {user?.role !== "Transport Team" ? (
                      <button onClick={() => raiseUrgency(recipient)} className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                        Raise Urgency
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast({ title: "Transport note added", description: "Static tracking note saved for the active mission.", tone: "info" })}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                      >
                        Add Note
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
};
