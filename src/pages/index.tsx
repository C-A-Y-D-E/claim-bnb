import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ClaimCard } from "@/components/ClaimCard";
import { StatsGrid } from "@/components/StatsGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Token Claim</title>
        <meta name="description" content="Claim your allocated tokens" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <ClaimCard />
          {/*<StatsGrid />*/}
        </div>
      </main>

      {/*<Footer />*/}
    </>
  );
}
