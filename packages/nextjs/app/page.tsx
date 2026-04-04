"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { data: totalAssets } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "totalAssets",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "totalSupply",
  });

  const { data: vaultName } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "name",
  });

  const { data: vaultSymbol } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "symbol",
  });

  const { data: constituents } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "getConstituents",
  });

  const tvl = totalAssets ? Number(formatUnits(totalAssets, 6)) : 0;
  const shares = totalSupply ? Number(formatUnits(totalSupply, 18)) : 0;
  const navPerShare = shares > 0 ? tvl / shares : 1;

  return (
    <div className="flex items-center flex-col grow pt-10 px-4">
      <div className="max-w-4xl w-full">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">🦞 ClawDex</h1>
          <p className="text-lg opacity-70">AI-Governed Base Ecosystem Index</p>
          <p className="text-sm opacity-50 mt-2 max-w-xl mx-auto">
            Deposit USDC for diversified exposure to Base ecosystem tokens. LarvAI determines portfolio weights.
            Onchain safety rails constrain every decision.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm opacity-60">Total Value Locked</h3>
              <p className="text-2xl font-mono font-bold">
                ${tvl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm opacity-60">NAV / Share</h3>
              <p className="text-2xl font-mono font-bold">
                ${navPerShare.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm opacity-60">Constituents</h3>
              <p className="text-2xl font-mono font-bold">
                {constituents !== undefined ? constituents.length.toString() : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Vault Card */}
        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">
              {vaultName || "Index Vault"} ({vaultSymbol || "cDEX"})
            </h2>

            {tvl === 0 ? (
              <div className="text-center py-8 opacity-50">
                <p className="text-lg mb-2">Vault is empty</p>
                <p className="text-sm">Be the first to deposit USDC and receive index shares.</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                <div>
                  <p className="font-bold">TVL: ${tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className="text-sm opacity-60">
                    {shares.toLocaleString(undefined, { maximumFractionDigits: 4 })} shares outstanding
                  </p>
                </div>
                <Link href="/vault" className="btn btn-primary btn-sm">
                  Deposit / Redeem
                </Link>
              </div>
            )}

            {tvl === 0 && (
              <div className="mt-4 text-center">
                <Link href="/vault" className="btn btn-primary">
                  Deposit USDC
                </Link>
              </div>
            )}
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
          <Link href="/vault" className="btn btn-outline btn-sm">
            Deposit / Redeem
          </Link>
          <Link href="/allocations" className="btn btn-outline btn-sm">
            View Allocations
          </Link>
          <Link href="/admin" className="btn btn-outline btn-sm">
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
