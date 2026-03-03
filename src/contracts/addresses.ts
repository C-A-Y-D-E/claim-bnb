export const TOKEN_CLAIM_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  undefined) as `0x${string}` | undefined;

export const isConfigured =
  !!TOKEN_CLAIM_ADDRESS &&
  TOKEN_CLAIM_ADDRESS !== "0xYourDeployedContractAddress";
