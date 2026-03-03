import Image from "next/image";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center animate-[fade-up_0.7s_ease_forwards]">
      {/* Logo with glow ring */}
      <div className="relative mb-8">
        <div className="h-28 w-28 rounded-full border-2 border-accent/30 animate-[pulse-glow_5s_ease-in-out_infinite] overflow-hidden">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={112}
            height={112}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <h1 className="font-display text-5xl tracking-[8px] text-text-primary uppercase md:text-7xl">
        $PUNCH
      </h1>
      <p className="mt-4 max-w-md text-text-muted text-lg">
        Connect your wallet to check eligibility and claim your allocated
        tokens.
      </p>
    </section>
  );
}
