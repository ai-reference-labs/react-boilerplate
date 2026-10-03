# Multi-team React / Next.js / Nx boilerplate implementation plan

Prepared October 2, 2026 and updated October 3, 2026. Status: starter implementation complete; production identity and proprietary Lightspeed integration remain environment-specific.

The confirmed model is one deployed application with separately managed team releases, hosted on OpenShift. This plan treats Lightspeed as the internal delivery platform; its pipeline schema, underlying CI runner, supported Helm version, and promotion integration remain unconfirmed.

1. Establish the architecture and release contract

---

Build one Next.js App Router application in an Nx monorepo. React libraries contain journey features, reusable UI, authentication integration, and supporting logic. Produce one application image and one Helm release per environment; a production release may run multiple replicas of that same image.

Distinguish three events:

| Event                  | Owner                                        | Result                                                             |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| Team readiness         | App 1, App 2, UI, or auth team               | Reviewed change, tests, compatibility declaration, release notes   |
| Application deployment | App team with platform support               | Tested source snapshot becomes one immutable image                 |
| Feature activation     | Journey owner under the agreed change policy | An already deployed feature is enabled for a cohort or environment |

Recommend source-based internal libraries initially. All libraries are compiled from the application release's Git commit. A team release label records readiness; it does not select an older library implementation. A disabled feature still has to compile, pass integration tests, and avoid side effects while disabled.

For example, App 1 can approve its new flow for application 1.4.0 while App 2's new editor remains disabled. Both implementations may exist in the image; only the approved behavior is activated. Reverting the image reverts the whole application. A correctly implemented feature flag can disable one journey change without an image rollback.

If the requirement later becomes “assemble App 1 version 2.3.0 with App 2 version 1.8.0 despite newer App 2 source in this repository,” introduce immutable packages in a private registry, exact dependency pins, and promotion PRs. Workspace source aliases or workspace links cannot provide that selection. Published packages also need tested React peer dependencies, server/client exports, declaration files, and preserved React Server Component directives. Nx Release can manage independent package versions; publishing a library never deploys the app automatically. See [independent releases](https://nx.dev/docs/guides/nx-release/release-projects-independently) and [release groups](https://nx.dev/docs/guides/nx-release/release-groups).

2. Allocate ownership

---

| Team              | Primary responsibility                                                                                      | Required collaboration                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| App               | Shell, global layout, navigation, route composition conventions, runtime configuration, integration release | All teams for shared integration changes                                                                   |
| UI-components     | Design tokens, accessible primitives, shared patterns, Storybook                                            | Consumers for breaking changes                                                                             |
| App 1             | Pre-sign-on routes, features, domain rules, API adapters, journey tests, activation flags                   | Auth for transitions; app for global navigation                                                            |
| App 2             | Post-sign-on routes, features, domain rules, API adapters, journey tests, activation flags                  | Auth for permissions; App 1 through explicit business contracts                                            |
| Auth              | Identity-provider integration, session lifecycle, server authorization helpers, client session views        | App and journey owners for access rules                                                                    |
| Platform function | Lightspeed integration, OpenShift, registry, secrets, deployment permissions, Helm conventions              | Assign to existing platform staff or app team; this is an ownership requirement, not a new team assumption |

Use CODEOWNERS, or the source host's equivalent, plus enforced review rules. Journey teams own their thin route files as well as libraries; they should not need the app team for every page change. Global layouts and navigation are app-owned. Root dependencies, Nx configuration, shared chart, and pipeline templates need designated platform/app review.

3. Scaffold the workspace

---

Proposed layout; directories grouped below contain separate Nx projects where a real ownership or dependency boundary exists. Do not create every empty library on day one.

```text
apps/
  portal/
    src/app/
      layout.tsx
      app1/page.tsx
      app2/page.tsx
      auth/page.tsx
      api/auth/...
      api/health/live/route.ts
      api/health/ready/route.ts
    next.config.ts
    project.json
  portal-e2e/
libs/
  app1/{feature,domain,data-access}/
  app2/{feature,domain,data-access}/
  ui/{tokens,components}/
  auth/{server,client,contracts}/
  shared/{contracts,config,feature-flags,observability,test-utils}/
tools/
  generators/
  ci/
deploy/
  helm/portal/
    Chart.yaml
    values.yaml
    values.schema.json
    templates/
  environments/{dev,qa,uat,prod}/values.yaml
releases/
  team-changes/
docs/
  architecture/
  runbooks/
nx.json
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.base.json
eslint.config.mjs
Dockerfile
.dockerignore
CODEOWNERS
```

Select and pin an organization-supported Node LTS, pnpm, Nx, Next.js, React, and TypeScript compatibility set during scaffolding. Keep `nx` and official `@nx/*` package versions aligned. Commit one lockfile; CI uses frozen installation. Do not use floating `latest` versions in the delivered boilerplate. Nx currently documents Next.js support from 15 up to, but excluding, 17; verify the exact patch combination against the selected release before generating the workspace. See [Nx Next.js integration](https://nx.dev/docs/technologies/react/next/introduction).

Use TypeScript strict mode, ESLint flat configuration, one formatter, React Testing Library with Vitest, Playwright, and Storybook. Use browser/integration tests for server-rendered behavior that a component test cannot reproduce. Keep styling conventions centralized in the UI team.

4. Configure Nx deliberately

---

Start with official generators and inferred targets. Add project metadata and explicit targets only where needed. `@nx/next/plugin` infers application tasks; configure ESLint, the selected test runner, Playwright, and Storybook through their supported Nx integrations. Confirm every intended command through `nx show project` rather than assuming a target exists.

The following is a partial configuration example, not a complete generated configuration:

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main",
  "plugins": [
    {
      "plugin": "@nx/next/plugin",
      "options": {
        "buildTargetName": "build",
        "devTargetName": "dev",
        "startTargetName": "start"
      }
    }
  ],
  "targetDefaults": {
    "lint": { "cache": true },
    "test": { "cache": true },
    "typecheck": { "cache": true },
    "deploy": { "cache": false },
    "publish": { "cache": false }
  }
}
```

Define or infer `typecheck` explicitly for every relevant project; `targetDefaults` alone does not create targets. Preserve plugin-inferred build outputs and dependencies, and inspect the effective configuration before overriding them. Source-only libraries do not need artificial standalone build steps; publishable libraries do.

Configure cache inputs to include relevant shared configuration, dependency changes, toolchain versions, and build-time environment values. Extend generated inputs carefully; overriding arrays can discard necessary inferred inputs. Runtime-only deployment settings should not force a rebuild. Never cache deployment, publishing, signing, or live-environment verification. Start with local caching; enable an approved remote cache with controlled write access once policy and infrastructure are available. See [Nx inputs](https://nx.dev/docs/reference/inputs) and [project configuration](https://nx.dev/docs/reference/project-configuration).

Use three independent tag dimensions:

```json
{
  "name": "app1-feature",
  "tags": ["scope:app1", "type:feature", "platform:client"]
}
```

Example dependency policy:

| Source | Allowed scope dependencies          |
| ------ | ----------------------------------- |
| App    | App, App 1, App 2, UI, auth, shared |
| App 1  | App 1, UI, auth, shared             |
| App 2  | App 2, UI, auth, shared             |
| UI     | UI and shared                       |
| Auth   | Auth, UI, shared                    |
| Shared | Shared                              |

Add type constraints: domain libraries depend on domain/contracts/utilities, UI primitives depend on UI primitives/tokens/utilities, and data-access depends on domain/contracts/utilities. No library imports an app. Client projects cannot import server projects; use `server-only` guards and explicit exports for sensitive modules. Server components may intentionally render client components, so do not apply a blanket inverse prohibition.

Enforce the policy with `@nx/enforce-module-boundaries`; prohibit deep imports, cycles, and untagged production projects. A generator and CI check require tags on new projects. Keep exports narrow. If App 2 needs App 1 data, use a defined API or neutral contract, not App 1 feature internals. Nx supports tag-based constraints through its [module boundary rule](https://nx.dev/docs/features/enforce-module-boundaries).

Verification commands after generation:

```bash
pnpm nx graph
pnpm nx show project portal
pnpm nx run-many -t lint,typecheck,test
pnpm nx build portal
pnpm nx run portal-e2e:e2e
```

Test cache behavior by changing a journey source file, a shared UI file, and shared configuration. Confirm the expected dependents are invalidated and that an unchanged rerun restores the build correctly.

5. Implement the application conventions

---

Keep route modules thin: they compose feature exports and handle Next.js routing concerns. Give each journey loading, error, empty, forbidden, and validation states. Make the initial boilerplate demonstrate one pre-sign-on App 1 form and one post-sign-on App 2 view with mocked APIs, typed contracts, and an accessible shared layout.

Keep transient UI state within a journey; use a server-state library only where needed. Store cross-journey business state in APIs. Route navigation may carry stable record IDs; avoid coupling journeys through a giant global store.

Auth owns integration with the existing OIDC provider, not a new identity service. Implement server-side session validation and permission checks in the data-access and mutation paths. UI visibility is supplementary. Use secure HTTP-only cookies, tested logout and expiration behavior, validated return URLs, and provider-appropriate CSRF protections. Mock identity locally; never make a production auth bypass part of the configuration.

Implement typed runtime feature flags with an owner, default, expiration, allowed audiences, and rollback instructions. Evaluate access-sensitive flags on the server and keep server/client decisions consistent. A disabled feature must block direct routes and mutations as appropriate, not merely disappear from navigation. A feature flag is not an authorization mechanism. Changes require an audit trail, a known failure fallback, and tests for both states.

6. Manage multiple team releases and application versions

---

Use trunk-based development, small PRs, and short-lived feature branches. Create temporary stabilization or maintenance branches only when a release policy needs them; avoid permanent branches for each team.

Each team supplies a small release record: owner, change summary, compatibility impact, affected flags, API prerequisites, tests, and activation criteria. The app release combines those records and captures the Git SHA, lockfile hash, app version, image digest, chart version, test evidence, and the approved initial flag configuration revision. Track subsequent flag changes separately because runtime flags can change without rebuilding the image.

Illustrative release composition:

| App image        | App 1              | App 2                            | UI/auth                     |
| ---------------- | ------------------ | -------------------------------- | --------------------------- |
| 1.4.0            | New form activated | New editor deployed but disabled | Compatible changes          |
| Same 1.4.0 image | Unchanged          | Editor activated after approval  | Unchanged                   |
| 1.4.1            | Bug fix            | Same approved behavior           | Same compatibility contract |

This supports separate readiness and activation dates. It does not isolate teams from compile failures, runtime crashes, incompatible shared changes, or application-wide rollback.

If multiple supported production versions are required, define the support window explicitly. Patch each supported version from its own maintenance branch, tag immutable artifacts, and test each backport. Separate environment releases or tenant installations may run different app images, but a single deployment represents one assembled app version.

7. Build the Lightspeed pipeline contract

---

Keep reusable validation/build/deploy scripts under `tools/ci`; connect them to the confirmed Lightspeed schema. Do not invent proprietary YAML fields. Record required inputs: repository/ref, app target, registry, chart location/version, environment, namespace, image digest, config revision, secret references, credentials, and change record where required.

| Stage             | Work                                                                              | Exit criterion                                |
| ----------------- | --------------------------------------------------------------------------------- | --------------------------------------------- |
| PR validation     | Frozen install, formatting, affected lint/typecheck/unit tests, module boundaries | Changed code and dependents pass              |
| Integration       | Portal build, component checks, contract tests, targeted browser tests            | Candidate works as one app                    |
| Release candidate | Full critical-journey suite, auth/flag cases, production build                    | Release checks approve the combined snapshot  |
| Package           | Build one OCI image, scan, generate SBOM, sign, push; package chart               | Immutable digest and chart recorded           |
| Dev / QA          | Deploy candidate, startup/readiness checks, smoke and integration tests           | Candidate accepted in shared test environment |
| UAT               | Promote same digest and approved runtime configuration                            | Business acceptance recorded                  |
| Production        | Required promotion gate, serialized deployment, smoke checks, observe             | Health and business checks meet thresholds    |
| Recovery          | Disable flag where effective, or redeploy prior image/chart/config                | Service restored and incident recorded        |

For PRs, use the merge base with the target branch; for mainline CI, use the last successful mainline validation SHA as the affected base, with fetched Git history. If history is unavailable, run the broader checks. Nx affected selection includes dependent projects, so a shared change can affect the portal. Add explicit handling for chart/pipeline changes outside application source projects. See [Nx affected CI](https://nx.dev/docs/features/ci-features/affected).

Allow only one promotion at a time for each environment, reject stale candidates, and preserve audit metadata. PR jobs must not receive production deploy credentials. Select one deployment authority: direct Helm via Lightspeed, or a GitOps controller consuming a Lightspeed promotion. Do not let both independently reconcile the same release.

8. Package Next.js for OpenShift

---

Use `output: 'standalone'`, a monorepo-aware tracing root, and a multi-stage container build. Verify the generated entrypoint and copy the standalone output, `public`, and `.next/static` to their correct runtime locations. Test the actual resulting container; testing only `next dev` does not verify packaging. See [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

Use an approved Node runtime base, support arbitrary non-root UIDs, listen on an unprivileged port, and allow writes only to designated writable paths. Apply the cluster's restricted security constraints without requiring a privileged service account. Make temporary/cache locations compatible with a read-only root filesystem and mounted writable volumes. See [OpenShift image guidance](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html-single/images/index).

Promote the same image digest through environments. Inject secrets and environment-specific values at runtime. Browser-visible `NEXT_PUBLIC_*` values are embedded during build; use an explicitly allowlisted runtime-config response or server-provided configuration for values that must differ across environments. Do not expose secrets in that response. This distinction is documented in [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting).

For multiple replicas, decide session storage, cache invalidation, and rollout behavior before production. Avoid process-local sessions. Use request-time rendering for personalized data; introduce shared Next.js caching only where required and prove cross-pod invalidation. If using Server Actions, handle encryption-key consistency, proxy origins, and version skew with the selected Next.js version. Preserve old static assets during rollouts and test clients with an already-open page. Configure proxy timeouts and buffering for streaming responses. These are explicit production validation items, not assumptions that Helm handles automatically.

9. Define the Helm and environment model

---

Use one reusable application chart and one `portal` release in each environment namespace, for example `portal-dev`, `portal-qa`, `portal-uat`, and `portal-prod`. Production cluster separation follows the existing platform policy. One chart must not embed separate App 1 and App 2 deployments under the chosen model.

Chart resources: Deployment, Service, OpenShift Route, ConfigMap, Secret references, ServiceAccount, NetworkPolicy, HPA where metrics support it, and PodDisruptionBudget. Platform-owned namespaces/RBAC stay outside app chart ownership where required. Put configurable resource requests/limits, replicas, probes, image digest, routing/TLS, runtime settings, and security context in values with a schema. Secrets come from the approved secret manager or cluster integration, not committed values files.

Include startup, readiness, and liveness endpoints. Liveness should describe process health, not restart the app because a remote API is temporarily unavailable. Readiness should reflect whether the instance can serve its intended workload. Test graceful termination and connection draining. Size resources with a representative load test; set initial minimum replicas and availability policy with the platform owner.

Validate every environment with Helm lint/render and cluster API/schema checks. Pin the Helm major used by Lightspeed: Helm 3 commonly uses `--atomic`, while Helm 4 documents `--rollback-on-failure`. An automatic Helm rollback responds to rollout failure; a business smoke-test failure needs an explicit pipeline recovery decision. See [Helm upgrade](https://docs.helm.sh/docs/helm/helm_upgrade/).

An app rollback does not reverse database/API changes. Keep external contracts compatible with the previous supported app release; coordinate schema changes using an expand/migrate/contract sequence if the application later owns persistence.

10. Add operational visibility and prove the release model

---

Emit structured logs with correlation IDs, app version, environment, and journey. Capture frontend exceptions, backend failures, traces, and Web Vitals without logging tokens or sensitive business payloads. Create alerts owned by the relevant team. Define availability, latency, error-rate, and recovery objectives after expected traffic and service criticality are known.

Acceptance scenarios:

1. A new team member can install and run the app from documented commands.
2. A journey generator produces a correctly tagged library, test setup, owner metadata, and a thin route example.
3. CI rejects an App 1 import from App 2 internals and rejects client imports of server auth code.
4. Shared UI/auth changes exercise affected consumers; chart-only changes still run chart validation.
5. App 1 can activate a feature while App 2's new feature stays disabled, including direct-link tests.
6. Unauthenticated, unauthorized, expired-session, logout, and CSRF-relevant flows behave correctly.
7. The same image digest reaches QA, UAT, and production with different runtime settings.
8. The container starts under the OpenShift-assigned UID and survives a multi-replica rollout.
9. Flag disable and full application rollback are rehearsed with recorded recovery times.
10. Every release is traceable to code, image, chart, configuration, approvals, and test evidence.

11. Deliver in stages

---

Estimate: approximately 5–7 calendar weeks for a usable production foundation with app/platform participation and part-time journey/UI/auth owners. Cluster access, identity setup, and Lightspeed onboarding can change the schedule. This excludes full business journeys.

| Phase                            | Indicative duration | Deliverables and exit condition                                                                             |
| -------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Decisions and platform discovery | 2–3 days            | Architecture record, release semantics, version matrix, Lightspeed sample, cluster/registry/identity access |
| Nx foundation                    | 3–5 days            | App and initial libraries, ownership, tags, enforced boundaries, local run and checks                       |
| Shared shell and sample journeys | 5–7 days            | Design primitives, auth integration, typed APIs, App 1/App 2 slices, flag contract                          |
| CI and release records           | 3–5 days            | Affected pipeline, complete candidate checks, release metadata, image build/scanning                        |
| OpenShift and Helm               | 4–6 days            | Same-image promotion, runtime config, probes, deployment gates, recovery rehearsal                          |
| Hardening and handover           | 4–6 days            | Multi-replica/load checks, observability, onboarding generator, runbooks, team acceptance                   |

Revisit package publishing when consumers need independently pinned team artifacts; revisit deployment boundaries only if the one-app deployment decision changes. Revisit shared caching and scaling after measuring the actual workload.

Inputs still needed before implementation: a representative Lightspeed pipeline, its underlying runner and Helm version, target OpenShift version/security policies, registry/secret manager, identity provider and permission model, environment promotion gates, required support window for older app releases, and traffic/availability targets. These do not prevent agreeing on the workspace architecture above.
