import { formatUnits } from "viem";
import {
  useTotalClaimed,
  useTotalClaimers,
  useVaultBalance,
  useClaimAmount,
  useWhitelistCount,
} from "@/hooks/useClaimContract";

const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || "18");
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "TOKEN";

function formatBigInt(value: bigint | undefined, decimals: number): string {
  if (value === undefined) return "—";
  return Number(formatUnits(value, decimals)).toLocaleString();
}

function StatCard({
  label,
  value,
  unit,
  delay,
}: {
  label: string;
  value: string;
  unit: string;
  delay: string;
}) {
  return (
    <div
      className="rounded-xl border border-border-subtle bg-bg-card p-6 text-center transition-all duration-300 hover:border-accent/25 opacity-0 animate-[fade-up_0.7s_ease_forwards]"
      style={{ animationDelay: delay }}
    >
      <p className="text-xs uppercase tracking-widest text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl text-text-primary md:text-5xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-text-muted">{unit}</p>
    </div>
  );
}

export function StatsGrid() {
  const totalClaimed = useTotalClaimed();
  const totalClaimers = useTotalClaimers();

  return (
    <div className="mt-16">
      <h2 className="mb-8 text-center font-display text-3xl tracking-[4px] text-text-primary uppercase">
        Statistics
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          label="Total Claimed"
          value={formatBigInt(totalClaimed.data, TOKEN_DECIMALS)}
          unit={TOKEN_SYMBOL}
          delay="0.5s"
        />
        <StatCard
          label="Total Claimers"
          value={
            totalClaimers.data !== undefined
              ? totalClaimers.data.toString()
              : "—"
          }
          unit="wallets"
          delay="0.65s"
        />
      </div>
    </div>
  );
}
