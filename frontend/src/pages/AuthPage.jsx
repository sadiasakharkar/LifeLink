import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { IconShield } from "../components/icons.jsx";
import { Field, Input, PrimaryButton, Select, Surface } from "../components/ui.jsx";
import { roles } from "../utils/constants.js";

export const AuthPage = ({ mode }) => {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Hospital Admin",
    hospitalName: "Metro Care Hospital",
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const response = await apiRequest(isSignup ? "/auth/signup" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      login(response);
      navigate("/app");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.07),transparent_24%),linear-gradient(180deg,#fafcff_0%,#f3f6fb_100%)] px-4 py-12">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-brand-700 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <IconShield className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-5xl font-semibold text-slate-900">LifeLink</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.26em] text-slate-400">
          {isSignup ? "Clinical Sanctuary Demo Enrollment" : "Clinical Sanctuary Demo Access"}
        </p>

        <Surface className="mx-auto mt-10 max-w-xl px-7 py-8 text-left">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {isSignup ? (
                <Field label="Full Name">
                  <Input name="name" value={form.name} onChange={updateField} placeholder="Enter name..." required />
                </Field>
              ) : null}

              <Field label="Professional Email">
                <Input name="email" type="email" value={form.email} onChange={updateField} placeholder="Enter email..." required />
              </Field>

              <Field label="Security Key">
                <Input name="password" type="password" value={form.password} onChange={updateField} placeholder="Enter password..." required />
              </Field>

              {isSignup ? (
                <Field label="System Authorization">
                  <Select name="role" value={form.role} onChange={updateField}>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}

              {isSignup ? (
                <Field label="Hospital Network">
                  <Input name="hospitalName" value={form.hospitalName} onChange={updateField} placeholder="Enter hospital name..." />
                </Field>
              ) : null}
            </div>

            {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <PrimaryButton type="submit" className="mt-6 w-full rounded-2xl py-3.5">
              {loading ? "Opening..." : isSignup ? "Create Demo Access" : "Enter Demo Workspace"}
            </PrimaryButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isSignup ? "Already in the demo?" : "Need another demo role?"}{" "}
            <Link to={isSignup ? "/login" : "/signup"} className="font-semibold text-brand-700">
              {isSignup ? "Login" : "Create demo access"}
            </Link>
          </p>
        </Surface>

      </div>
    </div>
  );
};
