// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/// @title WeightVerifier - Validates LarvAI's signed weight vectors via EIP-712
/// @notice Permissionless submission of signed rebalance orders. Two-step signer rotation.
/// @dev Sequential nonce, 90-minute staleness window, weights must sum to 10000 BPS.
contract WeightVerifier is Ownable, EIP712 {
    using ECDSA for bytes32;

    uint256 public constant STALENESS_WINDOW = 90 minutes;
    uint256 public constant SIGNER_ROTATION_DELAY = 24 hours;

    bytes32 public constant REBALANCE_ORDER_TYPEHASH = keccak256(
        "RebalanceOrder(address vault,address[] tokens,uint16[] weightsBPS,uint256 nonce,uint256 timestamp)"
    );

    address public larvAISigner;

    // Signer rotation
    address public pendingSigner;
    uint256 public signerRotationCommitTime;

    // Per-vault state
    struct VaultWeights {
        address[] tokens;
        uint16[] weightsBPS;
        uint256 nonce;
        uint256 lastSubmitted;
    }

    mapping(address => VaultWeights) private _vaultWeights;
    mapping(address => bool) public authorizedVaults;

    event WeightsSubmitted(address indexed vault, address[] tokens, uint16[] weightsBPS, uint256 nonce, uint256 timestamp);
    event SignerRotationCommitted(address indexed newSigner, uint256 executeAfter);
    event SignerRotationExecuted(address indexed oldSigner, address indexed newSigner);
    event SignerRotationCancelled(address indexed cancelledSigner);
    event VaultAuthorized(address indexed vault, bool authorized);

    constructor(
        address _guardian,
        address _larvAISigner
    ) Ownable(_guardian) EIP712("ClawDex", "1") {
        require(_larvAISigner != address(0), "Zero signer");
        larvAISigner = _larvAISigner;
    }

    /// @notice Authorize a vault to accept weight submissions
    function setVaultAuthorized(address vault, bool authorized) external onlyOwner {
        authorizedVaults[vault] = authorized;
        emit VaultAuthorized(vault, authorized);
    }

    /// @notice Submit new weights signed by LarvAI
    /// @dev Permissionless — anyone can relay the signed payload
    function submitWeights(
        address vault,
        address[] calldata tokens,
        uint16[] calldata weightsBPS,
        uint256 nonce,
        uint256 timestamp,
        bytes calldata signature
    ) external {
        require(authorizedVaults[vault], "Vault not authorized");
        require(tokens.length == weightsBPS.length, "Length mismatch");
        require(tokens.length > 0, "Empty weights");

        VaultWeights storage vw = _vaultWeights[vault];

        // Nonce check
        require(nonce == vw.nonce + 1, "Invalid nonce");

        // Staleness check
        require(block.timestamp - timestamp <= STALENESS_WINDOW, "Stale signature");
        require(timestamp <= block.timestamp, "Future timestamp");

        // Weights must sum to 10000
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < weightsBPS.length; i++) {
            totalWeight += weightsBPS[i];
        }
        require(totalWeight == 10000, "Weights must sum to 10000");

        // Verify EIP-712 signature
        bytes32 structHash = _hashRebalanceOrder(vault, tokens, weightsBPS, nonce, timestamp);
        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = digest.recover(signature);
        require(recovered == larvAISigner, "Invalid signer");

        // Store weights
        vw.tokens = tokens;
        vw.weightsBPS = new uint16[](weightsBPS.length);
        for (uint256 i = 0; i < weightsBPS.length; i++) {
            vw.weightsBPS[i] = weightsBPS[i];
        }
        vw.nonce = nonce;
        vw.lastSubmitted = block.timestamp;

        emit WeightsSubmitted(vault, tokens, weightsBPS, nonce, timestamp);
    }

    /// @notice Get active weights for a vault
    function getActiveWeights(address vault)
        external
        view
        returns (address[] memory tokens, uint16[] memory weights, uint256 lastSubmitted)
    {
        VaultWeights storage vw = _vaultWeights[vault];
        return (vw.tokens, vw.weightsBPS, vw.lastSubmitted);
    }

    /// @notice Check if weights are fresh (within staleness window)
    function areWeightsFresh(address vault) external view returns (bool) {
        uint256 lastSubmitted = _vaultWeights[vault].lastSubmitted;
        if (lastSubmitted == 0) return false;
        return block.timestamp - lastSubmitted <= STALENESS_WINDOW;
    }

    /// @notice Get current nonce for a vault
    function getNonce(address vault) external view returns (uint256) {
        return _vaultWeights[vault].nonce;
    }

    // --- Signer Rotation (two-step commit-reveal) ---

    /// @notice Step 1: Commit to a new signer. 24h delay before execution.
    function commitSignerRotation(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Zero signer");
        require(newSigner != larvAISigner, "Same signer");

        pendingSigner = newSigner;
        signerRotationCommitTime = block.timestamp;

        emit SignerRotationCommitted(newSigner, block.timestamp + SIGNER_ROTATION_DELAY);
    }

    /// @notice Step 2: Execute signer rotation after delay
    function executeSignerRotation() external onlyOwner {
        require(pendingSigner != address(0), "No pending rotation");
        require(block.timestamp >= signerRotationCommitTime + SIGNER_ROTATION_DELAY, "Delay not met");

        address oldSigner = larvAISigner;
        larvAISigner = pendingSigner;
        pendingSigner = address(0);
        signerRotationCommitTime = 0;

        emit SignerRotationExecuted(oldSigner, larvAISigner);
    }

    /// @notice Cancel a pending signer rotation
    function cancelSignerRotation() external onlyOwner {
        require(pendingSigner != address(0), "No pending rotation");

        address cancelled = pendingSigner;
        pendingSigner = address(0);
        signerRotationCommitTime = 0;

        emit SignerRotationCancelled(cancelled);
    }

    // --- Internal ---

    function _hashRebalanceOrder(
        address vault,
        address[] calldata tokens,
        uint16[] calldata weightsBPS,
        uint256 nonce,
        uint256 timestamp
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(
                REBALANCE_ORDER_TYPEHASH,
                vault,
                keccak256(abi.encodePacked(tokens)),
                keccak256(abi.encodePacked(weightsBPS)),
                nonce,
                timestamp
            )
        );
    }
}
