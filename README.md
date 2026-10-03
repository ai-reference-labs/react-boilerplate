# Journey Hub

A working Nx and Next.js starter for an application assembled by the app, App 1, App 2, UI-components, and auth teams. It produces one deployable application while keeping source ownership, tests, and dependency boundaries separate.

## Start locally

Use Node 22 and npm 10 or newer.

```bash
nvm use
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The getting-started page links to both sample journeys and JSON endpoints.

## Can each team run its own module?

Yes. Journey modules are libraries, so they need a small host to supply Next.js routing and API routes. The single portal app is that host. Next.js compiles requested routes on demand during development.

| Team          | Visual workbench                                              | Focused checks                                               |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| App 1         | `npm run dev:app1`, then open `http://localhost:4201/app1`    | `npm run test:app1` and `npx nx typecheck app1-feature`      |
| App 2         | `npm run dev:app2`, then open `http://localhost:4202/app2`    | `npm run test:app2` and `npx nx typecheck app2-feature`      |
| UI components | Use either journey route while developing shared components   | `npx nx test ui-components`                                  |
| Auth          | Open `http://localhost:3000/auth` for the sample sign-on flow | `npx nx typecheck auth-server` and `npx nx test auth-client` |
| App           | `npm run dev`                                                 | `npx nx test portal` and `npm run e2e`                       |

These commands isolate development ownership and verification. They do not create independent production deployments; the production unit is still `portal`.

## Pre-sign-on and post-sign-on flow

`/app1` and `POST /api/app1` are public, so users can start there before sign-on. `/app2` and `GET /api/app2` validate the HTTP-only sample session. Opening App 2 without a session redirects to `/auth`; the demo sign-in then returns the user to App 2.

The included identity is a local integration example. Replace the demo login route and cookie value with your approved OIDC provider, signed session, and authorization rules before production.

## Sample API integration

App 1 submits through `@journeys/shared-api-client`. App 2 loads its protected queue through the same typed client.

```bash
curl http://localhost:3000/api/health

curl -X POST http://localhost:3000/api/app1 \
  -H 'content-type: application/json' \
  -d '{"title":"Renewal flow","requester":"App 1 team","description":"Reduce repeated data entry","priority":"high"}'
```

The API is intentionally in-memory and deterministic enough for a starter. Replace route internals with real service adapters while preserving the contracts and error handling.

## Workspace map

```text
apps/portal                    Next.js shell, routes, and API handlers
apps/portal-e2e                Playwright critical-path tests
libs/app1/feature              App 1 public interactive module
libs/app2/feature              App 2 protected queue module
libs/ui/components             Shared visual shell and primitives
libs/auth/client               Sample authenticated-user view
libs/auth/server               Server session reader and shared auth contract
libs/shared/api-client         Shared contracts and typed fetch client
deploy/helm/portal             OpenShift-ready Helm chart
tools/ci/verify.sh             CI adapter for Lightspeed
```

Nx tags enforce the permitted team dependencies in `eslint.config.mjs`. Inspect them with:

```bash
npm run graph
npx nx show project app1-feature
npx nx show project portal
```

## Quality commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
```

## Pre-commit formatting

Husky runs `lint-staged` before every commit. Each staged file that Prettier
supports must already be formatted; otherwise, the commit stops and lists the
files that need attention. The hook checks files without rewriting the staged
content.

```bash
# Format the workspace, then stage the corrected files again.
npm run format
git add <files>
git commit
```

`npm install` and `npm ci` run the `prepare` script and activate the Husky hook
when this workspace is checked out as its own Git repository.

CI may set `NX_BASE` and `NX_HEAD` before running `tools/ci/verify.sh` to validate only changed projects and their consumers. Without those variables, the script verifies the full workspace.

## Container and OpenShift

The Dockerfile creates a Next.js standalone image that supports an OpenShift-assigned non-root UID. The chart uses a read-only root filesystem, writable cache mounts, probes, a Route, a disruption budget, and optional autoscaling.

```bash
docker build -t journey-hub:local .
helm lint deploy/helm/portal
helm template journey-hub deploy/helm/portal -f deploy/environments/dev/values.yaml
```

Production promotion should replace `image.digest` with the already tested image digest. Update the example registry and Route hosts before connecting the chart to Lightspeed. Keep proprietary Lightspeed pipeline fields in your organization-owned adapter; the repository exposes stable commands rather than guessing that schema.

The broader architecture and rollout rationale is in [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md). To recreate the full starter in another repository, use [the implementation prompt](./docs/CREATE-BOILERPLATE-PROMPT.md).
