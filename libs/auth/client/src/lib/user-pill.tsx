import styles from './user-pill.module.css';

export function UserPill({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
  return (
    <div className={styles.pill} title={role}>
      <span aria-hidden="true">{initials}</span>
      <div>
        <strong>{name}</strong>
        <small>{role}</small>
      </div>
    </div>
  );
}
