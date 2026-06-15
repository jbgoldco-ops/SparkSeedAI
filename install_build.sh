#!/bin/bash
mkdir -p .architect/staging
if [ ! -f "src/gates/orchestrator.ts" ]; then
  echo "Error: src/gates/orchestrator.ts not found."
  exit 1
fi
npm install
echo "Infrastructure installation complete."
