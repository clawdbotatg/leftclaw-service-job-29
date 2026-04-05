"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode, useState } from "react";

// Deployed contract addresses on Base
const CONTRACTS = {
  AssetRegistry: "0x3264641b19d56a2b5488063d976890d744cac693",
  RouterRegistry: "0xa458bd089ed50caec0997a814caaf654778eb6e9",
  SafetyModule: "0x5ad56df56918b09d91d1410881595588e61a2359",
  WeightVerifier: "0xc7f7679639d64db9a75ab6595c05a239f4c15a3e",
  CLAWDFeeDistributor: "0xa00588e2772a70e349e2f46a3be49c00b70c5870",
  IndexFactory: "0x6d27591f496787f175c52b920804bfe6e427bbcf",
  IndexVault: "0xada99b4f64f88ba657fe85e25c6c3598b87a381d",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
} as const;

// ABI fragments for contracts
const VAULT_ABI = [
  { name: "totalAssets", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "totalSupply", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { name: "getConstituents", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address[]" }] },
  { name: "getCurrentWeights", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address[]" }, { name: "", type: "uint256[]" }] },
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "deposit", type: "function", stateMutability: "nonpayable", inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "redeem", type: "function", stateMutability: "nonpayable", inputs: [{ name: "shares", type: "uint256" }, { name: "receiver", type: "address" }, { name: "owner", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "managementFeeBPS", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
] as const;

const SAFETY_MODULE_ABI = [
  { name: "singleTokenCap", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  { name: "maxDeltaPerCycle", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
] as const;

const WEIGHT_VERIFIER_ABI = [
  { name: "larvAISigner", type: "function", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
] as const;

const USDC_ABI = [
  { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "allowance", type: "function", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ name: "", type: "bool" }] },
] as const;

export { CONTRACTS, VAULT_ABI, SAFETY_MODULE_ABI, WEIGHT_VERIFIER_ABI, USDC_ABI };

const wagmiConfig = getDefaultConfig({
  appName: "ClawDex",
  projectId: "clawdex-dashboard",
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}