type Variant = "active" | "inactive" | "whitelisted" | "notWhitelisted" | "claimed";

const config: Record<Variant, { label: string; icon: string; classes: string }> = {
  active: {
    label: "Active",
    icon: "✓",
    classes: "bg-green-500/10 text-green-400 ring-green-500/20",
  },
  inactive: {
    label: "Paused",
    icon: "⏸",
    classes: "bg-red-500/10 text-red-400 ring-red-500/20",
  },
  whitelisted: {
    label: "Whitelisted",
    icon: "✓",
    classes: "bg-accent/10 text-accent ring-accent/20",
  },
  notWhitelisted: {
    label: "Not Whitelisted",
    icon: "✗",
    classes: "bg-white/5 text-text-muted ring-white/10",
  },
  claimed: {
    label: "Claimed",
    icon: "✓",
    classes: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  },
};

export function StatusBadge({ variant }: { variant: Variant }) {
  const { label, icon, classes } = config[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide ring-1 ring-inset ${classes}`}
    >
      <span className="text-[10px] leading-none">{icon}</span>
      {label}
    </span>
  );
}
