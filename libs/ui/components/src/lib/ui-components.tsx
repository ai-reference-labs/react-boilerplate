import type { ReactNode } from 'react';
import styles from './ui-components.module.css';

export type ModuleTone = 'citrus' | 'blue' | 'ink';

export function ModuleMark({
  label,
  tone = 'ink',
}: {
  label: string;
  tone?: ModuleTone;
}) {
  return <span className={`${styles.mark} ${styles[tone]}`}>{label}</span>;
}

export function JourneyShell({
  number,
  title,
  owner,
  description,
  tone,
  children,
}: {
  number: string;
  title: string;
  owner: string;
  description: string;
  tone: ModuleTone;
  children: ReactNode;
}) {
  return (
    <main className={styles.shell}>
      <nav className={styles.nav} aria-label="Journey navigation">
        <a className={styles.home} href="/">
          <span>JH</span> Journey Hub
        </a>
        <div>
          <a href="/app1">App 1</a>
          <a href="/app2">App 2</a>
          <a href="/auth">Sign in</a>
        </div>
      </nav>
      <header className={styles.header}>
        <div className={styles.meta}>
          <ModuleMark label={number} tone={tone} />
          <span>{owner}</span>
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <section className={styles.workspace}>{children}</section>
    </main>
  );
}
