#!/bin/bash
# Fix Hive Pulse Check Workflow Script
# This script updates the workflow configuration to use stable Node 20

set -e

echo "🔧 Fixing Hive Pulse Check Workflow..."
echo ""

# Backup original file
if [ -f ".github/workflows/pulse-check.yml" ]; then
    echo "📦 Backing up original pulse-check.yml..."
    cp .github/workflows/pulse-check.yml .github/workflows/pulse-check.yml.backup
    echo "✅ Backup created: .github/workflows/pulse-check.yml.backup"
    echo ""
fi

# Create the corrected workflow file
echo "📝 Creating corrected workflow file..."
cat > .github/workflows/pulse-check.yml << 'EOF'
name: Hive Pulse Check

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 */6 * * *' # Check every 6 hours

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: npm ci --legacy-peer-deps || npm install --legacy-peer-deps
        
      - name: Run Pulse Check
        run: node pulseCheck.js
        env:
          HIVE_SAFE_KEY: ${{ secrets.HIVE_SAFE_KEY }}

env:
  NODE_OPTIONS: --no-warnings
EOF

echo "✅ Workflow file updated!"
echo ""

# Show the changes
echo "📊 Changes made:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Node.js version: 24 → 20 (stable LTS)"
echo "✓ npm install: Added --legacy-peer-deps flag"
echo "✓ npm ci: Added --legacy-peer-deps flag"
echo "✓ Removed FORCE_JAVASCRIPT_ACTIONS_TO_NODE24"
echo "✓ Added NODE_OPTIONS: --no-warnings"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verify pulseCheck.js exists
if [ -f "pulseCheck.js" ]; then
    echo "✅ pulseCheck.js found!"
else
    echo "⚠️  pulseCheck.js not found - ensure it exists in the repo root"
fi

echo ""
echo "🎉 All fixes applied!"
echo ""
echo "Next steps:"
echo "1. Commit the changes: git add .github/workflows/pulse-check.yml"
echo "2. Push to main: git push origin main"
echo "3. Check Actions tab for the next workflow run"
echo ""
