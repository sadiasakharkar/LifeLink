const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconDashboard = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="4.5" rx="1.5" />
    <rect x="14" y="10.5" width="7" height="10.5" rx="1.5" />
    <rect x="3" y="13.5" width="7" height="7.5" rx="1.5" />
  </svg>
);

export const IconDonor = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
    <path d="M12 7.5v7" />
    <path d="M8.5 11h7" />
  </svg>
);

export const IconRecipients = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M16 21v-1.5a3.5 3.5 0 0 0-3.5-3.5h-1A3.5 3.5 0 0 0 8 19.5V21" />
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 21v-1a3 3 0 0 1 2.5-2.96" />
    <path d="M19 21v-1a3 3 0 0 0-2.5-2.96" />
  </svg>
);

export const IconAllocation = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M5 12h8" />
    <path d="m10 7 5 5-5 5" />
    <rect x="4" y="4" width="16" height="16" rx="3" />
  </svg>
);

export const IconAnalytics = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M4 19h16" />
    <path d="M7 16V9" />
    <path d="M12 16V5" />
    <path d="M17 16v-6" />
  </svg>
);

export const IconTransport = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M3 7h11v8H3Z" />
    <path d="M14 10h3l3 3v2h-6Z" />
    <circle cx="7.5" cy="18" r="1.5" />
    <circle cx="17.5" cy="18" r="1.5" />
  </svg>
);

export const IconClipboard = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M9 4.5h6v3H9z" />
    <path d="M9 10h6" />
    <path d="M9 14h6" />
  </svg>
);

export const IconFile = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M8 3h6l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h5" />
  </svg>
);

export const IconSearch = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.3-4.3" />
  </svg>
);

export const IconBell = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const IconShield = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 3 5 6v5c0 4.7 2.8 8.9 7 10 4.2-1.1 7-5.3 7-10V6Z" />
  </svg>
);

export const IconClock = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5l3 2" />
  </svg>
);

export const IconCheck = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.3 2.3 4.7-5.3" />
  </svg>
);

export const IconAlert = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 4 3.5 19h17Z" />
    <path d="M12 9v4.5" />
    <path d="M12 17h.01" />
  </svg>
);

export const IconSettings = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="m19.4 15-.8 1.4 1.1 2-2 2-2-1.1-1.4.8-1 2.2H10.7L9.7 20l-1.4-.8-2 1.1-2-2 1.1-2-.8-1.4-2.2-1V10.7l2.2-1 .8-1.4-1.1-2 2-2 2 1.1 1.4-.8 1-2.2h2.6l1 2.2 1.4.8 2-1.1 2 2-1.1 2 .8 1.4 2.2 1v2.6Z" />
  </svg>
);

export const IconSupport = ({ className = "h-5 w-5" }) => (
  <svg {...iconProps} className={className}>
    <path d="M18 10a6 6 0 1 0-12 0v3a2 2 0 0 0 2 2h1.5" />
    <path d="M14.5 18H16a2 2 0 0 0 2-2" />
    <path d="M12 18v1" />
  </svg>
);

export const IconChevron = ({ className = "h-4 w-4" }) => (
  <svg {...iconProps} className={className}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
