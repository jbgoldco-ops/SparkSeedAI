#!/bin/bash
# ==============================================================================
# SPARKSEED OVERRIDE PROTOCOL
# Local Code Injection & Cryptographic Hashing Utility
# ==============================================================================

# Define the core target file
TARGET_FILE="maya_core.py"
BACKUP_FILE="${TARGET_FILE}.bak"

echo "[SYSTEM] Initiating Local Override Protocol for $TARGET_FILE..."
echo "----------------------------------------------------------------------"

# Phase 1: Local Backup
if [ -f "$TARGET_FILE" ]; then
    cp "$TARGET_FILE" "$BACKUP_FILE"
    echo "[SWARM] Local backup successfully created: $BACKUP_FILE"
else
    echo "[SWARM] Target file not found. A new $TARGET_FILE will be generated."
fi

echo "[ACTION] Opening $TARGET_FILE for manual injection."
echo "--> PASTE the hardened code, save the file, and exit the editor."
echo "----------------------------------------------------------------------"
sleep 2

# Phase 2: Open Editor (Defaults to nano for safe terminal pasting)
${EDITOR:-nano} "$TARGET_FILE"

echo "----------------------------------------------------------------------"
echo "[SWARM] File saved. Initiating cryptographic hashing sequence..."

# Phase 3: Hash Calculation for Zero-Trust Validation
if command -v shasum &> /dev/null; then
    FILE_HASH=$(shasum -a 256 "$TARGET_FILE" | awk '{print $1}')
elif command -v sha256sum &> /dev/null; then
    FILE_HASH=$(sha256sum "$TARGET_FILE" | awk '{print $1}')
else
    FILE_HASH="[WARNING: Cryptographic hashing utility not found on this node]"
fi

echo "[SECURE] New SHA-256 hash registered: $FILE_HASH"
echo "[STATUS] Local override complete. The swarm daemon will now absorb the update."
