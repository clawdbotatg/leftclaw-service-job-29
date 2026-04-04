"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const VaultPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<"deposit" | "redeem">("deposit");
  const [depositAmount, setDepositAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");

  const { data: vaultInfo } = useDeployedContractInfo("IndexVault");
  const vaultAddress = vaultInfo?.address;

  // Vault reads
  const { data: totalAssets } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "totalAssets",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "totalSupply",
  });

  const { data: vaultSymbol } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "symbol",
  });

  const { data: managementFeeBPS } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "managementFeeBPS",
  });

  // User balances
  const { data: userUsdcBalance } = useScaffoldReadContract({
    contractName: "USDC",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: userShareBalance } = useScaffoldReadContract({
    contractName: "IndexVault",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: usdcAllowance } = useScaffoldReadContract({
    contractName: "USDC",
    functionName: "allowance",
    args: [connectedAddress, vaultAddress],
  });

  // Write hooks
  const { writeContractAsync: writeUsdc, isPending: isApproving } = useScaffoldWriteContract("USDC");

  const { writeContractAsync: writeVault, isPending: isVaultPending } = useScaffoldWriteContract("IndexVault");

  // Computed values
  const tvl = totalAssets ? Number(formatUnits(totalAssets, 6)) : 0;
  const shares = totalSupply ? Number(formatUnits(totalSupply, 18)) : 0;
  const navPerShare = shares > 0 ? tvl / shares : 1;
  const feePercent = managementFeeBPS ? Number(managementFeeBPS) / 100 : 1;

  const depositAmountParsed = depositAmount ? parseUnits(depositAmount, 6) : 0n;
  const redeemAmountParsed = redeemAmount ? parseUnits(redeemAmount, 18) : 0n;

  const needsApproval = depositAmountParsed > 0n && (usdcAllowance === undefined || usdcAllowance < depositAmountParsed);

  const estimatedShares = depositAmount ? Number(depositAmount) / navPerShare : 0;
  const estimatedUsdc = redeemAmount ? Number(redeemAmount) * navPerShare : 0;

  const userUsdcDisplay = userUsdcBalance ? Number(formatUnits(userUsdcBalance, 6)) : 0;
  const userShareDisplay = userShareBalance ? Number(formatUnits(userShareBalance, 18)) : 0;

  const insufficientUsdc = depositAmountParsed > 0n && userUsdcBalance !== undefined && depositAmountParsed > userUsdcBalance;
  const insufficientShares = redeemAmountParsed > 0n && userShareBalance !== undefined && redeemAmountParsed > userShareBalance;

  // Handlers
  const handleApprove = async () => {
    try {
      await writeUsdc({
        functionName: "approve",
        args: [vaultAddress, depositAmountParsed],
      });
      notification.success("USDC approved!");
    } catch (e: any) {
      notification.error("Approval failed: " + (e?.shortMessage || e?.message || "Unknown error"));
    }
  };

  const handleDeposit = async () => {
    try {
      await writeVault({
        functionName: "deposit",
        args: [depositAmountParsed, connectedAddress],
      });
      notification.success(`Deposited ${depositAmount} USDC`);
      setDepositAmount("");
    } catch (e: any) {
      notification.error("Deposit failed: " + (e?.shortMessage || e?.message || "Unknown error"));
    }
  };

  const handleRedeem = async () => {
    try {
      await writeVault({
        functionName: "redeem",
        args: [redeemAmountParsed, connectedAddress, connectedAddress],
      });
      notification.success(`Redeemed ${redeemAmount} shares`);
      setRedeemAmount("");
    } catch (e: any) {
      notification.error("Redeem failed: " + (e?.shortMessage || e?.message || "Unknown error"));
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10 px-4">
      <div className="max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-2">🦞 Vault</h1>
        <p className="text-center opacity-60 mb-6">Deposit USDC or redeem {vaultSymbol || "cDEX"} shares</p>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-3">
              <p className="text-xs opacity-60">NAV / Share</p>
              <p className="font-mono font-bold">${navPerShare.toFixed(4)}</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-3">
              <p className="text-xs opacity-60">Mgmt Fee</p>
              <p className="font-mono font-bold">{feePercent}% / year</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="tabs tabs-boxed mb-6 justify-center">
          <button
            className={`tab ${activeTab === "deposit" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("deposit")}
          >
            Deposit
          </button>
          <button
            className={`tab ${activeTab === "redeem" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("redeem")}
          >
            Redeem
          </button>
        </div>

        {/* Deposit Tab */}
        {activeTab === "deposit" && (
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              {!connectedAddress ? (
                <p className="text-center opacity-50 py-4">Connect your wallet to deposit</p>
              ) : (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">USDC Amount</span>
                      <span className="label-text-alt">
                        Balance: {userUsdcDisplay.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC
                      </span>
                    </label>
                    <div className="join w-full">
                      <input
                        type="number"
                        placeholder="0.00"
                        className={`input input-bordered join-item flex-1 ${insufficientUsdc ? "input-error" : ""}`}
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      <button
                        className="btn join-item btn-sm"
                        onClick={() => userUsdcBalance && setDepositAmount(formatUnits(userUsdcBalance, 6))}
                      >
                        MAX
                      </button>
                    </div>
                    {insufficientUsdc && (
                      <label className="label">
                        <span className="label-text-alt text-error">Insufficient USDC balance</span>
                      </label>
                    )}
                  </div>

                  {/* Estimate */}
                  {depositAmount && Number(depositAmount) > 0 && (
                    <div className="mt-3 p-3 bg-base-100 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span className="opacity-60">Estimated shares</span>
                        <span className="font-mono">
                          {estimatedShares.toLocaleString(undefined, { maximumFractionDigits: 4 })} {vaultSymbol || "cDEX"}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="opacity-60">NAV / share</span>
                        <span className="font-mono">${navPerShare.toFixed(4)}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4">
                    {needsApproval ? (
                      <button
                        className="btn btn-primary w-full"
                        disabled={isApproving || !depositAmount || Number(depositAmount) <= 0 || insufficientUsdc}
                        onClick={handleApprove}
                      >
                        {isApproving ? (
                          <><span className="loading loading-spinner loading-sm"></span> Approving...</>
                        ) : (
                          "Approve USDC"
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-full"
                        disabled={isVaultPending || !depositAmount || Number(depositAmount) <= 0 || insufficientUsdc}
                        onClick={handleDeposit}
                      >
                        {isVaultPending ? (
                          <><span className="loading loading-spinner loading-sm"></span> Depositing...</>
                        ) : !depositAmount || Number(depositAmount) <= 0 ? (
                          "Enter amount"
                        ) : (
                          `Deposit ${depositAmount} USDC`
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Redeem Tab */}
        {activeTab === "redeem" && (
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              {!connectedAddress ? (
                <p className="text-center opacity-50 py-4">Connect your wallet to redeem</p>
              ) : (
                <>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{vaultSymbol || "cDEX"} Shares</span>
                      <span className="label-text-alt">
                        Balance: {userShareDisplay.toLocaleString(undefined, { maximumFractionDigits: 4 })} {vaultSymbol || "cDEX"}
                      </span>
                    </label>
                    <div className="join w-full">
                      <input
                        type="number"
                        placeholder="0.0000"
                        className={`input input-bordered join-item flex-1 ${insufficientShares ? "input-error" : ""}`}
                        value={redeemAmount}
                        onChange={e => setRedeemAmount(e.target.value)}
                        min="0"
                        step="0.0001"
                      />
                      <button
                        className="btn join-item btn-sm"
                        onClick={() => userShareBalance && setRedeemAmount(formatUnits(userShareBalance, 18))}
                      >
                        MAX
                      </button>
                    </div>
                    {insufficientShares && (
                      <label className="label">
                        <span className="label-text-alt text-error">Insufficient share balance</span>
                      </label>
                    )}
                  </div>

                  {/* Estimate */}
                  {redeemAmount && Number(redeemAmount) > 0 && (
                    <div className="mt-3 p-3 bg-base-100 rounded-lg text-sm">
                      <div className="flex justify-between">
                        <span className="opacity-60">Estimated USDC</span>
                        <span className="font-mono">
                          ${estimatedUsdc.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4">
                    <button
                      className="btn btn-primary w-full"
                      disabled={isVaultPending || !redeemAmount || Number(redeemAmount) <= 0 || insufficientShares}
                      onClick={handleRedeem}
                    >
                      {isVaultPending ? (
                        <><span className="loading loading-spinner loading-sm"></span> Redeeming...</>
                      ) : !redeemAmount || Number(redeemAmount) <= 0 ? (
                        "Enter amount"
                      ) : (
                        `Redeem ${redeemAmount} ${vaultSymbol || "cDEX"}`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* User Position */}
        {connectedAddress && userShareDisplay > 0 && (
          <div className="card bg-base-200 shadow-sm mt-6">
            <div className="card-body">
              <h3 className="card-title text-sm">Your Position</h3>
              <div className="flex justify-between">
                <span className="opacity-60">Shares held</span>
                <span className="font-mono">
                  {userShareDisplay.toLocaleString(undefined, { maximumFractionDigits: 4 })} {vaultSymbol || "cDEX"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Value (~USD)</span>
                <span className="font-mono">
                  ${(userShareDisplay * navPerShare).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultPage;
