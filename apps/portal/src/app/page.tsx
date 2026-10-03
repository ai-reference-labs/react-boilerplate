import Link from 'next/link';
import { UserPill } from '@journeys/auth-client';
import { ModuleMark } from '@journeys/ui-components';
import styles from './page.module.css';

const modules = [
  {
    id: '01',
    name: 'Intake',
    owner: 'Intake team',
    description:
      'Capture a request, validate it, and hand a typed record to planning.',
    href: '/intake',
    command: 'npm run dev:intake',
    tone: 'citrus' as const,
  },
  {
    id: '02',
    name: 'Planning',
    owner: 'Planning team',
    description:
      'Load the sample queue and turn accepted requests into delivery plans.',
    href: '/planning',
    command: 'npm run dev:planning',
    tone: 'blue' as const,
  },
];

export default function GettingStartedPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Primary navigation">
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>JH</span>
          <span>Journey Hub</span>
        </Link>
        <div className={styles.navMeta}>
          <span className={styles.environment}>LOCAL / READY</span>
          <UserPill name="Alex Morgan" role="Application developer" />
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>NX · NEXT.JS · OPENSHIFT</p>
        <h1>
          One application.
          <br />
          Clear team <em>lanes.</em>
        </h1>
        <p className={styles.intro}>
          Start a journey, follow the API call, and see how independently owned
          modules come together in one release.
        </p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryAction} href="/intake">
            Run the sample journey <span aria-hidden="true">↗</span>
          </Link>
          <a className={styles.textAction} href="#team-modules">
            View team commands ↓
          </a>
        </div>
        <div className={styles.orbit} aria-hidden="true">
          <span className={styles.orbitCore}>1</span>
          <span className={styles.orbitLabel}>deployable</span>
          <span className={styles.orbitSub}>5 team boundaries</span>
        </div>
      </section>

      <section className={styles.statusStrip} aria-label="Workspace status">
        <div>
          <strong>05</strong>
          <span>owned libraries</span>
        </div>
        <div>
          <strong>03</strong>
          <span>sample API routes</span>
        </div>
        <div>
          <strong>01</strong>
          <span>OpenShift image</span>
        </div>
        <div className={styles.liveStatus}>
          <i /> API mock online
        </div>
      </section>

      <section className={styles.modules} id="team-modules">
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>TEAM WORKBENCHES</p>
            <h2>Choose your lane</h2>
          </div>
          <p>
            Each module owns its code and checks. The portal supplies the
            runtime shell.
          </p>
        </header>

        <div className={styles.moduleGrid}>
          {modules.map((module) => (
            <article className={styles.moduleCard} key={module.name}>
              <div className={styles.cardTopline}>
                <ModuleMark label={module.id} tone={module.tone} />
                <span>{module.owner}</span>
              </div>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
              <code>{module.command}</code>
              <Link href={module.href}>
                Open module <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}

          <article className={`${styles.moduleCard} ${styles.systemCard}`}>
            <div className={styles.cardTopline}>
              <ModuleMark label="API" tone="ink" />
              <span>Shared contract</span>
            </div>
            <h3>Try the API</h3>
            <p>
              The health endpoint is a small example of a typed route consumed
              by the UI.
            </p>
            <code>GET /api/health</code>
            <a href="/api/health">
              View JSON <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </section>

      <section className={styles.flow}>
        <div>
          <p className={styles.eyebrow}>RELEASE FLOW</p>
          <h2>
            Independent work,
            <br />
            integrated evidence.
          </h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>Own</strong>
              <p>Team library, route, tests, and API contract.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Verify</strong>
              <p>Nx runs changed projects and their consumers.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Promote</strong>
              <p>One immutable image moves through OpenShift.</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  );
}
