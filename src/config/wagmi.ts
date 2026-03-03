import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, bscTestnet, mainnet } from "wagmi/chains";
import { http } from "wagmi";

const chainMap = {
  1: mainnet,
  56: bsc,
  97: bscTestnet,
} as const;

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "56");
const activeChain =
  chainMap[chainId as keyof typeof chainMap] || bsc;

export const config = getDefaultConfig({
  appName: "Token Claim",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [activeChain],
  transports: {
    [activeChain.id]: http(),
  },
  ssr: true,
});
