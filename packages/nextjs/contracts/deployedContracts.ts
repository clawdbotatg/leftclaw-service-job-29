import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  8453: {
    AssetRegistry: {
      address: "0x3264641b19d56a2b5488063d976890d744cac693",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "getTokenInfo",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "tuple",
                        "internalType": "struct AssetRegistry.TokenInfo",
                        "components": [
                              {
                                    "name": "priceFeed",
                                    "type": "address",
                                    "internalType": "address"
                              },
                              {
                                    "name": "tokenDecimals",
                                    "type": "uint8",
                                    "internalType": "uint8"
                              },
                              {
                                    "name": "priceFeedDecimals",
                                    "type": "uint8",
                                    "internalType": "uint8"
                              },
                              {
                                    "name": "deployerGroupId",
                                    "type": "uint8",
                                    "internalType": "uint8"
                              },
                              {
                                    "name": "preferredRouterId",
                                    "type": "uint256",
                                    "internalType": "uint256"
                              },
                              {
                                    "name": "minLiquidity",
                                    "type": "uint256",
                                    "internalType": "uint256"
                              },
                              {
                                    "name": "active",
                                    "type": "bool",
                                    "internalType": "bool"
                              }
                        ]
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getWhitelistedCount",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getWhitelistedTokens",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address[]",
                        "internalType": "address[]"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "isEligibleForIndex",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "isWhitelisted",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "removeToken",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setIndexEligibility",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "indexId",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "eligible",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                  {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "updateToken",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "priceFeed",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "deployerGroupId",
                        "type": "uint8",
                        "internalType": "uint8"
                  },
                  {
                        "name": "preferredRouterId",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "minLiquidity",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "whitelistToken",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "priceFeed",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "deployerGroupId",
                        "type": "uint8",
                        "internalType": "uint8"
                  },
                  {
                        "name": "preferredRouterId",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "minLiquidity",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "whitelistedTokens",
            "inputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "event",
            "name": "IndexEligibilitySet",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "indexId",
                        "type": "uint256",
                        "indexed": true,
                        "internalType": "uint256"
                  },
                  {
                        "name": "eligible",
                        "type": "bool",
                        "indexed": false,
                        "internalType": "bool"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                  {
                        "name": "previousOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "newOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "TokenRemoved",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "TokenUpdated",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "TokenWhitelisted",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "priceFeed",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  },
                  {
                        "name": "deployerGroupId",
                        "type": "uint8",
                        "indexed": false,
                        "internalType": "uint8"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      }
] as const,
    },
    RouterRegistry: {
      address: "0xa458bd089ed50caec0997a814caaf654778eb6e9",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "activateRouter",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "deactivateRouter",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "defaultRouterId",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getRouter",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getRouterInfo",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "tuple",
                        "internalType": "struct RouterRegistry.RouterInfo",
                        "components": [
                              {
                                    "name": "adapter",
                                    "type": "address",
                                    "internalType": "address"
                              },
                              {
                                    "name": "name",
                                    "type": "string",
                                    "internalType": "string"
                              },
                              {
                                    "name": "active",
                                    "type": "bool",
                                    "internalType": "bool"
                              }
                        ]
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "nextRouterId",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "registerRouter",
            "inputs": [
                  {
                        "name": "adapter",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "name",
                        "type": "string",
                        "internalType": "string"
                  }
            ],
            "outputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "routers",
            "inputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "adapter",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "name",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "active",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "setDefaultRouter",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setTokenRouterOverride",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "routerId",
                        "type": "bytes32",
                        "internalType": "bytes32"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "tokenRouterOverrides",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bytes32",
                        "internalType": "bytes32"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                  {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "event",
            "name": "DefaultRouterSet",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "indexed": true,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                  {
                        "name": "previousOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "newOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "RouterActivated",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "indexed": true,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "RouterDeactivated",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "indexed": true,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "RouterRegistered",
            "inputs": [
                  {
                        "name": "routerId",
                        "type": "uint256",
                        "indexed": true,
                        "internalType": "uint256"
                  },
                  {
                        "name": "adapter",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "name",
                        "type": "string",
                        "indexed": false,
                        "internalType": "string"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "TokenRouterOverrideSet",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "routerId",
                        "type": "bytes32",
                        "indexed": true,
                        "internalType": "bytes32"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      }
] as const,
    },
    SafetyModule: {
      address: "0x5ad56df56918b09d91d1410881595588e61a2359",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_registry",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "BPS",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "MAX_DELTA_CEILING",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "MAX_DEPLOYER_GROUP_CAP",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "MAX_SINGLE_TOKEN_CAP",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "MIN_COOLDOWN",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "OVERDUE_GRACE",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "authorizedCallers",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "canRebalance",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "checkOverdue",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "deployerGroupCap",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "emergencyPause",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "emergencyUnpause",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "lastRebalanceTime",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "lastTVL",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxDeltaPerCycle",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxSlippageBPS",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "minAllocationFloor",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "oracleDeviationThreshold",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "paused",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "recordRebalance",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "newTVL",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "registry",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "contract AssetRegistry"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setAuthorizedCaller",
            "inputs": [
                  {
                        "name": "caller",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "authorized",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setDeployerGroupCap",
            "inputs": [
                  {
                        "name": "newCap",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setMaxDeltaPerCycle",
            "inputs": [
                  {
                        "name": "newDelta",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setMaxSlippage",
            "inputs": [
                  {
                        "name": "newSlippage",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setMinAllocationFloor",
            "inputs": [
                  {
                        "name": "newFloor",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setOracleDeviationThreshold",
            "inputs": [
                  {
                        "name": "newThreshold",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setSingleTokenCap",
            "inputs": [
                  {
                        "name": "newCap",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setTvlDropThreshold",
            "inputs": [
                  {
                        "name": "newThreshold",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "singleTokenCap",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                  {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "tvlDropThreshold",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "validateWeights",
            "inputs": [
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "internalType": "address[]"
                  },
                  {
                        "name": "currentWeights",
                        "type": "uint16[]",
                        "internalType": "uint16[]"
                  },
                  {
                        "name": "newWeights",
                        "type": "uint16[]",
                        "internalType": "uint16[]"
                  }
            ],
            "outputs": [],
            "stateMutability": "view"
      },
      {
            "type": "event",
            "name": "AuthorizedCallerSet",
            "inputs": [
                  {
                        "name": "caller",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "authorized",
                        "type": "bool",
                        "indexed": false,
                        "internalType": "bool"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "CircuitBreakerTriggered",
            "inputs": [
                  {
                        "name": "reason",
                        "type": "string",
                        "indexed": false,
                        "internalType": "string"
                  },
                  {
                        "name": "value",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                  {
                        "name": "previousOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "newOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "Paused",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "RebalanceOverdue",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "lastRebalance",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "currentTime",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "SafetyParamUpdated",
            "inputs": [
                  {
                        "name": "param",
                        "type": "string",
                        "indexed": false,
                        "internalType": "string"
                  },
                  {
                        "name": "newValue",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "Unpaused",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "EnforcedPause",
            "inputs": []
      },
      {
            "type": "error",
            "name": "ExpectedPause",
            "inputs": []
      },
      {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      }
] as const,
    },
    WeightVerifier: {
      address: "0xc7f7679639d64db9a75ab6595c05a239f4c15a3e",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_larvAISigner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "REBALANCE_ORDER_TYPEHASH",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "bytes32",
                        "internalType": "bytes32"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "STALENESS_WINDOW",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "areWeightsFresh",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "authorizedVaults",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "cancelSignerRotation",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "commitSignerRotation",
            "inputs": [
                  {
                        "name": "newSigner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "eip712Domain",
            "inputs": [],
            "outputs": [
                  {
                        "name": "fields",
                        "type": "bytes1",
                        "internalType": "bytes1"
                  },
                  {
                        "name": "name",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "version",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "verifyingContract",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "salt",
                        "type": "bytes32",
                        "internalType": "bytes32"
                  },
                  {
                        "name": "extensions",
                        "type": "uint256[]",
                        "internalType": "uint256[]"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "executeSignerRotation",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "getActiveWeights",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "internalType": "address[]"
                  },
                  {
                        "name": "weights",
                        "type": "uint16[]",
                        "internalType": "uint16[]"
                  },
                  {
                        "name": "lastSubmitted",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getNonce",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "larvAISigner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "nonce",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "pendingSigner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "pendingSignerCommitTimestamp",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setVaultAuthorized",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "authorized",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "submitWeights",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "internalType": "address[]"
                  },
                  {
                        "name": "weightsBPS",
                        "type": "uint16[]",
                        "internalType": "uint16[]"
                  },
                  {
                        "name": "nonce",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "timestamp",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "signature",
                        "type": "bytes",
                        "internalType": "bytes"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                  {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "event",
            "name": "EIP712DomainChanged",
            "inputs": [],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                  {
                        "name": "previousOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "newOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "SignerRotationCancelled",
            "inputs": [
                  {
                        "name": "cancelledSigner",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  },
                  {
                        "name": "timestamp",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "SignerRotationCommitted",
            "inputs": [
                  {
                        "name": "newSigner",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  },
                  {
                        "name": "timestamp",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "SignerRotationExecuted",
            "inputs": [
                  {
                        "name": "oldSigner",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  },
                  {
                        "name": "newSigner",
                        "type": "address",
                        "indexed": false,
                        "internalType": "address"
                  },
                  {
                        "name": "timestamp",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "VaultAuthorized",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "authorized",
                        "type": "bool",
                        "indexed": false,
                        "internalType": "bool"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "WeightsSubmitted",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "indexed": false,
                        "internalType": "address[]"
                  },
                  {
                        "name": "weightsBPS",
                        "type": "uint16[]",
                        "indexed": false,
                        "internalType": "uint16[]"
                  },
                  {
                        "name": "nonce",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "timestamp",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "ECDSAInvalidSignature",
            "inputs": []
      },
      {
            "type": "error",
            "name": "ECDSAInvalidSignatureLength",
            "inputs": [
                  {
                        "name": "length",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ECDSAInvalidSignatureS",
            "inputs": [
                  {
                        "name": "s",
                        "type": "bytes32",
                        "internalType": "bytes32"
                  }
            ]
      },
      {
            "type": "error",
            "name": "InvalidShortString",
            "inputs": []
      },
      {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "StringTooLong",
            "inputs": [
                  {
                        "name": "str",
                        "type": "string",
                        "internalType": "string"
                  }
            ]
      }
] as const,
    },
    CLAWDFeeDistributor: {
      address: "0xa00588e2772a70e349e2f46a3be49c00b70c5870",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_clawdToken",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_stakerRewardPool",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_treasury",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "BPS",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "BURN_PERCENT",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "STAKER_PERCENT",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "burnFees",
            "inputs": [
                  {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "swapRouter",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "minOut",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "extraData",
                        "type": "bytes",
                        "internalType": "bytes"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "clawdToken",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "distributeFees",
            "inputs": [
                  {
                        "name": "usdcAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "dustAccumulator",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getDistribution",
            "inputs": [
                  {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "burnAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "stakerAmount",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "dust",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "pure"
      },
      {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setStakerRewardPool",
            "inputs": [
                  {
                        "name": "newPool",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setTreasury",
            "inputs": [
                  {
                        "name": "newTreasury",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "stakerRewardPool",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "sweepTokens",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "totalFeesBurned",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "totalFeesDistributed",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "totalFeesToStakers",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                  {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "treasury",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "event",
            "name": "FeesBurned",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "amount",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "FeesDistributed",
            "inputs": [
                  {
                        "name": "totalAmount",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "burnAmount",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "stakerAmount",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "dust",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                  {
                        "name": "previousOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "newOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "StakerRewardAdded",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "amount",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "StakerRewardPoolUpdated",
            "inputs": [
                  {
                        "name": "newPool",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "TreasuryUpdated",
            "inputs": [
                  {
                        "name": "newTreasury",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "AddressEmptyCode",
            "inputs": [
                  {
                        "name": "target",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "AddressInsufficientBalance",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "FailedInnerCall",
            "inputs": []
      },
      {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "SafeERC20FailedOperation",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      }
] as const,
    },
    IndexFactory: {
      address: "0x6d27591f496787f175c52b920804bfe6e427bbcf",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_usdc",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_feeDistributor",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "allVaults",
            "inputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "feeDistributor",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getAllVaults",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address[]",
                        "internalType": "address[]"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getVaultAtIndex",
            "inputs": [
                  {
                        "name": "index",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getVaultCount",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getVaultsByCategory",
            "inputs": [
                  {
                        "name": "category",
                        "type": "string",
                        "internalType": "string"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address[]",
                        "internalType": "address[]"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "registerVault",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "category",
                        "type": "string",
                        "internalType": "string"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                  {
                        "name": "newOwner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "usdc",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "vaultCount",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "vaultIndexId",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "vaultsByCategory",
            "inputs": [
                  {
                        "name": "",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                  {
                        "name": "previousOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "newOwner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "VaultDeployed",
            "inputs": [
                  {
                        "name": "vault",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "name",
                        "type": "string",
                        "indexed": false,
                        "internalType": "string"
                  },
                  {
                        "name": "symbol",
                        "type": "string",
                        "indexed": false,
                        "internalType": "string"
                  },
                  {
                        "name": "category",
                        "type": "string",
                        "indexed": false,
                        "internalType": "string"
                  },
                  {
                        "name": "indexId",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "guardian",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      }
] as const,
    },
    IndexVault: {
      address: "0xada99b4f64f88ba657fe85e25c6c3598b87a381d",
      abi: [
      {
            "type": "constructor",
            "inputs": [
                  {
                        "name": "_usdc",
                        "type": "address",
                        "internalType": "contract IERC20"
                  },
                  {
                        "name": "_name",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "_symbol",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "_category",
                        "type": "string",
                        "internalType": "string"
                  },
                  {
                        "name": "_indexId",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "_guardian",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_registry",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_feeRecipient",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "_maxFeeBPS",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "allowance",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "spender",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "approve",
            "inputs": [
                  {
                        "name": "spender",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "value",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "approveExecutor",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "asset",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "balanceOf",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "category",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "string",
                        "internalType": "string"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "constituents",
            "inputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "convertToAssets",
            "inputs": [
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "convertToShares",
            "inputs": [
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "decimals",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint8",
                        "internalType": "uint8"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "deposit",
            "inputs": [
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "executor",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "feeRecipient",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getConstituentCount",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getConstituents",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address[]",
                        "internalType": "address[]"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "getCurrentWeights",
            "inputs": [],
            "outputs": [
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "internalType": "address[]"
                  },
                  {
                        "name": "weights",
                        "type": "uint16[]",
                        "internalType": "uint16[]"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "guardian",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "harvestFees",
            "inputs": [],
            "outputs": [
                  {
                        "name": "totalFee",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "highWaterMark",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "indexId",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "isConstituent",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "lastFeeHarvest",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "managementFeeBPS",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxDeposit",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxFeeBPS",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxMint",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxRedeem",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "maxWithdraw",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "mint",
            "inputs": [
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "name",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "string",
                        "internalType": "string"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "performanceFeeBPS",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "previewDeposit",
            "inputs": [
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "previewMint",
            "inputs": [
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "previewRedeem",
            "inputs": [
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "previewWithdraw",
            "inputs": [
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "redeem",
            "inputs": [
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "registry",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "contract AssetRegistry"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "setExecutor",
            "inputs": [
                  {
                        "name": "_executor",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setFeeRecipient",
            "inputs": [
                  {
                        "name": "_feeRecipient",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setManagementFee",
            "inputs": [
                  {
                        "name": "newFee",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "setPerformanceFee",
            "inputs": [
                  {
                        "name": "newFee",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "symbol",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "string",
                        "internalType": "string"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "targetWeightBPS",
            "inputs": [
                  {
                        "name": "",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint16",
                        "internalType": "uint16"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "totalAssets",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "totalSupply",
            "inputs": [],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "view"
      },
      {
            "type": "function",
            "name": "transfer",
            "inputs": [
                  {
                        "name": "to",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "value",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "transferFrom",
            "inputs": [
                  {
                        "name": "from",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "to",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "value",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "bool",
                        "internalType": "bool"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "transferGuardian",
            "inputs": [
                  {
                        "name": "newGuardian",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "updateWeights",
            "inputs": [
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "internalType": "address[]"
                  },
                  {
                        "name": "weights",
                        "type": "uint16[]",
                        "internalType": "uint16[]"
                  }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
      },
      {
            "type": "function",
            "name": "withdraw",
            "inputs": [
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  }
            ],
            "outputs": [
                  {
                        "name": "",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ],
            "stateMutability": "nonpayable"
      },
      {
            "type": "event",
            "name": "Approval",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "spender",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "value",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "Deposit",
            "inputs": [
                  {
                        "name": "sender",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "owner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "assets",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "shares",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "ExecutorUpdated",
            "inputs": [
                  {
                        "name": "newExecutor",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "FeesHarvested",
            "inputs": [
                  {
                        "name": "managementFee",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "performanceFee",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "Transfer",
            "inputs": [
                  {
                        "name": "from",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "to",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "value",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "WeightsUpdated",
            "inputs": [
                  {
                        "name": "tokens",
                        "type": "address[]",
                        "indexed": false,
                        "internalType": "address[]"
                  },
                  {
                        "name": "weights",
                        "type": "uint16[]",
                        "indexed": false,
                        "internalType": "uint16[]"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "event",
            "name": "Withdraw",
            "inputs": [
                  {
                        "name": "sender",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "receiver",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "owner",
                        "type": "address",
                        "indexed": true,
                        "internalType": "address"
                  },
                  {
                        "name": "assets",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  },
                  {
                        "name": "shares",
                        "type": "uint256",
                        "indexed": false,
                        "internalType": "uint256"
                  }
            ],
            "anonymous": false
      },
      {
            "type": "error",
            "name": "AddressEmptyCode",
            "inputs": [
                  {
                        "name": "target",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "AddressInsufficientBalance",
            "inputs": [
                  {
                        "name": "account",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC20InsufficientAllowance",
            "inputs": [
                  {
                        "name": "spender",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "allowance",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "needed",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC20InsufficientBalance",
            "inputs": [
                  {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "balance",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "needed",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC20InvalidApprover",
            "inputs": [
                  {
                        "name": "approver",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC20InvalidReceiver",
            "inputs": [
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC20InvalidSender",
            "inputs": [
                  {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC20InvalidSpender",
            "inputs": [
                  {
                        "name": "spender",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC4626ExceededMaxDeposit",
            "inputs": [
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "max",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC4626ExceededMaxMint",
            "inputs": [
                  {
                        "name": "receiver",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "max",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC4626ExceededMaxRedeem",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "shares",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "max",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "ERC4626ExceededMaxWithdraw",
            "inputs": [
                  {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                  },
                  {
                        "name": "assets",
                        "type": "uint256",
                        "internalType": "uint256"
                  },
                  {
                        "name": "max",
                        "type": "uint256",
                        "internalType": "uint256"
                  }
            ]
      },
      {
            "type": "error",
            "name": "FailedInnerCall",
            "inputs": []
      },
      {
            "type": "error",
            "name": "MathOverflowedMulDiv",
            "inputs": []
      },
      {
            "type": "error",
            "name": "ReentrancyGuardReentrantCall",
            "inputs": []
      },
      {
            "type": "error",
            "name": "SafeERC20FailedOperation",
            "inputs": [
                  {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                  }
            ]
      }
] as const,
    }
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
