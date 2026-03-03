import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  walletConnectWallet,
  trustWallet,
  tokenPocketWallet,
  okxWallet,
  binanceWallet

} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { bsc, bscTestnet, mainnet } from "wagmi/chains";

const chainMap = {
  1: mainnet,
  56: bsc,
  97: bscTestnet,
} as const;

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || "56");
const activeChain =
  chainMap[chainId as keyof typeof chainMap] || bsc;

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, trustWallet, tokenPocketWallet, walletConnectWallet, okxWallet, binanceWallet],
    },
  ],
  { appName: "Token Claim", projectId },
);

export const config = createConfig({
  connectors,
  chains: [activeChain],
  transports: {
    [activeChain.id]: http(),
  },
  ssr: true,
});
