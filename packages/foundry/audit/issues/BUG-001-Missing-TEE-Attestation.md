## BUG-001 — Missing TEE Attestation Hash Storage and Verification

**Severity:** Medium  
**Contract:** `contracts/WeightVerifier.sol`  
**Type:** Missing functionality / Security gap

---

### Description

The WeightVerifier contract was specified to include TEE (Trusted Execution Environment) attestation hash storage and verification. However, **no TEE attestation mechanism exists in the codebase**. The `submitWeights()` function relies solely on EIP-712 ECDSA signature verification against the `larvAISigner` key.

If the LarvAI signing key is compromised, an attacker can submit arbitrary weight vectors with valid signatures and drain value from vaults. A TEE attestation check would provide a secondary layer of trust by verifying that the weight computation was performed inside a hardware-secured environment (e.g., Intel TDX, AMD SEV).

### Current Code

```solidity
// WeightVerifier.sol — No TEE-related state exists:
mapping(address => VaultWeights) private _vaultWeights;
// VaultWeights only contains:
struct VaultWeights {
    address[] tokens;
    uint16[] weightsBPS;
    uint256 nonce;
    uint256 lastSubmitted;
}
// No teeAttestationHash anywhere in the contract.

function submitWeights(...) external {
    // ...nonce, staleness, weight sum checks...
    
    // Only ECDSA verification:
    bytes32 digest = _hashTypedDataV4(structHash);
    address recovered = digest.recover(signature);
    require(recovered == larvAISigner, "Invalid signer");
    
    // No TEE attestation hash check.
}
```

### Expected Behavior (per spec)

- A `teeAttestationHash` state variable (global or per-vault)
- Validation in `submitWeights()` that the submitted payload's TEE attestation hash matches the stored hash
- Guardian-only function to update the TEE attestation hash
- Event emission on TEE hash updates

### Recommendation

Add TEE attestation hash management:

```solidity
bytes32 public teeAttestationHash;

event TEEAttestationHashUpdated(bytes32 indexed newHash);

function setTEEAttestationHash(bytes32 newHash) external onlyOwner {
    require(newHash != bytes32(0), "Zero hash");
    teeAttestationHash = newHash;
    emit TEEAttestationHashUpdated(newHash);
}
```

And in `submitWeights()`, validate the TEE hash is set before accepting weights:

```solidity
require(teeAttestationHash != bytes32(0), "TEE hash not set");
require(attestationHash == teeAttestationHash, "Invalid TEE attestation");
```

Note: The format of `attestationHash` depends on the TEE provider (e.g., Phala,堡 Adjacent). The field should be added to the `RebalanceOrder` struct and included in the EIP-712 typehash if the hash is part of the signed payload.
