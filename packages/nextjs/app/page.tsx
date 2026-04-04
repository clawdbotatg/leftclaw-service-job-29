"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { formatUnits } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { data: vaults } = useScaffoldReadContract({
    contractName: "IndexFactory",
    functionName: "getVaults",
  });

  const { data: vaultCount } = useScaffoldReadContract({
    contractName: "IndexFactory",
    functionName: "getVaultCount",
  });

  const { data: totalStaked } = useScaffoldReadContract({
    contractName: "CLAWDFeeDistributor",
    functionName: "totalStaked",
  });

  const { data: totalBurned } = useScaffoldReadContract({
    contractName: "CLAWDFeeDistributor",
    functionName: "totalBurned",
  });

  return (
    <div className="flex items-center flex-col grow pt-10 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">&#x1F99E; ClawDex</h1>
          <p className="text-lg opacity-70">AI-Governed Base Ecosystem Index</p>
          <p className="text-sm opacity-50 mt-2 max-w-xl mx-auto">
            Deposit USDC for diversified exposure to Base ecosystem tokens. LarvAI determines portfolio weights. Onchain
            safety rails constrain every decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm opacity-60">Active Vaults</h3>
              <p className="text-2xl font-mono font-bold">{vaultCount !== undefined ? vaultCount.toString() : "\u2014"}</p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm opacity-60">CLAWD Staked</h3>
              <p className="text-2xl font-mono font-bold">
                {totalStaked !== undefined
                  ? Number(formatUnits(totalStaked, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : "\u2014"}
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-sm opacity-60">USDC Burned (Accumulated)</h3>
              <p className="text-2xl font-mono font-bold">
                {totalBurned !== undefined
                  ? `$${Number(formatUnits(totalBurned, 6)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                  : "\u2014"}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Index Vaults</h2>

            {!vaults || vaults.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <p className="text-lg mb-2">No vaults deployed yet</p>
                <p className="text-sm">The guardian must deploy a vault via the Admin page before users can deposit.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vaults.map((vaultAddr: string, i: number) => (
                  <div key={vaultAddr} className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                    <div>
                      <h3 className="font-bold">Vault #{i + 1}</h3>
                      <p className="text-xs font-mono opacity-50">
                        {vaultAddr.slice(0, 6)}...{vaultAddr.slice(-4)}
                      </p>
                    </div>
                    <Link href="/vault" className="btn btn-primary btn-sm">
                      Deposit / Redeem
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl mb-2">1&#xFE0F;&#x20E3;</div>
                <h3 className="font-bold mb-1">Deposit USDC</h3>
                <p className="text-sm opacity-70">
                  Deposit USDC into an index vault. Receive shares representing your pro-rata claim on the basket.
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">2&#xFE0F;&#x20E3;</div>
                <h3 className="font-bold mb-1">AI Rebalances</h3>
                <p className="text-sm opacity-70">
                  LarvAI signs weight vectors via EIP-712. Onchain safety rails enforce allocation caps and delta limits.
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">3&#xFE0F;&#x20E3;</div>
                <h3 className="font-bold mb-1">Redeem Anytime</h3>
                <p className="text-sm opacity-70">
                  Burn shares to receive USDC. User exits are always open. Pause only affects rebalancing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
