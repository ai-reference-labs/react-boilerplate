'use client';

import { useState, type FormEvent } from 'react';
import {
  submitIntake,
  type IntakeReceipt,
  type Priority,
} from '@journeys/shared-api-client';
import styles from './intake-feature.module.css';

export function IntakeFeature() {
  const [state, setState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [receipt, setReceipt] = useState<IntakeReceipt | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState('submitting');
    setError('');

    try {
      const result = await submitIntake({
        title: String(form.get('title') ?? ''),
        requester: String(form.get('requester') ?? ''),
        description: String(form.get('description') ?? ''),
        priority: String(form.get('priority') ?? 'standard') as Priority,
      });
      setReceipt(result);
      setState('success');
      event.currentTarget.reset();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to submit the request.',
      );
      setState('error');
    }
  }

  return (
    <div className={styles.grid}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeading}>
          <div>
            <span>DEMO FORM</span>
            <h2>Describe the need</h2>
          </div>
          <span className={styles.step}>1 / 1</span>
        </div>
        <label>
          Request title
          <input
            name="title"
            required
            minLength={3}
            placeholder="e.g. Simplify renewal intake"
          />
        </label>
        <div className={styles.row}>
          <label>
            Requester
            <input name="requester" required placeholder="Team or person" />
          </label>
          <label>
            Priority
            <select name="priority" defaultValue="standard">
              <option value="standard">Standard</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
        </div>
        <label>
          What outcome do you need?
          <textarea
            name="description"
            required
            minLength={10}
            rows={5}
            placeholder="Include the user, problem, and desired result."
          />
        </label>
        {state === 'error' && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Submitting…' : 'Submit to sample API'}
          <span aria-hidden="true">→</span>
        </button>
      </form>

      <aside className={styles.apiPanel}>
        <p className={styles.label}>LIVE CONTRACT</p>
        <h2>POST /api/intake</h2>
        <p>
          The form calls the shared typed client. The Next.js route validates
          the body and returns a generated receipt.
        </p>
        <pre>{`{
  "title": string,
  "requester": string,
  "description": string,
  "priority": "standard" | "high" | "urgent"
}`}</pre>
        {receipt && (
          <div className={styles.receipt} role="status">
            <span>ACCEPTED</span>
            <strong>{receipt.id}</strong>
            <p>{receipt.summary}</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default IntakeFeature;
