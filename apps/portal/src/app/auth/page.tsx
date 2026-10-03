import type { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@journeys/auth-server';
import { UserPill } from '@journeys/auth-client';
import styles from './auth.module.css';

export const metadata: Metadata = { title: 'Authentication' };

function safeReturnTo(value: string | string[] | undefined) {
  const path = typeof value === 'string' ? value : '/app2';
  return path.startsWith('/') && !path.startsWith('//') ? path : '/app2';
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const session = await getSession();
  const returnTo = safeReturnTo((await searchParams).returnTo);

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/">JH · Journey Hub</Link>
        <Link href="/app1">Open public App 1</Link>
      </nav>

      <section className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>AUTH TEAM · SAMPLE ROUTE</p>
          <h1>{session ? 'Session active.' : 'Continue to App 2.'}</h1>
          <p>
            App 1 is available before sign-on. App 2 checks an HTTP-only session
            on both its page and API route.
          </p>
        </div>

        <div className={styles.card}>
          {session ? (
            <>
              <span className={styles.status}>SIGNED IN</span>
              <UserPill name={session.name} role={session.role} />
              <Link className={styles.primary} href={returnTo}>
                Continue to App 2 →
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className={styles.secondary} type="submit">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <span className={styles.status}>DEMO IDENTITY</span>
              <h2>Alex Morgan</h2>
              <p>Application developer</p>
              <form action="/api/auth/login" method="post">
                <input type="hidden" name="returnTo" value={returnTo} />
                <button className={styles.primary} type="submit">
                  Sign in and open App 2 →
                </button>
              </form>
              <small>
                Local demonstration only. Replace this route with your OIDC
                provider before production.
              </small>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
