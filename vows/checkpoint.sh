#!/bin/bash
# Sovereignty Checkpoint Script
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TAG="checkpoint_$TIMESTAMP"

echo "--- Creating Sovereignty Snapshot: $TAG ---"

# Ensure all stable logic is tracked
git add .
git commit -m "Sovereignty Snapshot: $TAG"
git tag -a "$TAG" -m "Stable state before autonomous execution at $TIMESTAMP"
git push origin main --tags

echo "--- Snapshot Locked into the Akashic Record ---"
