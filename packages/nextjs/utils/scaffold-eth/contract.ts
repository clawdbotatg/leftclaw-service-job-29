export interface GenericContractsDeclaration {
  [chainId: number]: {
    [contractName: string]: {
      address: string;
      abi: readonly any[];
    };
  };
}