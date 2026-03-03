import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StatusBadge } from "./StatusBadge";
import {
  useIsActive,
  useClaimAmount,
  useIsWhitelisted,
  useHasClaimed,
  useCanClaim,
  useClaimTokens,
  useTotalClaimed,
  useTotalClaimers,
  useVaultBalance,
  useClaimCooldown,
  useLastClaimTimestamp,
} from "@/hooks/useClaimContract";

const TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || "18");
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "TOKEN";

function getErrorMessage(error: Error | null): string | null {
  if (!error) return null;
  const msg = error.message || "";
  if (msg.includes("User rejected") || msg.includes("user rejected"))
    return "Transaction was rejected.";
  if (msg.includes("NotActive") || msg.includes("not active"))
    return "Claiming is currently paused.";
  if (msg.includes("NotWhitelisted"))
    return "Your address is not whitelisted.";
  if (msg.includes("AlreadyClaimed"))
    return "You have already claimed your tokens.";
  if (msg.includes("InsufficientBalance"))
    return "The vault does not have enough tokens.";
  if (msg.includes("CooldownNotElapsed"))
    return "Global cooldown active. Please wait and try again.";
  if (msg.includes("reverted") || msg.includes("revert"))
    return "Transaction reverted on-chain. Please try again.";
  return "An unexpected error occurred. Please try again.";
}

export function ClaimCard() {
  const { address, isConnected } = useAccount();
  const isActive = useIsActive();
  const claimAmount = useClaimAmount();
  const isWhitelisted = useIsWhitelisted(address);
  const hasClaimed = useHasClaimed(address);
  const canClaim = useCanClaim(address);
  const totalClaimed = useTotalClaimed();
  const totalClaimers = useTotalClaimers();
  const vaultBalance = useVaultBalance();
  const claimCooldown = useClaimCooldown();
  const lastClaimTimestamp = useLastClaimTimestamp();
  const { claim, isPending, isConfirming, isConfirmed, isError, error, reset } =
    useClaimTokens();

  // Cooldown countdown timer
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (
      claimCooldown.data === undefined ||
      lastClaimTimestamp.data === undefined
    )
      return;

    const cooldown = Number(claimCooldown.data);
    const lastClaim = Number(lastClaimTimestamp.data);

    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - lastClaim;
      const remaining = Math.max(0, cooldown - elapsed);
      setCooldownRemaining(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [claimCooldown.data, lastClaimTimestamp.data]);

  // Refetch data after successful claim
  useEffect(() => {
    if (isConfirmed) {
      hasClaimed.refetch();
      canClaim.refetch();
      totalClaimed.refetch();
      totalClaimers.refetch();
      vaultBalance.refetch();
      lastClaimTimestamp.refetch();
    }
  }, [isConfirmed]);

  const formattedAmount =
    claimAmount.data !== undefined
      ? Number(formatUnits(claimAmount.data, TOKEN_DECIMALS)).toLocaleString()
      : "—";

  // Determine button state
  const getButtonConfig = () => {
    if (!isConnected) {
      return { text: "Connect Wallet", disabled: true, style: "muted" };
    }
    if (isConfirmed) {
      return {
        text: "Claimed Successfully!",
        disabled: true,
        style: "success",
      };
    }
    if (isError) {
      return { text: "Claim Tokens", disabled: false, style: "active" };
    }
    if (isConfirming) {
      return { text: "Confirming...", disabled: true, style: "loading" };
    }
    if (isPending) {
      return {
        text: "Waiting for Confirmation...",
        disabled: true,
        style: "loading",
      };
    }
    if (isActive.data === false) {
      return { text: "Claiming Paused", disabled: true, style: "muted" };
    }
    if (cooldownRemaining > 0) {
      return {
        text: `Cooldown ${cooldownRemaining}s...`,
        disabled: true,
        style: "loading",
      };
    }
    if (isWhitelisted.data === false) {
      return { text: "Not Whitelisted", disabled: true, style: "muted" };
    }
    if (hasClaimed.data === true) {
      return { text: "Already Claimed", disabled: true, style: "muted" };
    }
    if (canClaim.data === true) {
      return { text: "Claim Tokens", disabled: false, style: "active" };
    }
    return { text: "Claim Tokens", disabled: true, style: "muted" };
  };

  const buttonConfig = getButtonConfig();

  const buttonClasses =
    buttonConfig.style === "active"
      ? "w-full rounded-xl bg-accent py-4 text-lg font-semibold text-bg-primary transition-all duration-300 hover:brightness-110 shadow-[0_0_20px_rgba(255,122,26,0.3)] hover:shadow-[0_0_30px_rgba(255,122,26,0.5)] cursor-pointer"
      : buttonConfig.style === "success"
        ? "w-full rounded-xl bg-green-500 py-4 text-lg font-semibold text-bg-primary cursor-default"
        : buttonConfig.style === "loading"
          ? "w-full rounded-xl bg-accent/60 py-4 text-lg font-semibold text-bg-primary animate-pulse cursor-wait"
          : "w-full rounded-xl bg-white/5 py-4 text-lg font-semibold text-text-muted border border-border-subtle cursor-not-allowed";

  return (
    <div className="mt-12 animate-[fade-up_0.7s_ease_0.3s_forwards] opacity-0">
      <div className="rounded-2xl border border-border-subtle bg-bg-card p-8 transition-colors duration-300 hover:border-accent/30 md:p-12">
        {/* Status Row */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {isActive.data !== undefined && (
            <StatusBadge variant={isActive.data ? "active" : "inactive"} />
          )}
          {isConnected && hasClaimed.data === true ? (
            <StatusBadge variant="claimed" />
          ) : (
            isConnected && isWhitelisted.data !== undefined && (
              <StatusBadge
                variant={isWhitelisted.data ? "whitelisted" : "notWhitelisted"}
              />
            )
          )}
        </div>

        {/* Claim Amount Display */}
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-text-muted">
            Claim Amount
          </p>
          <p className="mt-2 font-display text-5xl text-accent-secondary md:text-6xl">
            {formattedAmount}
          </p>
          <p className="mt-1 text-sm text-text-muted">{TOKEN_SYMBOL}</p>
        </div>

        {/* Connect prompt or Claim button */}
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-text-muted">
              Connect your wallet to check eligibility
            </p>
            <ConnectButton />
          </div>
        ) : (
          <button
            onClick={() => {
              if (!buttonConfig.disabled) {
                reset();
                claim();
              }
            }}
            disabled={buttonConfig.disabled}
            className={buttonClasses}
          >
            {(isPending || isConfirming) && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg-primary border-t-transparent align-middle" />
            )}
            {buttonConfig.text}
          </button>
        )}

        {/* Error Message */}
        {isError && (
          <p className="mt-4 text-center text-sm text-red-400">
            {getErrorMessage(error as Error)}
          </p>
        )}

        {/* Success Message */}
        {isConfirmed && (
          <p className="mt-4 text-center text-sm text-green-400">
            Tokens have been sent to your wallet!
          </p>
        )}
      </div>
    </div>
  );
}
