"use client";

import { useState } from "react";
import Link from "next/link";
import "../globals.css";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function AllocationsPage() {
  const { data: constituents } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "getConstituents",
  });

  const { data: currentWeightsData } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "getCurrentWeights",
  });

  const { data: totalAssets } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "totalAssets",
  });

  const { data: singleTokenCap } = useScaffoldReadContract({
    contractName: "SafetyModule",
    functionName: "singleTokenCap",
  });

  const { data: maxDeltaPerCycle } = useScaffoldReadContract({
    contractName: "SafetyModule",
    functionName: "maxDeltaPerCycle",
  });

  const { data: larvAISigner } = useScaffoldReadContract({
    contractName: "WeightVerifier",
    functionName: "larvAISigner",
  });

  const tvl = totalAssets ? Number(totalAssets) / 1e6 : 0;

  const tokens = currentWeightsData ? (currentWeightsData as any)[0] as string[] : [];
  const weights = currentWeightsData ? (currentWeightsData as any)[1] as number[] : [];

  const colors = [
    "bg-primary", "bg-secondary", "bg-accent", "bg-info",
    "bg-success", "bg-warning", "bg-error", "bg-neutral",
  ];

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
              <li><Link href="/vault" className="btn btn-sm btn-outline">Deposit</Link></li>
              <li><Link href="/allocations" className="btn btn-sm btn-primary">Allocations</Link></li>
            </ul>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">📊 Allocations</h1>
        <p className="text-center opacity-60 mb-8">Current portfolio weights and safety parameters</p>

        {/* Current Weights */}
        <div className="card bg-base-200 shadow-sm mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Current Allocations</h2>

            {tokens.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <p className="text-lg mb-2">No allocations yet</p>
                <p className="text-sm">Weights will appear after the first LarvAI rebalance.</p>
              </div>
            ) : (
              <>
                {/* Weight Bar */}
                <div className="flex h-8 rounded-lg overflow-hidden mb-4">
                  {tokens.map((token: string, i: number) => {
                    const weight = Number(weights[i]) / 100;
                    if (weight === 0) return null;
                    return (
                      <div
                        key={token}
                        className={`${colors[i % colors.length]} flex items-center justify-center text-xs font-bold text-base-100`}
                        style={{ width: `${weight}%` }}
                        title={`${token.slice(0, 6)}...${token.slice(-4)}: ${weight.toFixed(1)}%`}
                      >
                        {weight >= 5 ? `${weight.toFixed(0)}%` : ""}
                      </div>
                    );
                  })}
                </div>

                {/* Token List */}
                <div className="space-y-2">
                  {tokens.map((token: string, i: number) => {
                    const weight = Number(weights[i]) / 100;
                    return (
                      <div key={token} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${colors[i % colors.length]}`}></div>
                          <span className="font-mono text-sm">{token.slice(0, 6)}...{token.slice(-4)}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold">{weight.toFixed(1)}%</p>
                          <p className="text-xs opacity-50">
                            ~${((weight / 100) * tvl).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Safety Parameters */}
        <div className="card bg-base-200 shadow-sm mb-6">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Safety Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-base-100 rounded-lg">
                <p className="text-xs opacity-60">Max Single Token</p>
                <p className="font-mono font-bold">
                  {singleTokenCap ? `${Number(singleTokenCap) / 100}%` : "—"}
                </p>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                <p className="text-xs opacity-60">Max Delta / Cycle</p>
                <p className="font-mono font-bold">
                  {maxDeltaPerCycle ? `${Number(maxDeltaPerCycle) / 100}%` : "—"}
                </p>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                <p className="text-xs opacity-60">Rebalance Cooldown</p>
                <p className="font-mono font-bold">24 hours</p>
              </div>
              <div className="p-3 bg-base-100 rounded-lg">
                <p className="text-xs opacity-60">Staleness Window</p>
                <p className="font-mono font-bold">90 minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* LarvAI Signer */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">LarvAI Signer</h2>
            {larvAISigner ? (
              <div className="flex items-center gap-2">
                <span className="badge badge-success badge-sm">Verified</span>
                <span className="font-mono text-sm">{String(larvAISigner).slice(0, 6)}...{String(larvAISigner).slice(-4)}</span>
              </div>
            ) : (
              <p className="opacity-50">No signer configured</p>
            )}
            <p className="text-xs opacity-50 mt-2">
              All weight updates must be signed by this address via EIP-712. Permissionless submission — anyone can relay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}