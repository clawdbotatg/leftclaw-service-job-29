// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title AssetRegistry - Whitelisted token registry for ClawDex indices
/// @notice Guardian-managed registry of tokens eligible for index inclusion
/// @dev Stores per-token metadata: price feed, router, deployer group, decimals
contract AssetRegistry is Ownable {
    struct TokenInfo {
        address priceFeed;
        uint8 tokenDecimals;
        uint8 priceFeedDecimals;
        uint8 deployerGroupId;
        uint256 preferredRouterId;
        uint256 minLiquidity;
        bool active;
    }

    mapping(address => TokenInfo) private _tokens;
    address[] public whitelistedTokens;
    mapping(address => bool) public isWhitelisted;

    // Index tagging: token => indexId => eligible
    mapping(address => mapping(uint256 => bool)) public isEligibleForIndex;

    event TokenWhitelisted(address indexed token, address priceFeed, uint8 deployerGroupId);
    event TokenRemoved(address indexed token);
    event TokenUpdated(address indexed token);
    event IndexEligibilitySet(address indexed token, uint256 indexed indexId, bool eligible);

    constructor(address _guardian) Ownable(_guardian) {}

    /// @notice Whitelist a token with its metadata
    function whitelistToken(
        address token,
        address priceFeed,
        uint8 deployerGroupId,
        uint256 preferredRouterId,
        uint256 minLiquidity
    ) external onlyOwner {
        require(token != address(0), "Zero token address");
        require(priceFeed != address(0), "Zero price feed");
        require(!isWhitelisted[token], "Already whitelisted");

        uint8 tokenDecimals = IERC20Metadata(token).decimals();

        // Read price feed decimals - Chainlink feeds return 8 decimals for USD pairs
        uint8 feedDecimals = 8;
        try IAggregatorV3Minimal(priceFeed).decimals() returns (uint8 d) {
            feedDecimals = d;
        } catch {}

        _tokens[token] = TokenInfo({
            priceFeed: priceFeed,
            tokenDecimals: tokenDecimals,
            priceFeedDecimals: feedDecimals,
            deployerGroupId: deployerGroupId,
            preferredRouterId: preferredRouterId,
            minLiquidity: minLiquidity,
            active: true
        });

        whitelistedTokens.push(token);
        isWhitelisted[token] = true;

        emit TokenWhitelisted(token, priceFeed, deployerGroupId);
    }

    /// @notice Remove a token from the whitelist
    function removeToken(address token) external onlyOwner {
        require(isWhitelisted[token], "Not whitelisted");

        _tokens[token].active = false;
        isWhitelisted[token] = false;

        for (uint256 i = 0; i < whitelistedTokens.length; i++) {
            if (whitelistedTokens[i] == token) {
                whitelistedTokens[i] = whitelistedTokens[whitelistedTokens.length - 1];
                whitelistedTokens.pop();
                break;
            }
        }

        emit TokenRemoved(token);
    }

    /// @notice Update token metadata
    function updateToken(
        address token,
        address priceFeed,
        uint8 deployerGroupId,
        uint256 preferredRouterId,
        uint256 minLiquidity
    ) external onlyOwner {
        require(isWhitelisted[token], "Not whitelisted");
        require(priceFeed != address(0), "Zero price feed");

        TokenInfo storage info = _tokens[token];
        info.priceFeed = priceFeed;
        info.deployerGroupId = deployerGroupId;
        info.preferredRouterId = preferredRouterId;
        info.minLiquidity = minLiquidity;

        uint8 feedDecimals = 8;
        try IAggregatorV3Minimal(priceFeed).decimals() returns (uint8 d) {
            feedDecimals = d;
        } catch {}
        info.priceFeedDecimals = feedDecimals;

        emit TokenUpdated(token);
    }

    /// @notice Set index eligibility for a token
    function setIndexEligibility(address token, uint256 indexId, bool eligible) external onlyOwner {
        require(isWhitelisted[token], "Not whitelisted");
        isEligibleForIndex[token][indexId] = eligible;
        emit IndexEligibilitySet(token, indexId, eligible);
    }

    /// @notice Get token info
    function getTokenInfo(address token) external view returns (TokenInfo memory) {
        return _tokens[token];
    }

    /// @notice Get all whitelisted tokens
    function getWhitelistedTokens() external view returns (address[] memory) {
        return whitelistedTokens;
    }

    /// @notice Count of whitelisted tokens
    function getWhitelistedCount() external view returns (uint256) {
        return whitelistedTokens.length;
    }
}

interface IAggregatorV3Minimal {
    function decimals() external view returns (uint8);
}
