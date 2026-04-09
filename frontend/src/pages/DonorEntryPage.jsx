import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, Field, Input, PrimaryButton, Select, Surface } from "../components/ui.jsx";
import { bloodGroups, organs } from "../utils/constants.js";

export const DonorEntryPage = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [donors, setDonors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    organType: "Kidney",
    bloodGroup: "O",
    location: "Central Surgical Hub A-12",
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  });

  const loadDonors = async () => {
    const response = await apiRequest("/donors", {}, token);
    setDonors(response);
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await apiRequest(
        "/donors",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
        token,
      );
      await loadDonors();
      showToast({
        title: "Donor registered",
        description: response.message,
      });
    } catch (error) {
      showToast({ title: "Unable to register donor", description: error.message, tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
        <Surface className="p-7">
          <h3 className="text-[2rem] font-semibold text-slate-900">Register New Donor</h3>
          <p className="mt-2 text-sm text-slate-500">Ensure all clinical data is verified before submission.</p>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <Field label="Organ Type">
              <Select name="organType" value={form.organType} onChange={updateField}>
                {organs.map((organ) => (
                  <option key={organ}>{organ}</option>
                ))}
              </Select>
            </Field>
            <Field label="Blood Group">
              <Select name="bloodGroup" value={form.bloodGroup} onChange={updateField}>
                {bloodGroups.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </Select>
            </Field>
            <Field label="Hospital Location">
              <Input name="location" value={form.location} onChange={updateField} placeholder="e.g. Saint Jude Medical Center, NY" className="md:col-span-2" />
            </Field>
            <PrimaryButton disabled={saving} className="mt-3 md:col-span-2">
              {saving ? "Registering..." : "Register Donor"}
            </PrimaryButton>
          </form>
        </Surface>

        <div className="space-y-5">
          <Surface>
            <div className="flex items-center justify-between">
              <Badge tone="success">System Active</Badge>
              <span className="text-emerald-500">✓</span>
            </div>
            <h3 className="mt-5 text-[2rem] font-semibold text-slate-900">Matching in progress...</h3>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-brand-600" />
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>• Searching compatible O+ recipients</p>
              <p>• Calculating transport feasibility</p>
              <p className="text-slate-300">• Generating allocation report</p>
            </div>
          </Surface>
          <Surface className="overflow-hidden bg-[linear-gradient(180deg,#5fb6d6_0%,#163342_100%)] p-0 text-white">
            <div className="min-h-[190px] bg-[linear-gradient(90deg,rgba(255,255,255,0.2),transparent_55%)] p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Current Facility</p>
              <p className="mt-2 text-3xl font-semibold">Central Surgical Hub A-12</p>
            </div>
          </Surface>
          <Surface className="border-rose-100 bg-rose-50/70">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-500">!</div>
              <div>
                <p className="font-semibold text-rose-700">Critical Viability Window</p>
                <p className="mt-2 text-sm leading-6 text-rose-500">Once registered, the transport timer for vital organs will initiate automatically based on donor vitals.</p>
              </div>
            </div>
          </Surface>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <Surface className="py-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Avg. Match Time</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">14.2 min</p>
        </Surface>
        <Surface className="py-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Success Rate</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">98.4%</p>
        </Surface>
        <Surface className="py-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Active Centers</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">42 Units</p>
        </Surface>
      </section>
    </div>
  );
};
