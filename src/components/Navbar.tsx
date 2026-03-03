import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-bg-primary/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="https://punch-bnb.com/"
          target="_blank"
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display text-2xl tracking-[6px] text-accent uppercase">
            PUNCH
          </span>
        </a>
        <ConnectButton />
      </div>
    </nav>
  );
}
