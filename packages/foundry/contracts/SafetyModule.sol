// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AssetRegistry} from "./AssetRegistry.sol";

/// @title SafetyModule - Onchain safety rails for ClawDex rebalancing
/// @notice Enforces allocation caps, rebalance constraints, and circuit breakers
/// @dev Pause only affects rebalancing — user deposits and withdrawals are never blocked
contract SafetyModule is Ownable, Pausable {
    uint16 public constant MAX_SINGLE_TOKEN_CAP = 2500;
    uint16 public constant MAX_DEPLOYER_GROUP_CAP = 3500;
    uint16 public constant MAX_DELTA_CEILING = 2000;
    uint16 public constant BPS = 10000;

    uint256 public constant MIN_COOLDOWN = 24 hours;
    uint256 public constant OVERDUE_GRACE = 30 minutes;

    uint16 public singleTokenCap;
    uint16 public deployerGroupCap;
    uint16 public maxDeltaPerCycle;
    uint16 public minAllocationFloor;
    uint16 public maxSlippageBPS;
    uint16 public tvlDropThreshold;
    uint16 public oracleDeviationThreshold;

    uint256 public lastTVL;

    mapping(address => uint256) public lastRebalanceTime;
    mapping(address => bool) public authorizedCallers;

    AssetRegistry public immutable registry;

    event CircuitBreakerTriggered(string reason, uint256 value);
    event RebalanceOverdue(address indexed vault, uint256 lastRebalance, uint256 currentTime);
    event SafetyParamUpdated(string param, uint256 newValue);
    event AuthorizedCallerSet(address indexed caller, bool authorized);

    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender], "Not authorized caller");
        _;
    }

    constructor(address _guardian, address _registry) Ownable(_guardian) {
        registry = AssetRegistry(_registry);

        singleTokenCap = 2500;
        deployerGroupCap = 3500;
        maxDeltaPerCycle = 1500;
        minAllocationFloor = 100;
        maxSlippageBPS = 100;
        tvlDropThreshold = 1000;
        oracleDeviationThreshold = 500;
    }

    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        authorizedCallers[caller] = authorized;
        emit AuthorizedCallerSet(caller, authorized);
    }

    /// @notice Validate proposed weights against safety constraints
    /// @dev Uses memory params so RebalanceExecutor can pass computed arrays
    function validateWeights(address[] memory tokens, uint16[] memory currentWeights, uint16[] memory newWeights)
        external
        view
        whenNotPaused
    {
        require(tokens.length == newWeights.length, "Length mismatch");
        require(tokens.length == currentWeights.length, "Length mismatch");

        uint256 totalWeight = 0;
        uint256[32] memory groupTotals;

        for (uint256 i = 0; i < tokens.length; i++) {
            require(newWeights[i] <= singleTokenCap, "Exceeds single token cap");

            if (newWeights[i] > 0) {
                require(newWeights[i] >= minAllocationFloor, "Below allocation floor");
            }

            uint16 delta;
            if (newWeights[i] > currentWeights[i]) {
                delta = newWeights[i] - currentWeights[i];
            } else {
                delta = currentWeights[i] - newWeights[i];
            }
            require(delta <= maxDeltaPerCycle, "Exceeds max delta per cycle");

            AssetRegistry.TokenInfo memory info = registry.getTokenInfo(tokens[i]);
            require(info.active, "Token not whitelisted");
            if (info.deployerGroupId < 32) {
                groupTotals[info.deployerGroupId] += newWeights[i];
            }

            totalWeight += newWeights[i];
        }

        require(totalWeight == BPS, "Weights must sum to 10000");

        for (uint256 g = 0; g < 32; g++) {
            require(groupTotals[g] <= deployerGroupCap, "Exceeds deployer group cap");
        }
    }

    function canRebalance(address vault) external view returns (bool) {
        if (paused()) return false;
        return block.timestamp >= lastRebalanceTime[vault] + MIN_COOLDOWN;
    }

    function recordRebalance(address vault, uint256 newTVL) external onlyAuthorized {
        lastRebalanceTime[vault] = block.timestamp;

        if (lastTVL > 0 && newTVL < lastTVL) {
            uint256 dropBPS = ((lastTVL - newTVL) * BPS) / lastTVL;
            if (dropBPS > tvlDropThreshold) {
                _pause();
                emit CircuitBreakerTriggered("TVL drop", dropBPS);
            }
        }
        lastTVL = newTVL;
    }

    function checkOverdue(address vault) external {
        uint256 last = lastRebalanceTime[vault];
        if (last > 0 && block.timestamp > last + MIN_COOLDOWN + OVERDUE_GRACE) {
            emit RebalanceOverdue(vault, last, block.timestamp);
        }
    }

    function setSingleTokenCap(uint16 newCap) external onlyOwner {
        require(newCap <= MAX_SINGLE_TOKEN_CAP, "Exceeds ceiling");
        require(newCap > 0, "Zero cap");
        singleTokenCap = newCap;
        emit SafetyParamUpdated("singleTokenCap", newCap);
    }

    function setDeployerGroupCap(uint16 newCap) external onlyOwner {
        require(newCap <= MAX_DEPLOYER_GROUP_CAP, "Exceeds ceiling");
        require(newCap > 0, "Zero cap");
        deployerGroupCap = newCap;
        emit SafetyParamUpdated("deployerGroupCap", newCap);
    }

    function setMaxDeltaPerCycle(uint16 newDelta) external onlyOwner {
        require(newDelta <= MAX_DELTA_CEILING, "Exceeds ceiling");
        require(newDelta > 0, "Zero delta");
        maxDeltaPerCycle = newDelta;
        emit SafetyParamUpdated("maxDeltaPerCycle", newDelta);
    }

    function setMinAllocationFloor(uint16 newFloor) external onlyOwner {
        require(newFloor <= 200, "Floor too high");
        minAllocationFloor = newFloor;
        emit SafetyParamUpdated("minAllocationFloor", newFloor);
    }

    function setMaxSlippage(uint16 newSlippage) external onlyOwner {
        require(newSlippage <= 500, "Slippage too high");
        require(newSlippage > 0, "Zero slippage");
        maxSlippageBPS = newSlippage;
        emit SafetyParamUpdated("maxSlippageBPS", newSlippage);
    }

    function setTvlDropThreshold(uint16 newThreshold) external onlyOwner {
        require(newThreshold > 0 && newThreshold <= 5000, "Invalid threshold");
        tvlDropThreshold = newThreshold;
        emit SafetyParamUpdated("tvlDropThreshold", newThreshold);
    }

    function setOracleDeviationThreshold(uint16 newThreshold) external onlyOwner {
        require(newThreshold > 0 && newThreshold <= 2000, "Invalid threshold");
        oracleDeviationThreshold = newThreshold;
        emit SafetyParamUpdated("oracleDeviationThreshold", newThreshold);
    }

    function emergencyPause() external onlyOwner {
        _pause();
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
}
