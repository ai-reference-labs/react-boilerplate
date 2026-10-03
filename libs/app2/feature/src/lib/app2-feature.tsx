'use client';

import { useCallback, useEffect, useState } from 'react';
import { getApp2Queue, type App2Item } from '@journeys/shared-api-client';
import styles from './app2-feature.module.css';

export function App2Feature() {
  const [items, setItems] = useState<App2Item[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  const loadQueue = useCallback(async () => {
    setState('loading');
    try {
      const response = await getApp2Queue();
      setItems(response.items);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    void loadQueue();
  }, [loadQueue]);

  return (
    <div className={styles.board}>
      <div className={styles.toolbar}>
        <div>
          <span>SAMPLE QUEUE</span>
          <strong>
            {state === 'ready' ? `${items.length} active items` : 'Connecting…'}
          </strong>
        </div>
        <button
          type="button"
          onClick={() => void loadQueue()}
          disabled={state === 'loading'}
        >
          Refresh API ↻
        </button>
      </div>
      {state === 'loading' && (
        <div className={styles.message} role="status">
          Loading the App 2 API…
        </div>
      )}
      {state === 'error' && (
        <div className={styles.message} role="alert">
          The sample API is unavailable.{' '}
          <button type="button" onClick={() => void loadQueue()}>
            Try again
          </button>
        </div>
      )}
      {state === 'ready' && (
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Work item</th>
                <th>Owner</th>
                <th>Target</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={styles.id}>{item.id}</span>
                    <strong>{item.title}</strong>
                    <small>{item.priority} priority</small>
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.target}</td>
                  <td>
                    <div className={styles.progress}>
                      <i style={{ width: `${item.progress}%` }} />
                    </div>
                    <small>{item.progress}%</small>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <footer className={styles.contract}>
        <span>API CONTRACT</span>
        <code>GET /api/app2 → App2QueueResponse</code>
        <a href="/api/app2">Inspect JSON →</a>
      </footer>
    </div>
  );
}

export default App2Feature;
