#!/usr/bin/env sh
set -eu

export NX_DAEMON=false
npm ci

if [ -n "${NX_BASE:-}" ] && [ -n "${NX_HEAD:-}" ]; then
  npx nx affected -t lint,typecheck,test --configuration=ci --base="$NX_BASE" --head="$NX_HEAD"
else
  npx nx run-many -t lint,typecheck,test --configuration=ci
fi

npx cross-env NODE_ENV=production nx build portal
