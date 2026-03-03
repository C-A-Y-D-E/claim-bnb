import { useState, useEffect, useCallback } from "react";
import { isAddress, parseUnits } from "viem";
import { formatUnits } from "viem";
import {
  useAddToWhitelist,
  useRemoveFromWhitelist,
  useBatchClaimFor,
  useWhitelistCount,
  useTotalClaimers,
  useTotalClaimed,
  useVaultBalance,
  useIsActive,
  useClaimAmount,
  useIsWhitelisted,
  useHasClaimed,
  useTokenAddress,
  useSetToken,
  useToggleActive,
  useUpdateClaimAmount,
} from "@/hooks/useClaimContract";

const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || "18");
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "TOKEN";

function formatBigInt(value: bigint | undefined, decimals: number): string {
  if (value === undefined) return "—";
  return Number(formatUnits(value, decimals)).toLocaleString();
}

function parseAddresses(input: string): `0x${string}`[] {
  return input
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && isAddress(s)) as `0x${string}`[];
}

function ActionButton({
  onClick,
  disabled,
  isPending,
  isConfirming,
  isConfirmed,
  isError,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  isError?: boolean;
  label: string;
}) {
  const isLoading = !isError && (isPending || isConfirming);

  const text = isConfirmed
    ? "Success!"
    : isLoading && isConfirming
      ? "Confirming..."
      : isLoading && isPending
        ? "Waiting for Confirmation..."
        : label;

  const classes = isConfirmed
    ? "w-full rounded-xl bg-green-500 py-3 text-base font-semibold text-bg-primary cursor-default"
    : isLoading
      ? "w-full rounded-xl bg-accent/60 py-3 text-base font-semibold text-bg-primary animate-pulse cursor-wait"
      : disabled
        ? "w-full rounded-xl bg-white/5 py-3 text-base font-semibold text-text-muted border border-border-subtle cursor-not-allowed"
        : "w-full rounded-xl bg-accent py-3 text-base font-semibold text-bg-primary transition-all duration-300 hover:brightness-110 shadow-[0_0_20px_rgba(255,122,26,0.3)] hover:shadow-[0_0_30px_rgba(255,122,26,0.5)] cursor-pointer";

  return (
    <button onClick={onClick} disabled={disabled || isLoading || isConfirmed} className={classes}>
      {isLoading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg-primary border-t-transparent align-middle" />
      )}
      {text}
    </button>
  );
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function SetTokenCard() {
  const [input, setInput] = useState("");
  const tokenAddress = useTokenAddress();
  const isActive = useIsActive();
  const { setToken, isPending, isConfirming, isConfirmed, isError, error, reset } = useSetToken();

  const isValidAddress = input.length > 0 && isAddress(input);
  const currentToken = tokenAddress.data as string | undefined;
  const isTokenSet = !!currentToken && currentToken !== ZERO_ADDRESS;
  const short = isTokenSet ? `${currentToken!.slice(0, 6)}...${currentToken!.slice(-4)}` : null;

  useEffect(() => {
    if (isConfirmed) {
      tokenAddress.refetch();
      setInput("");
      const timer = setTimeout(() => reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  const handleSubmit = () => {
    if (!isValidAddress) return;
    reset();
    setToken(input as `0x${string}`);
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 transition-colors duration-300 hover:border-accent/30">
      <h3 className="mb-4 font-display text-xl tracking-[4px] text-text-primary uppercase">
        Token Address
      </h3>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <span className="text-text-muted">Current:</span>
        {isTokenSet ? (
          <span className="font-mono text-green-400">{short}</span>
        ) : (
          <span className="text-yellow-400">Not Set</span>
        )}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="0x..."
        className="mb-3 w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-text-primary placeholder-text-muted/50 border border-border-subtle focus:border-accent/40 focus:outline-none font-mono"
      />
      <ActionButton
        onClick={handleSubmit}
        disabled={!isValidAddress || !!isActive.data}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        isError={isError}
        label="Set Token"
      />
      {isActive.data && (
        <p className="mt-2 text-xs text-yellow-400">Deactivate contract first to change token.</p>
      )}
      {isError && (
        <p className="mt-3 text-sm text-red-400">
          {(error as Error)?.message?.includes("User rejected")
            ? "Transaction rejected."
            : (error as Error)?.message?.includes("ContractIsActive")
              ? "Deactivate contract first."
              : "Transaction failed. Please try again."}
        </p>
      )}
    </div>
  );
}

function UpdateClaimAmountCard() {
  const [input, setInput] = useState("");
  const claimAmount = useClaimAmount();
  const { updateClaimAmount, isPending, isConfirming, isConfirmed, isError, error, reset } = useUpdateClaimAmount();

  const parsedAmount = (() => {
    try {
      if (!input || Number(input) <= 0) return null;
      return parseUnits(input, TOKEN_DECIMALS);
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (isConfirmed) {
      claimAmount.refetch();
      setInput("");
      const timer = setTimeout(() => reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  const handleSubmit = () => {
    if (!parsedAmount) return;
    reset();
    updateClaimAmount(parsedAmount);
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 transition-colors duration-300 hover:border-accent/30">
      <h3 className="mb-4 font-display text-xl tracking-[4px] text-text-primary uppercase">
        Claim Amount
      </h3>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <span className="text-text-muted">Current:</span>
        <span className={claimAmount.data && claimAmount.data > BigInt(0) ? "text-green-400" : "text-yellow-400"}>
          {claimAmount.data !== undefined
            ? claimAmount.data > BigInt(0)
              ? `${formatBigInt(claimAmount.data, TOKEN_DECIMALS)} ${TOKEN_SYMBOL}`
              : "Not Set"
            : "—"}
        </span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`e.g. 100000`}
        className="mb-3 w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-text-primary placeholder-text-muted/50 border border-border-subtle focus:border-accent/40 focus:outline-none font-mono"
      />
      <p className="mb-3 text-xs text-text-muted">Enter amount without decimals (e.g. 100000 = 100,000 {TOKEN_SYMBOL})</p>
      <ActionButton
        onClick={handleSubmit}
        disabled={!parsedAmount}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        isError={isError}
        label="Update Claim Amount"
      />
      {isError && (
        <p className="mt-3 text-sm text-red-400">
          {(error as Error)?.message?.includes("User rejected")
            ? "Transaction rejected."
            : "Transaction failed. Please try again."}
        </p>
      )}
    </div>
  );
}

function ToggleActiveCard() {
  const isActive = useIsActive();
  const tokenAddress = useTokenAddress();
  const claimAmount = useClaimAmount();
  const { toggleActive, isPending, isConfirming, isConfirmed, isError, error, reset } = useToggleActive();

  const currentToken = tokenAddress.data as string | undefined;
  const isTokenSet = !!currentToken && currentToken !== ZERO_ADDRESS;
  const isAmountSet = !!claimAmount.data && claimAmount.data > BigInt(0);
  const canActivate = isTokenSet && isAmountSet;

  useEffect(() => {
    if (isConfirmed) {
      isActive.refetch();
      const timer = setTimeout(() => reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  const handleToggle = () => {
    reset();
    toggleActive();
  };

  const active = !!isActive.data;

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 transition-colors duration-300 hover:border-accent/30">
      <h3 className="mb-4 font-display text-xl tracking-[4px] text-text-primary uppercase">
        Contract Status
      </h3>
      <div className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold">
        <span className={`h-3 w-3 rounded-full ${active ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
        <span className={active ? "text-green-400" : "text-red-400"}>
          {active ? "Active" : "Inactive"}
        </span>
      </div>
      {!active && !canActivate && (
        <p className="mb-3 text-center text-xs text-yellow-400">
          Set token address and claim amount before activating.
        </p>
      )}
      <ActionButton
        onClick={handleToggle}
        disabled={!active && !canActivate}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        isError={isError}
        label={active ? "Deactivate" : "Activate"}
      />
      {isError && (
        <p className="mt-3 text-sm text-red-400">
          {(error as Error)?.message?.includes("User rejected")
            ? "Transaction rejected."
            : (error as Error)?.message?.includes("TokenNotSet")
              ? "Token address must be set first."
              : (error as Error)?.message?.includes("ClaimAmountNotSet")
                ? "Claim amount must be set first."
                : "Transaction failed. Please try again."}
        </p>
      )}
    </div>
  );
}

function WhitelistCard({ mode }: { mode: "add" | "remove" }) {
  const [input, setInput] = useState("");
  const add = useAddToWhitelist();
  const remove = useRemoveFromWhitelist();
  const whitelistCount = useWhitelistCount();

  const hook = mode === "add" ? add : remove;
  const addresses = parseAddresses(input);
  const invalidCount =
    input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0).length - addresses.length;

  useEffect(() => {
    if (hook.isConfirmed) {
      whitelistCount.refetch();
      setInput("");
      const timer = setTimeout(() => hook.reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [hook.isConfirmed]);

  const handleSubmit = () => {
    if (addresses.length === 0) return;
    hook.reset();
    if (mode === "add") {
      add.addToWhitelist(addresses);
    } else {
      remove.removeFromWhitelist(addresses);
    }
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 transition-colors duration-300 hover:border-accent/30">
      <h3 className="mb-4 font-display text-xl tracking-[4px] text-text-primary uppercase">
        {mode === "add" ? "Add to Whitelist" : "Remove from Whitelist"}
      </h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter addresses (one per line or comma-separated)"
        className="mb-3 w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-text-primary placeholder-text-muted/50 border border-border-subtle focus:border-accent/40 focus:outline-none resize-y min-h-[100px] font-mono"
      />
      <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
        <span>{addresses.length} valid address{addresses.length !== 1 ? "es" : ""}</span>
        {invalidCount > 0 && (
          <span className="text-red-400">{invalidCount} invalid</span>
        )}
      </div>
      <ActionButton
        onClick={handleSubmit}
        disabled={addresses.length === 0}
        isPending={hook.isPending}
        isConfirming={hook.isConfirming}
        isConfirmed={hook.isConfirmed}
        isError={hook.isError}
        label={mode === "add" ? "Add to Whitelist" : "Remove from Whitelist"}
      />
      {hook.isError && (
        <p className="mt-3 text-sm text-red-400">
          {(hook.error as Error)?.message?.includes("User rejected")
            ? "Transaction rejected."
            : "Transaction failed. Please try again."}
        </p>
      )}
    </div>
  );
}

function AddressStatusTag({
  address,
  onStatusChange,
}: {
  address: `0x${string}`;
  onStatusChange?: (address: `0x${string}`, eligible: boolean) => void;
}) {
  const whitelisted = useIsWhitelisted(address);
  const claimed = useHasClaimed(address);

  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const isLoading = whitelisted.isLoading || claimed.isLoading;
  const isEligible = !isLoading && !!whitelisted.data && !claimed.data;

  useEffect(() => {
    if (!isLoading && onStatusChange) {
      onStatusChange(address, isEligible);
    }
  }, [isLoading, isEligible, address, onStatusChange]);

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs font-mono text-text-muted">
        {short} <span className="h-3 w-3 animate-spin rounded-full border border-text-muted border-t-transparent" />
      </span>
    );
  }

  if (claimed.data) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-400/10 px-2 py-1 text-xs font-mono text-red-400">
        {short} <span>already claimed</span>
      </span>
    );
  }

  if (!whitelisted.data) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-mono text-yellow-400">
        {short} <span>not whitelisted</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-green-400/10 px-2 py-1 text-xs font-mono text-green-400">
      {short} <span>ready</span>
    </span>
  );
}

function ClaimForCard() {
  const [input, setInput] = useState("");
  const [eligibleMap, setEligibleMap] = useState<Record<string, boolean>>({});
  const { batchClaimFor, isPending, isConfirming, isConfirmed, isError, error, reset } = useBatchClaimFor();
  const totalClaimers = useTotalClaimers();
  const totalClaimed = useTotalClaimed();
  const vaultBalance = useVaultBalance();

  const addresses = parseAddresses(input);
  const invalidCount =
    input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0).length - addresses.length;

  const eligibleCount = addresses.filter((a) => eligibleMap[a.toLowerCase()]).length;

  const handleStatusChange = useCallback(
    (address: `0x${string}`, eligible: boolean) => {
      setEligibleMap((prev) => {
        const key = address.toLowerCase();
        if (prev[key] === eligible) return prev;
        return { ...prev, [key]: eligible };
      });
    },
    [],
  );

  // Clear eligibility map when addresses change
  useEffect(() => {
    setEligibleMap({});
  }, [input]);

  useEffect(() => {
    if (isConfirmed) {
      totalClaimers.refetch();
      totalClaimed.refetch();
      vaultBalance.refetch();
      setInput("");
      const timer = setTimeout(() => reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  const handleSubmit = () => {
    if (addresses.length === 0) return;
    reset();
    batchClaimFor(addresses);
  };

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 transition-colors duration-300 hover:border-accent/30">
      <h3 className="mb-4 font-display text-xl tracking-[4px] text-text-primary uppercase">
        Claim For Users
      </h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter addresses (one per line or comma-separated)"
        className="mb-3 w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-text-primary placeholder-text-muted/50 border border-border-subtle focus:border-accent/40 focus:outline-none resize-y min-h-[100px] font-mono"
      />
      <div className="mb-3 flex items-center gap-3 text-xs text-text-muted">
        <span>{addresses.length} valid address{addresses.length !== 1 ? "es" : ""}</span>
        {invalidCount > 0 && (
          <span className="text-red-400">{invalidCount} invalid</span>
        )}
        {addresses.length > 0 && eligibleCount < addresses.length && (
          <span className="text-yellow-400">
            {addresses.length - eligibleCount} will be skipped
          </span>
        )}
        {eligibleCount > 0 && (
          <span className="text-green-400">{eligibleCount} eligible</span>
        )}
      </div>
      {addresses.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {addresses.map((addr) => (
            <AddressStatusTag
              key={addr}
              address={addr}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
      <ActionButton
        onClick={handleSubmit}
        disabled={addresses.length === 0 || eligibleCount === 0}
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        isError={isError}
        label={
          eligibleCount > 1
            ? `Claim For ${eligibleCount} Users`
            : eligibleCount === 1
              ? "Claim For 1 User"
              : "Claim For"
        }
      />
      {isError && (
        <p className="mt-3 text-sm text-red-400">
          {(error as Error)?.message?.includes("User rejected")
            ? "Transaction rejected."
            : (error as Error)?.message?.includes("InsufficientBalance")
              ? "Insufficient vault balance."
              : "Transaction failed. Please try again."}
        </p>
      )}
    </div>
  );
}

export function AdminPanel() {
  const whitelistCount = useWhitelistCount();
  const totalClaimers = useTotalClaimers();
  const totalClaimed = useTotalClaimed();
  const vaultBalance = useVaultBalance();
  const isActive = useIsActive();
  const claimAmount = useClaimAmount();

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Whitelist", value: whitelistCount.data?.toString() ?? "—" },
          { label: "Claimers", value: totalClaimers.data?.toString() ?? "—" },
          {
            label: "Total Claimed",
            value: formatBigInt(totalClaimed.data, TOKEN_DECIMALS),
          },
          {
            label: "Vault Balance",
            value: formatBigInt(vaultBalance.data, TOKEN_DECIMALS),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border-subtle bg-bg-card p-4 text-center"
          >
            <p className="text-xs uppercase tracking-widest text-text-muted">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-2xl text-text-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Contract Configuration */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SetTokenCard />
        <UpdateClaimAmountCard />
        <ToggleActiveCard />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <WhitelistCard mode="add" />
        <WhitelistCard mode="remove" />
      </div>
      <ClaimForCard />
    </div>
  );
}
