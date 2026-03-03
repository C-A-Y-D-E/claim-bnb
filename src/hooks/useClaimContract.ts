import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { tokenClaimAbi } from "@/contracts/tokenClaimAbi";
import { TOKEN_CLAIM_ADDRESS } from "@/contracts/addresses";

const contractConfig = {
  address: TOKEN_CLAIM_ADDRESS!,
  abi: tokenClaimAbi,
} as const;

export function useIsActive() {
  return useReadContract({
    ...contractConfig,
    functionName: "isActive",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useClaimAmount() {
  return useReadContract({
    ...contractConfig,
    functionName: "claimAmount",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useTotalClaimed() {
  return useReadContract({
    ...contractConfig,
    functionName: "totalClaimed",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useTotalClaimers() {
  return useReadContract({
    ...contractConfig,
    functionName: "totalClaimers",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useWhitelistCount() {
  return useReadContract({
    ...contractConfig,
    functionName: "whitelistCount",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useVaultBalance() {
  return useReadContract({
    ...contractConfig,
    functionName: "vaultBalance",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useClaimCooldown() {
  return useReadContract({
    ...contractConfig,
    functionName: "claimCooldown",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useLastClaimTimestamp() {
  return useReadContract({
    ...contractConfig,
    functionName: "lastClaimTimestamp",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useIsWhitelisted(address: `0x${string}` | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "whitelisted",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useHasClaimed(address: `0x${string}` | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "hasClaimed",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useCanClaim(address: `0x${string}` | undefined) {
  return useReadContract({
    ...contractConfig,
    functionName: "canClaim",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useClaimTokens() {
  const {
    writeContract,
    data: hash,
    isPending,
    isError: isWriteError,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const claim = () => {
    writeContract({
      ...contractConfig,
      functionName: "claim",
    });
  };

  return {
    claim,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isError: isWriteError || isReceiptError,
    error: writeError || receiptError,
    reset,
  };
}

// ---- Admin hooks ----

export function useOwner() {
  return useReadContract({
    ...contractConfig,
    functionName: "owner",
    query: { enabled: !!TOKEN_CLAIM_ADDRESS },
  });
}

export function useAddToWhitelist() {
  const { writeContract, data: hash, isPending, isError: isWriteError, error: writeError, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isReceiptError, error: receiptError } =
    useWaitForTransactionReceipt({ hash });

  const addToWhitelist = (accounts: `0x${string}`[]) => {
    writeContract({
      ...contractConfig,
      functionName: "addToWhitelist",
      args: [accounts],
    });
  };

  return { addToWhitelist, hash, isPending, isConfirming, isConfirmed, isError: isWriteError || isReceiptError, error: writeError || receiptError, reset };
}

export function useRemoveFromWhitelist() {
  const { writeContract, data: hash, isPending, isError: isWriteError, error: writeError, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isReceiptError, error: receiptError } =
    useWaitForTransactionReceipt({ hash });

  const removeFromWhitelist = (accounts: `0x${string}`[]) => {
    writeContract({
      ...contractConfig,
      functionName: "removeFromWhitelist",
      args: [accounts],
    });
  };

  return { removeFromWhitelist, hash, isPending, isConfirming, isConfirmed, isError: isWriteError || isReceiptError, error: writeError || receiptError, reset };
}

export function useClaimFor() {
  const { writeContract, data: hash, isPending, isError: isWriteError, error: writeError, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isReceiptError, error: receiptError } =
    useWaitForTransactionReceipt({ hash });

  const claimFor = (account: `0x${string}`) => {
    writeContract({
      ...contractConfig,
      functionName: "claimFor",
      args: [account],
    });
  };

  return { claimFor, hash, isPending, isConfirming, isConfirmed, isError: isWriteError || isReceiptError, error: writeError || receiptError, reset };
}

export function useBatchClaimFor() {
  const { writeContract, data: hash, isPending, isError: isWriteError, error: writeError, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isReceiptError, error: receiptError } =
    useWaitForTransactionReceipt({ hash });

  const batchClaimFor = (accounts: `0x${string}`[]) => {
    writeContract({
      ...contractConfig,
      functionName: "batchClaimFor",
      args: [accounts],
    });
  };

  return { batchClaimFor, hash, isPending, isConfirming, isConfirmed, isError: isWriteError || isReceiptError, error: writeError || receiptError, reset };
}

export function useClaimDashboard() {
  const { address } = useAccount();

  const isActive = useIsActive();
  const claimAmount = useClaimAmount();
  const totalClaimed = useTotalClaimed();
  const totalClaimers = useTotalClaimers();
  const whitelistCount = useWhitelistCount();
  const vaultBalance = useVaultBalance();
  const isWhitelisted = useIsWhitelisted(address);
  const hasClaimed = useHasClaimed(address);
  const canClaim = useCanClaim(address);

  return {
    address,
    isActive,
    claimAmount,
    totalClaimed,
    totalClaimers,
    whitelistCount,
    vaultBalance,
    isWhitelisted,
    hasClaimed,
    canClaim,
  };
}
