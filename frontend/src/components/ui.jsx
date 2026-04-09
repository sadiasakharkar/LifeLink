export const cn = (...values) => values.filter(Boolean).join(" ");

export const SectionHeading = ({ eyebrow, title, subtitle, action }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div>
      {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-700">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-[2rem]">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p> : null}
    </div>
    {action}
  </div>
);

export const Surface = ({ className = "", children }) => (
  <div className={cn("rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_24px_50px_rgba(15,23,42,0.07)]", className)}>
    {children}
  </div>
);

export const StatCard = ({ label, value, accent, detail, icon }) => (
  <Surface className="relative overflow-hidden">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
        <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className={cn("mt-3 text-sm font-medium", accent || "text-slate-500")}>{detail}</p>
      </div>
      <div className="rounded-2xl bg-slate-100 p-3 text-brand-700">{icon}</div>
    </div>
    <div className="mt-5 h-1.5 rounded-full bg-slate-100">
      <div className="h-full w-2/3 rounded-full bg-brand-600" />
    </div>
  </Surface>
);

export const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-emerald-50 text-emerald-700",
    danger: "bg-rose-50 text-rose-600",
    info: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
};

export const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</span>
    {children}
    {hint ? <span className="mt-2 block text-xs text-slate-400">{hint}</span> : null}
  </label>
);

export const Input = (props) => (
  <input
    {...props}
    className={cn(
      "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:bg-white",
      props.className,
    )}
  />
);

export const Select = (props) => (
  <select
    {...props}
    className={cn(
      "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white",
      props.className,
    )}
  />
);

export const PrimaryButton = ({ className = "", children, ...props }) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(29,78,216,0.22)] transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70",
      className,
    )}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ className = "", children, ...props }) => (
  <button
    {...props}
    className={cn(
      "inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",
      className,
    )}
  >
    {children}
  </button>
);
