import { useContractRead, useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, VAULT_ABI, SAFETY_MODULE_ABI, WEIGHT_VERIFIER_ABI, USDC_ABI } from "~~/providers";

type ContractName = keyof typeof CONTRACTS;

const CONTRACT_ABIS: Record<string, readonly any[]> = {
  IndexVault: VAULT_ABI,
  SafetyModule: SAFETY_MODULE_ABI,
  WeightVerifier: WEIGHT_VERIFIER_ABI,
  USDC: USDC_ABI,
};

export function useScaffoldReadContract<TAbi extends readonly any[]>(config: {
  contractName: ContractName;
  functionName: string;
  args?: readonly any[];
  watch?: boolean;
}) {
  const abi = CONTRACT_ABIS[config.contractName];
  if (!abi) {
    throw new Error(`Unknown contract: ${config.contractName}`);
  }

  return useContractRead({
    address: CONTRACTS[config.contractName] as `0x${string}`,
    abi,
    functionName: config.functionName,
    args: config.args as any,
    query: {
      enabled: true,
    },
  } as any);
}

export function useScaffoldWriteContract<TAbi extends readonly any[]>(contractName: ContractName) {
  const abi = CONTRACT_ABIS[contractName];
  if (!abi) {
    throw new Error(`Unknown contract: ${contractName}`);
  }

  const { writeContract: _writeContract, data, isPending, error } = useContractWrite();
  const writeContract = (args: { functionName: string; args?: readonly any[]; value?: bigint }) =>
    _writeContract({
      address: CONTRACTS[contractName] as `0x${string}`,
      abi: abi as any,
      ...args,
    } as any);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: data,
  });

  return {
    writeContractAsync: writeContract,
    data,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

export function useDeployedContractInfo(contractName: ContractName) {
  return {
    data: {
      address: CONTRACTS[contractName],
      abi: CONTRACT_ABIS[contractName],
    },
  };
}