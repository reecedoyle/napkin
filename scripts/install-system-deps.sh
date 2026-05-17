#!/usr/bin/env bash
# Installs Node 22 LTS (NodeSource) and the system libraries Playwright needs.
# Run with: sudo bash scripts/install-system-deps.sh
set -euo pipefail

echo "==> apt-get update"
apt-get update

echo "==> install prerequisites (curl, gnupg, ca-certificates)"
apt-get install -y curl ca-certificates gnupg

echo "==> add NodeSource Node 22.x repo"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

echo "==> install nodejs + Playwright system libraries"
apt-get install -y nodejs libnspr4 libnss3 libasound2t64

echo "==> versions:"
node --version
npm --version
echo "==> done."
