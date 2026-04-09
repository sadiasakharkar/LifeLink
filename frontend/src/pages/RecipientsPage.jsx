import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, Field, Input, PrimaryButton, Select, Surface } from "../components/ui.jsx";
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
      <div className="flex items-center gap-3">
        <h3 className="text-[2rem] font-semibold text-slate-900">Recipient Directory</h3>
        <Badge tone="info">Live Database</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr,auto,auto]">
        <Surface>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Organ Type">
              <Select value={filters.organType} onChange={(event) => setFilters((current) => ({ ...current, organType: event.target.value }))}>
                <option>All Organs</option>
                {organs.map((organ) => (
                  <option key={organ}>{organ}</option>
                ))}
              </Select>
            </Field>
            <Field label="Urgency Level">
              <Select value={filters.urgency ?? "All Levels"} onChange={(event) => setFilters((current) => ({ ...current, urgency: event.target.value }))}>
                <option>All Levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
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
        <button
          onClick={() => showToast({ title: "Report exported", description: "Recipient summary exported from the demo workspace.", tone: "success" })}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
        >
          Export Report
        </button>
        {user?.role === "Hospital Admin" ? (
          <button
            onClick={() => document.getElementById("recipient-name-input")?.focus()}
            className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(29,78,216,0.22)]"
          >
            + New Recipient
          </button>
        ) : null}
      </div>

      {user?.role === "Hospital Admin" ? (
        <Surface>
          <form onSubmit={createRecipient} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input id="recipient-name-input" name="name" value={form.name} onChange={updateField} placeholder="Enter recipient name..." required />
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
            <Input name="hospitalName" value={form.hospitalName} onChange={updateField} placeholder="Enter hospital name..." className="xl:col-span-2" />
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
                <th className="px-6 py-5 font-semibold">Patient Name</th>
                <th className="px-6 py-5 font-semibold">Required Organ</th>
                <th className="px-6 py-5 font-semibold">Blood Group</th>
                <th className="px-6 py-5 font-semibold">Urgency Level</th>
                <th className="px-6 py-5 font-semibold">Waiting Time</th>
                <th className="px-6 py-5 font-semibold">Match Status</th>
                <th className="px-6 py-5 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecipients.map((recipient) => (
                <tr key={recipient.id}>
                  <td className="px-6 py-5">
                    <Link to={`/app/recipients/${recipient.id}`} className="text-[1.75rem] leading-none font-semibold text-slate-900">
                      <span className="block text-lg leading-6">{recipient.name}</span>
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">ID: {recipient.id.toUpperCase()}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">{recipient.organType}</td>
                  <td className="px-6 py-5"><Badge>{recipient.bloodGroup}</Badge></td>
                  <td className="px-6 py-5"><Badge tone={urgencyTone(recipient.urgency)}>{recipient.urgency >= 9 ? "Critical High" : recipient.urgency >= 7 ? "Medium" : "Low"}</Badge></td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-700">{recipient.waitingTime} Days</td>
                  <td className="px-6 py-5"><Badge tone={recipient.urgency >= 9 ? "info" : recipient.status === "RESERVED" ? "success" : "neutral"}>{recipient.urgency >= 9 ? "Scanning" : recipient.status === "RESERVED" ? "Potential Match" : "Waitlist"}</Badge></td>
                  <td className="px-6 py-5 text-slate-400">⋮</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <section className="grid gap-4 xl:grid-cols-3">
        <Surface className="bg-brand-600 text-white">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">Total Waiting</p>
          <p className="mt-3 text-5xl font-semibold">1,402</p>
          <p className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">+12% this month</p>
        </Surface>
        <Surface>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Average Wait Time</p>
          <p className="mt-3 text-5xl font-semibold text-slate-900">124 Days</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-full w-2/3 rounded-full bg-emerald-600" />
          </div>
        </Surface>
        <Surface>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Active Matches</p>
          <p className="mt-3 text-5xl font-semibold text-slate-900">42</p>
          <p className="mt-4 text-sm font-semibold text-brand-700">View active transport cycles →</p>
        </Surface>
      </section>
    </div>
  );
};
