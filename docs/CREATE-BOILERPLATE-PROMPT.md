# Prompt: build the Journey Hub boilerplate

Copy the prompt below into a coding agent when you need to recreate this
boilerplate in an empty repository. It is written as an implementation request,
so the agent should create and verify the application rather than return only a
design.

---

## Implementation prompt

You are a senior frontend platform engineer and solution architect. Build a
production-oriented React and Next.js boilerplate in an Nx workspace for
multiple independently owned journey teams. Work directly in the supplied
repository and continue until the application, tests, local development flow,
container, and deployment assets are implemented and verified.

### Goal and release model

Create one deployable Next.js application named `portal`. Five teams contribute
to the same application:

- App team: application shell, route composition, integration, and release.
- App 1 team: a public pre-sign-on journey.
- App 2 team: a protected post-sign-on journey.
- UI-components team: shared layout and visual primitives.
- Auth team: session lifecycle, sign-on route, server checks, and user UI.

The teams must be able to develop and test their modules independently inside
the workspace. Production still uses one application build, one OCI image, and
one Helm release per environment. Do not create separately deployed
micro-frontends or separate App 1 and App 2 containers.

### Required stack

Use these versions unless the repository already pins compatible later patch
versions:

- Node.js 22 LTS and npm 10 or newer.
- Nx 23.2.x with inferred targets.
- Next.js 16.3.x using the App Router.
- React and React DOM 19.
- TypeScript 6 in strict mode.
- ESLint 9 flat configuration with `@nx/enforce-module-boundaries`.
- Vitest and React Testing Library for unit tests.
- Playwright for browser tests.
- Prettier 3, Husky 9, and lint-staged.
- A multi-stage Docker image and a Helm chart suitable for OpenShift.

Read the installed Next.js documentation before implementing framework APIs.
Use current asynchronous `cookies()` and `searchParams` behavior. Prefer Server
Components for route authorization and Route Handlers for cookie mutation.

### Workspace layout

Create this structure and register every application and library as an Nx
project:

```text
apps/
  portal/
    src/app/
      api/
        app1/route.ts
        app2/route.ts
        auth/login/route.ts
        auth/logout/route.ts
        health/route.ts
      app1/page.tsx
      app2/page.tsx
      auth/page.tsx
      layout.tsx
      page.tsx
      global.css
    specs/
  portal-e2e/
libs/
  app1/feature/
  app2/feature/
  auth/client/
  auth/server/
  shared/api-client/
  ui/components/
deploy/
  environments/dev/values.yaml
  environments/prod/values.yaml
  helm/portal/
tools/ci/verify.sh
docs/
Dockerfile
nx.json
eslint.config.mjs
package.json
tsconfig.base.json
```

Use npm workspaces for `apps/*`, `libs/app1/*`, `libs/app2/*`, `libs/auth/*`,
`libs/shared/*`, and `libs/ui/*`. Add TypeScript project references from the
root and portal to every consumed library.

### Nx project names and import names

Use these exact project and package names:

| Project             | Package import                | Tags                                                  |
| ------------------- | ----------------------------- | ----------------------------------------------------- |
| `app1-feature`      | `@journeys/app1-feature`      | `scope:app1`, `type:feature`, `platform:client`       |
| `app2-feature`      | `@journeys/app2-feature`      | `scope:app2`, `type:feature`, `platform:client`       |
| `auth-client`       | `@journeys/auth-client`       | `scope:auth`, `type:feature`, `platform:client`       |
| `auth-server`       | `@journeys/auth-server`       | `scope:auth`, `type:data-access`, `platform:server`   |
| `shared-api-client` | `@journeys/shared-api-client` | `scope:shared`, `type:data-access`, `platform:shared` |
| `ui-components`     | `@journeys/ui-components`     | `scope:ui`, `type:ui`, `platform:client`              |

Configure module boundaries with these rules:

- The portal may depend on all workspace libraries.
- App 1 may depend only on App 1, shared, UI, and auth libraries.
- App 2 may depend only on App 2, shared, UI, and auth libraries.
- UI may depend only on UI and shared libraries.
- Auth may depend only on auth, UI, and shared libraries.
- Shared may depend only on shared libraries.
- Client libraries must never import the auth server library.
- Use package exports. Do not deep-import another team's source files.

### Application behavior

Build a polished getting-started page at `/` that explains the single
deployment and team boundaries. It must link to App 1, App 2, the auth route,
and the health endpoint. Show the local commands each team can run.

Create a shared `JourneyShell` with navigation links for Home, App 1, App 2,
and Sign in. Create a reusable `ModuleMark` and an auth-owned `UserPill`.
Use accessible semantic HTML, visible focus states, responsive layouts, CSS
modules, and no UI framework dependency.

Use an editorial visual style with warm paper colors, dark ink, a citrus accent,
a blue accent, serif display headings, monospace technical labels, borders, and
subtle grid or orbital details. Preserve usability on narrow screens.

### App 1: pre-sign-on

`/app1` is public and must work without a session. Render an `App1Feature`
client component containing an accessible request form with:

- Request title.
- Requester.
- Priority: `standard`, `high`, or `urgent`.
- Description.
- Native required and minimum-length validation.
- Loading, success, and API error states.

Submit through a typed `submitApp1()` client to `POST /api/app1`. Validate the
body again in the Route Handler. Return a generated receipt with this shape:

```ts
interface App1Receipt {
  id: string;
  status: 'accepted';
  submittedAt: string;
  summary: string;
}
```

Return status 400 and a JSON error for invalid input. Return status 201 for a
valid request.

### Authentication route

Create `/auth` as a demonstration sign-on page. Clearly label the identity as a
local sample that must be replaced by the organization's OIDC provider before
production. Use the sample user `Alex Morgan`, role `Application developer`.

Create `POST /api/auth/login` and `POST /api/auth/logout` Route Handlers:

- Login sets an HTTP-only, same-site `lax`, path `/`, eight-hour session cookie.
- Set `secure: true` in production.
- Validate `returnTo`: it must begin with one `/` and must not begin with `//`.
- Use a 303 redirect after form POST.
- Logout expires the same cookie and redirects home.
- Do not expose the session cookie to browser JavaScript.

Put shared cookie constants, the `UserSession` type, and asynchronous
`getSession()` in `@journeys/auth-server`. Keep auth server code out of client
bundles. This fixed demo identity is only an integration sample; document that
OIDC, signed sessions, authorization claims, CSRF controls, and provider logout
are required before production.

### App 2: post-sign-on

`/app2` is protected. Its Server Component must call `getSession()` before
rendering. Redirect unauthenticated requests to
`/auth?returnTo=/app2`. After sign-on, render the user identity and
`App2Feature`.

`App2Feature` is a client component that calls typed `getApp2Queue()`, renders a
responsive work queue, and supports loading, ready, refresh, and error states.
The queue contains work item ID, title, owner, priority, target, progress, and
status.

Protect `GET /api/app2` independently of the page. Return status 401 with a JSON
error when the session is missing. Return a no-store `App2QueueResponse` for an
authenticated request. Page protection alone is insufficient.

### Shared API client

Create and export:

- `Priority`.
- `App1Request` and `App1Receipt`.
- `App2Item` and `App2QueueResponse`.
- `HealthResponse`.
- `ApiError` with the response status.
- `submitApp1()` and `getApp2Queue()`.

The request helper must parse JSON errors and provide a useful fallback error.
Use same-origin relative API URLs.

### Team development commands

Add these scripts:

```json
{
  "dev": "nx dev portal",
  "dev:app1": "nx dev portal --port=4201",
  "dev:app2": "nx dev portal --port=4202",
  "test:app1": "nx test app1-feature --configuration=ci",
  "test:app2": "nx test app2-feature --configuration=ci",
  "lint": "nx run-many -t lint",
  "typecheck": "nx run-many -t typecheck",
  "test": "nx run-many -t test --configuration=ci",
  "build": "cross-env NODE_ENV=production nx build portal"
}
```

Explain that the focused development commands provide team workbenches but
still use the portal as the Next.js runtime host. In development, Next.js
compiles requested routes on demand. In CI, use `nx affected` so a change builds
and tests only the changed projects and their consumers. A production App 2
change still produces a new portal image because the deployment unit is the
whole application.

### Tests

Write meaningful tests for:

- App 1 form rendering and native required validation.
- App 2 loading and rendering a mocked API response.
- Shared API client URL, method, payload, response, and error handling.
- Shared `JourneyShell` and `UserPill` rendering.
- The portal getting-started page.
- Playwright: navigate from Home to public App 1.
- Playwright: direct navigation to App 2 redirects to Auth, sign-on succeeds,
  and App 2 renders.
- Route behavior: unauthenticated App 2 API access returns 401.

Do not rely only on hiding navigation for authorization. Verify the page and API
boundaries.

### Formatting and pre-commit checks

Install Husky and lint-staged. Add `prepare: husky`, `format: prettier --write
.`, `format:check: prettier --check .`, and `precommit: lint-staged` scripts.
Create `.husky/pre-commit` to run the precommit script from the repository root.
Configure lint-staged with:

```js
export default {
  '*': 'prettier --check --ignore-unknown',
};
```

The hook must reject staged files that are not already formatted. It must not
silently rewrite staged content. Ignore generated Nx data, coverage, build
outputs, package lock formatting, Next-generated types, Husky internals, and
Helm templates containing Go template syntax.

### Container and OpenShift requirements

Configure Next.js standalone output with a monorepo-aware output file tracing
root. Create a multi-stage Node 22 Alpine Dockerfile:

1. Copy root and workspace package manifests, then run `npm ci`.
2. Copy the repository and build the portal with the Nx daemon disabled.
3. Copy standalone output, public files, and static assets to a minimal runtime.
4. Listen on port 3000 and host `0.0.0.0`.
5. Support an OpenShift-assigned non-root UID.
6. Use writable `/tmp` and Next cache locations with a read-only root
   filesystem.

Create one Helm chart for the portal with:

- Deployment, Service, ServiceAccount, and OpenShift Route.
- Startup, readiness, and liveness probes against the health route.
- Security context suitable for restricted OpenShift policies.
- Read-only root filesystem and writable cache/temp mounts.
- Resource requests and limits.
- Optional HPA.
- PodDisruptionBudget.
- NetworkPolicy.
- `values.schema.json`.
- Environment overlays for development and production.
- Image repository, tag, and digest values; production promotion should prefer
  the tested immutable digest.

Expose stable repository commands for Lightspeed to invoke. Do not invent
proprietary Lightspeed YAML fields without an organization-provided example.

### CI adapter

Create `tools/ci/verify.sh`. With `NX_BASE` and `NX_HEAD`, run affected lint,
typecheck, and tests. Without both variables, run the full workspace checks.
Always build the portal for an integration candidate. Keep deploy and promotion
operations out of the Nx cache.

### Documentation

Write a root README covering:

- Five-minute setup with Node 22, `npm ci`, and `npm run dev`.
- App 1 pre-sign-on, Auth, and App 2 post-sign-on behavior.
- Team workbench and focused test commands.
- API examples with curl.
- Workspace ownership map.
- One-image release behavior and Nx affected behavior.
- Formatting and Husky workflow.
- Docker, Helm, OpenShift, and Lightspeed integration points.
- The local demo auth limitation and production OIDC replacement.

### Required verification

Before reporting completion, run and fix failures from:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
helm lint deploy/helm/portal
helm template journey-hub deploy/helm/portal \
  -f deploy/environments/dev/values.yaml
```

Also verify manually or with Playwright:

1. `/app1` opens without authentication.
2. `/app2` redirects to `/auth?returnTo=/app2` without a session.
3. Demo sign-on sets an HTTP-only cookie and opens App 2.
4. `/api/app2` returns 401 without the cookie and 200 with it.
5. Logout expires the cookie and App 2 becomes protected again.
6. The pre-commit formatter rejects an intentionally unformatted staged file
   and accepts it after running Prettier.

Report the files created, the behavior implemented, the validation results, and
any environment limitation. Do not stop after scaffolding or after producing a
plan.

---

## Expected result

The finished repository should let each team work in its own Nx project while
demonstrating the complete public-to-authenticated route transition. It should
produce one tested portal image and one OpenShift Helm release, with clear seams
for replacing the local identity sample and connecting the organization's
Lightspeed pipeline.
