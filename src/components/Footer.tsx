import { TOKEN_CLAIM_ADDRESS } from "@/contracts/addresses";

export function Footer() {
  const truncated = TOKEN_CLAIM_ADDRESS
    ? `${TOKEN_CLAIM_ADDRESS.slice(0, 6)}...${TOKEN_CLAIM_ADDRESS.slice(-4)}`
    : "Not configured";

  return (
    <footer className="border-t border-border-subtle py-8">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm text-text-muted">
          Contract:{" "}
          <span className="font-mono text-accent-secondary">{truncated}</span>
        </p>
        <p className="mt-2 text-xs text-text-muted/50">
          Token Claim &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
