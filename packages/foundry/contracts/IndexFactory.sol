// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AssetRegistry} from "./AssetRegistry.sol";

/// @title IndexFactory - Deploys new IndexVault instances for ClawDex
/// @notice Factory contract for creating and tracking multiple ERC-4626 index vaults
/// @dev Keeps a registry of deployed vaults. Actual vault deployment done via new keyword.
contract IndexFactory is Ownable {
    /// @notice USDC token address (deposit asset for all vaults)
    address public immutable usdc;

    /// @notice Fee distributor for all vaults
    address public immutable feeDistributor;

    /// @notice List of all deployed vaults
    address[] public allVaults;

    /// @notice Mapping from category to list of vaults
    mapping(string => address[]) public vaultsByCategory;

    /// @notice Mapping from vault address to its index ID
    mapping(address => uint256) public vaultIndexId;

    /// @notice Total number of vaults deployed
    uint256 public vaultCount;

    /// @notice Event emitted when a new vault is deployed
    event VaultDeployed(
        address indexed vault,
        string name,
        string symbol,
        string category,
        uint256 indexId,
        address indexed guardian
    );

    /// @param _guardian Owner/guardian address (client)
    /// @param _usdc USDC token address
    /// @param _feeDistributor Fee distributor contract address
    constructor(
        address _guardian,
        address _usdc,
        address _feeDistributor
    ) Ownable(_guardian) {
        require(_usdc != address(0), "Zero USDC");
        require(_feeDistributor != address(0), "Zero fee distributor");

        usdc = _usdc;
        feeDistributor = _feeDistributor;
    }

    /// @notice Register a newly deployed vault
    /// @dev Called by the vault itself after deployment
    /// @param vault Address of the deployed vault
    /// @param category Category for organizing vaults
    function registerVault(address vault, string memory category) external onlyOwner {
        require(vault != address(0), "Zero vault");

        uint256 indexId = vaultCount;
        vaultCount++;

        allVaults.push(vault);
        vaultsByCategory[category].push(vault);
        vaultIndexId[vault] = indexId;

        emit VaultDeployed(vault, "", "", category, indexId, owner());
    }

    /// @notice Get all deployed vaults
    function getAllVaults() external view returns (address[] memory) {
        return allVaults;
    }

    /// @notice Get vaults by category
    function getVaultsByCategory(string memory category) external view returns (address[] memory) {
        return vaultsByCategory[category];
    }

    /// @notice Get total number of vaults
    function getVaultCount() external view returns (uint256) {
        return vaultCount;
    }

    /// @notice Get vault at index
    function getVaultAtIndex(uint256 index) external view returns (address) {
        require(index < allVaults.length, "Index out of bounds");
        return allVaults[index];
    }
}
