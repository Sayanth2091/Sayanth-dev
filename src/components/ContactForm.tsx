// ContactForm.tsx — transmission interface, posts to Formspree
import { useState } from 'react';
import { audio } from '../scripts/audio';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

const STATES = [
  { key: 'idle',         label: '> TRANSMIT [⏎]',              red: false },
  { key: 'encrypting',   label: '> ENCRYPTING...',             red: false },
  { key: 'routing',      label: '> ESTABLISHING ROUTE...',     red: false },
  { key: 'transmitting', label: '> TRANSMITTING...',           red: false },
  { key: 'success',      label: '> TRANSMITTED. ✓',            red: false },
  { key: 'error',        label: '> TRANSMISSION FAILED. RETRY.', red: true  },
] as const;

type StateKey = typeof STATES[number]['key'];

const FIELDS = [
  { key: 'name',    label: 'IDENTIFY YOURSELF', type: 'text'     },
  { key: 'email',   label: 'RETURN CHANNEL',    type: 'email'    },
  { key: 'message', label: 'PAYLOAD',           type: 'textarea' },
] as const;

type FieldKey = 'name' | 'email' | 'message';

export default function ContactForm() {
  const [status, setStatus]   = useState<StateKey>('idle');
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const [form, setForm]       = useState<Record<FieldKey, string>>({ name: '', email: '', message: '' });

  const current = STATES.find((s) => s.key === status)!;
  const busy    = status !== 'idle' && status !== 'error';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setStatus('encrypting');
    await delay(600);
    setStatus('routing');
    await delay(600);
    setStatus('transmitting');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      audio.play('transmit', { volume: 0.5 });
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  }

  const borderColor = (field: FieldKey) =>
    focused === field ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)';

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    color: 'var(--color-fg-high)',
    padding: '8px 0',
    transition: 'border-color 300ms var(--ease-cinematic)',
    resize: 'none' as const,
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* header */}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--color-fg-low)', textTransform: 'uppercase', marginBottom: 4 }}>
        [ TRANSMISSION INTERFACE ]
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: 40 }}>
        &gt; ENCRYPTING IN TRANSIT.
      </p>

      {/* fields */}
      {FIELDS.map(({ key, label, type }, i) => (
        <div key={key} style={{ marginBottom: 32 }}>
          <label
            htmlFor={`field-${key}`}
            style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--color-fg-low)', textTransform: 'uppercase', marginBottom: 8 }}
          >
            [ {String(i + 1).padStart(2, '0')} ] {label}
          </label>

          {type === 'textarea' ? (
            <textarea
              id={`field-${key}`}
              rows={6}
              required
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              onFocus={() => setFocused(key)}
              onBlur={() => setFocused(null)}
              style={{ ...inputBase, borderBottom: `0.5px solid ${borderColor(key)}`, display: 'block' }}
            />
          ) : (
            <input
              id={`field-${key}`}
              type={type}
              required
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              onFocus={() => setFocused(key)}
              onBlur={() => setFocused(null)}
              style={{ ...inputBase, borderBottom: `0.5px solid ${borderColor(key)}` }}
            />
          )}
        </div>
      ))}

      {/* submit */}
      <button
        type="submit"
        disabled={busy}
        style={{
          marginTop: 16,
          padding: '12px 24px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: current.red ? '#f87171' : 'var(--color-accent)',
          border: `0.5px solid ${current.red ? '#f87171' : 'var(--color-accent)'}`,
          background: 'transparent',
          cursor: busy ? 'default' : 'pointer',
          opacity: busy ? 0.6 : 1,
          transition: 'background 200ms var(--ease-cinematic), opacity 200ms',
        }}
        onMouseEnter={(e) => { if (!busy) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(125,249,255,0.08)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        {current.label}
      </button>
    </form>
  );
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
