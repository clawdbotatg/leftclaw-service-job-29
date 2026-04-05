import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <div className="flex items-center flex-col grow pt-10 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="navbar bg-base-200 mb-8 rounded-lg">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">🦞</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 gap-2">
              <li><Link href="/vault" className="btn btn-sm btn-primary">Deposit</Link></li>
              <li><Link href="/allocations" className="btn btn-sm btn-outline">Allocations</Link></li>
            </ul>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">🦞 ClawDex</h1>
          <p className="text-lg opacity-70">AI-Governed Base Ecosystem Index</p>
          <p className="text-sm opacity-50 mt-2 max-w-xl mx-auto">
            Deposit USDC for diversified exposure to Base ecosystem tokens. LarvAI determines portfolio weights.
            Onchain safety rails constrain every decision.
          </p>
        </div>

        {/* Vault Card */}
        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Index Vault</h2>
            <div className="text-center py-8 opacity-50">
              <p className="text-lg mb-2">Connect wallet to view vault stats</p>
              <p className="text-sm">Deposit USDC to receive index shares and gain diversified exposure.</p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/vault" className="btn btn-primary">Deposit USDC</Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl mb-2">1️⃣</div>
                <h3 className="font-bold mb-1">Deposit USDC</h3>
                <p className="text-sm opacity-70">
                  Deposit USDC into the index vault. Receive shares representing your pro-rata claim on the basket.
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">2️⃣</div>
                <h3 className="font-bold mb-1">AI Rebalances</h3>
                <p className="text-sm opacity-70">
                  LarvAI signs weight vectors via EIP-712. Onchain safety rails enforce allocation caps and delta limits.
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">3️⃣</div>
                <h3 className="font-bold mb-1">Redeem Anytime</h3>
                <p className="text-sm opacity-70">
                  Burn shares to receive USDC. User exits are always open — pause only affects rebalancing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/vault" className="btn btn-outline btn-sm">Deposit / Redeem</Link>
          <Link href="/allocations" className="btn btn-outline btn-sm">View Allocations</Link>
        </div>
      </div>
    </div>
  );
}