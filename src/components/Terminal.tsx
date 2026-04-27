// Terminal.tsx — slash-triggered floating terminal
import { useState, useEffect, useRef } from 'react';
import { audio } from '../scripts/audio';

interface Line {
  type: 'input' | 'output';
  text: string;
}

const COMMANDS: Record<string, () => string | null> = {
  help: () =>
    `available commands:
  help          show this message
  whoami        print operator bio
  about         go to dossier
  projects      go to operations
  contact       go to transmission
  ls            list sections
  pwd           print working directory
  date          print system time
  easter        ???
  clear         clear screen
  exit          close terminal

  ↑ / ↓         navigate command history
  tab           autocomplete command
  esc           close terminal`,

  whoami: () =>
    `subject:        sayanth sreekanth
classification: soc analyst, researcher, builder
location:       kerala, india
years_active:   02
status:         active`,

  projects: () => {
    document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' });
    return 'navigating to operations.';
  },
  contact: () => {
    document.getElementById('transmission')?.scrollIntoView({ behavior: 'smooth' });
    return 'navigating to transmission.';
  },
  about: () => {
    document.getElementById('dossier')?.scrollIntoView({ behavior: 'smooth' });
    return 'navigating to dossier.';
  },
  clear: () => null,
  exit:  () => null,
  easter: () => 'ACCESS GRANTED. SCROLL DOWN. THE BLOCK CRACKS DEEPER.',
  sudo:  () => 'permission denied. nice try.',
  ls:    () => 'dossier  operations  arsenal  transmission  signoff  classified',
  pwd:   () => '/null_sector/skywalkr_2091',
  date:  () => new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
};

const INITIAL_HISTORY: Line[] = [
  { type: 'output', text: '// null_sector terminal v1.0' },
  { type: 'output', text: '// type "help" for commands' },
];

function isTypingInForm(target: EventTarget | null) {
  const t = target as HTMLElement;
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
}

export default function Terminal() {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [history, setHistory] = useState<Line[]>(INITIAL_HISTORY);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const cmdHistory = useRef<string[]>([]);
  const cmdCursor  = useRef<number>(-1);

  // open on `/`, close on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !open && !isTypingInForm(e.target)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // scroll to bottom on new history entry
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  function execute(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const next: Line[] = [...history, { type: 'input', text: raw }];
    audio.play('keystroke', { volume: 0.3 });

    if (cmd !== '') {
      cmdHistory.current.push(raw);
      cmdCursor.current = cmdHistory.current.length;
    }

    if (cmd === '') { setHistory(next); return; }
    if (cmd === 'clear') { setHistory([]); return; }
    if (cmd === 'exit')  { setOpen(false); return; }

    const fn = COMMANDS[cmd];
    const out = fn ? fn() : `command not found: ${cmd}`;
    if (out !== null) next.push({ type: 'output', text: out });
    setHistory(next);
  }

  function autocomplete(partial: string): string {
    const lower = partial.toLowerCase();
    const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(lower));
    if (matches.length === 1) return matches[0];
    return partial;
  }

  if (!open) return null;

  const BORDER_DIM   = 'rgba(255,255,255,0.1)';
  const ACCENT       = '#7DF9FF';
  const ACCENT_BG    = 'rgba(10,10,15,0.6)';
  const VOID         = '#0A0A0F';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,10,15,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          width: 480, height: 360,
          backgroundColor: VOID,
          border: `0.5px solid ${ACCENT}66`,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          display: 'flex', flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* title bar */}
        <div style={{
          borderBottom: `0.5px solid ${BORDER_DIM}`,
          padding: '8px 12px',
          fontSize: 10,
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>// TERMINAL — type 'help' for commands</span>
          <span
            style={{ cursor: 'pointer', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            onClick={() => setOpen(false)}
          >
            [ × ]
          </span>
        </div>

        {/* output area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '8px 12px',
          color: 'rgba(255,255,255,0.6)', lineHeight: 1.6,
        }}>
          {history.map((line, i) => (
            <div key={i} style={{ marginBottom: 2 }}>
              {line.type === 'input' ? (
                <span>
                  <span style={{ color: ACCENT }}>skywalkr_2091:~$</span>
                  {' '}{line.text}
                </span>
              ) : (
                <pre style={{
                  margin: 0, fontFamily: 'inherit', fontSize: 'inherit',
                  whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.6)',
                }}>
                  {line.text}
                </pre>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* input bar */}
        <div style={{
          borderTop: `0.5px solid ${BORDER_DIM}`,
          padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: ACCENT, flexShrink: 0 }}>skywalkr_2091:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              audio.play('keystroke', { volume: 0.15, pitch: 0.95 + Math.random() * 0.1 });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                execute(input);
                setInput('');
              } else if (e.key === 'Tab') {
                e.preventDefault();
                setInput(autocomplete(input));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (cmdCursor.current > 0) cmdCursor.current -= 1;
                const v = cmdHistory.current[cmdCursor.current];
                if (v !== undefined) setInput(v);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (cmdCursor.current < cmdHistory.current.length - 1) {
                  cmdCursor.current += 1;
                  setInput(cmdHistory.current[cmdCursor.current]);
                } else {
                  cmdCursor.current = cmdHistory.current.length;
                  setInput('');
                }
              }
            }}
            style={{
              flex: 1, background: 'transparent', outline: 'none', border: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'rgba(255,255,255,0.92)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
