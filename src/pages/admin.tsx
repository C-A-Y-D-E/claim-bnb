import Head from "next/head";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import { AdminPanel } from "@/components/AdminPanel";
import { useOwner } from "@/hooks/useClaimContract";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const owner = useOwner();

  const isOwner =
    isConnected &&
    address &&
    owner.data &&
    address.toLowerCase() === (owner.data as string).toLowerCase();

  return (
    <>
      <Head>
        <title>Admin — Token Claim</title>
        <meta name="description" content="Admin dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center gap-6 pt-20">
              <p className="font-display text-2xl tracking-[4px] text-text-muted uppercase">
                Connect Wallet
              </p>
              <p className="text-sm text-text-muted/70">
                Connect your wallet to access the admin panel.
              </p>
              <ConnectButton />
            </div>
          ) : owner.isLoading ? (
            <div className="flex items-center justify-center pt-20">
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : !isOwner ? (
            <div className="flex flex-col items-center justify-center gap-4 pt-20">
              <p className="font-display text-2xl tracking-[4px] text-red-400 uppercase">
                Access Denied
              </p>
              <p className="text-sm text-text-muted/70">
                Only the contract owner can access this page.
              </p>
            </div>
          ) : (
            <>
              <h1 className="mb-8 text-center font-display text-4xl tracking-[8px] text-accent uppercase">
                Admin Panel
              </h1>
              <AdminPanel />
            </>
          )}
        </div>
      </main>
    </>
  );
}
