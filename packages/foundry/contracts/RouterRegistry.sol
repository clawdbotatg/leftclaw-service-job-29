// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title RouterRegistry - Registry of swap router adapters for ClawDex
/// @notice Guardian-managed. Maps router IDs to adapter addresses. Supports a global default.
contract RouterRegistry is Ownable {
    struct RouterInfo {
        address adapter;
        string name;
        bool active;
    }

    mapping(uint256 => RouterInfo) public routers;
    uint256 public defaultRouterId;
    uint256 public nextRouterId;

    // Per-token router overrides
    mapping(address => bytes32) public tokenRouterOverrides;

    event RouterRegistered(uint256 indexed routerId, address indexed adapter, string name);
    event RouterDeactivated(uint256 indexed routerId);
    event RouterActivated(uint256 indexed routerId);
    event DefaultRouterSet(uint256 indexed routerId);
    event TokenRouterOverrideSet(address indexed token, bytes32 indexed routerId);

    constructor(address _guardian) Ownable(_guardian) {}

    /// @notice Register a new router adapter
    function registerRouter(address adapter, string calldata name) external onlyOwner returns (uint256 routerId) {
        require(adapter != address(0), "Zero adapter");

        routerId = nextRouterId++;
        routers[routerId] = RouterInfo({
            adapter: adapter,
            name: name,
            active: true
        });

        if (routerId == 0) {
            defaultRouterId = 0;
        }

        emit RouterRegistered(routerId, adapter, name);
    }

    /// @notice Deactivate a router
    function deactivateRouter(uint256 routerId) external onlyOwner {
        require(routers[routerId].adapter != address(0), "Router not found");
        require(routerId != defaultRouterId, "Cannot deactivate default");
        routers[routerId].active = false;
        emit RouterDeactivated(routerId);
    }

    /// @notice Activate a router
    function activateRouter(uint256 routerId) external onlyOwner {
        require(routers[routerId].adapter != address(0), "Router not found");
        routers[routerId].active = true;
        emit RouterActivated(routerId);
    }

    /// @notice Set the default router
    function setDefaultRouter(uint256 routerId) external onlyOwner {
        require(routers[routerId].adapter != address(0), "Router not found");
        require(routers[routerId].active, "Router not active");
        defaultRouterId = routerId;
        emit DefaultRouterSet(routerId);
    }

    /// @notice Set a preferred router for a specific token (overrides default)
    /// @param token The token address
    /// @param routerId The router ID to use for this token
    function setTokenRouterOverride(address token, bytes32 routerId) external onlyOwner {
        require(routers[uint256(routerId)].adapter != address(0), "Router not registered");
        tokenRouterOverrides[token] = routerId;
        emit TokenRouterOverrideSet(token, routerId);
    }

    /// @notice Get the router adapter address for a given router ID
    /// @dev Falls back to default if the preferred router is inactive
    function getRouter(uint256 routerId) external view returns (address) {
        RouterInfo storage info = routers[routerId];
        if (info.adapter != address(0) && info.active) {
            return info.adapter;
        }
        RouterInfo storage defaultInfo = routers[defaultRouterId];
        require(defaultInfo.adapter != address(0) && defaultInfo.active, "No active router");
        return defaultInfo.adapter;
    }

    /// @notice Get router info
    function getRouterInfo(uint256 routerId) external view returns (RouterInfo memory) {
        return routers[routerId];
    }
}
