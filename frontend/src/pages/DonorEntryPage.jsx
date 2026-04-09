import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Badge, Field, Input, PrimaryButton, SectionHeading, Select, Surface } from "../components/ui.jsx";
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
      <SectionHeading
        eyebrow="Donor registry"
        title="Donor Intake & List"
        subtitle="Register a donor, trigger a pending allocation, and review all donor records from the same workspace."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr,1fr]">
        <Surface>
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
              <Input name="location" value={form.location} onChange={updateField} className="md:col-span-2" />
            </Field>
            <Field label="Hospital ID">
              <Input name="hospitalId" value={form.hospitalId} onChange={updateField} />
            </Field>
            <Field label="Hospital Name">
              <Input name="hospitalName" value={form.hospitalName} onChange={updateField} />
            </Field>
            <PrimaryButton disabled={saving} className="md:col-span-2">
              {saving ? "Registering..." : "Register Donor"}
            </PrimaryButton>
          </form>
        </Surface>

        <Surface>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Registered Donors</h3>
              <p className="mt-1 text-sm text-slate-400">Persistent donor records from DynamoDB</p>
            </div>
            <button
              onClick={() => showToast({ title: "Transport feed simulated", description: "Live transport is mocked for this MVP.", tone: "info" })}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Simulate Update
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {donors.map((donor) => (
              <div key={donor.id} className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{donor.organType}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {donor.bloodGroup} · {donor.location}
                    </p>
                  </div>
                  <Badge tone={donor.status === "ALLOCATED" ? "success" : donor.status === "MATCH_PENDING" ? "warning" : "info"}>
                    {donor.status}
                  </Badge>
                </div>
                <Link to={`/app/donor/${donor.id}`} className="mt-4 inline-block text-sm font-semibold text-brand-700">
                  View details
                </Link>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
};
