// CaseCard.tsx — horizontal archive panel for each operation
import { useState } from 'react';

interface OpData {
  caseNumber: string;
  codename: string;
  classification: string;
  status: string;
  realName: string;
  stack: string[];
  role: string;
  outcome: string;
  period: string;
  heroVisual: string;
}

interface Props {
  op: OpData;
  slug: string;
}

const STATUS_LABEL: Record<string, string> = {
  DEPLOYED: 'DEPLOYED',
  IN_DEVELOPMENT: 'IN_DEVELOPMENT',
  CONCEPT: 'CONCEPT',
  ARCHIVED: 'ARCHIVED',
};

export default function CaseCard({ op, slug }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full max-w-[920px] grid gap-12"
      style={{ gridTemplateColumns: '1fr 1fr' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* visual panel */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '4 / 5',
          backgroundColor: '#1A1A22',
          border: '0.5px solid rgba(255,255,255,0.12)',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${op.heroVisual}`}
          alt=""
          className="w-full h-full object-cover"
          style={{
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 700ms cubic-bezier(0.65, 0, 0.35, 1)',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(transparent 50%, rgba(10,10,15,0.8))' }}
        />
        {/* placeholder label */}
        <div
          className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'rgba(125,249,255,0.6)' }}
        >
          [ HERO_VISUAL ]
        </div>
      </div>

      {/* info panel */}
      <div className="flex flex-col justify-center">
        {/* case number */}
        <div
          className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          CASE_FILE_{op.caseNumber} //
        </div>

        {/* operation name */}
        <h3
          className="font-serif leading-[1.05] mb-1"
          style={{
            fontSize: 'clamp(32px, 3.8vw, 52px)',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 400,
            fontStyle: 'normal',
          }}
        >
          OPERATION:
        </h3>
        <h3
          className="font-serif leading-[1.05] mb-6"
          style={{
            fontSize: 'clamp(32px, 3.8vw, 52px)',
            color: '#7DF9FF',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          {op.codename}
        </h3>

        {/* metadata readout */}
        <div
          className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2]"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <div>CLASSIFICATION: {op.classification}</div>
          <div>STATUS:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{STATUS_LABEL[op.status]}</div>
          <div>PERIOD:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{op.period}</div>
          <div>STACK:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{op.stack.join(' · ')}</div>
        </div>

        {/* outcome */}
        <p
          className="font-sans text-[14px] leading-[1.7] mt-6 max-w-[400px]"
          style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}
        >
          {op.outcome}
        </p>

        {/* CTA */}
        <a
          href={`/null-sector/case/${slug}`}
          className="inline-block mt-8 font-mono text-[11px] tracking-[0.2em] uppercase"
          style={{
            color: '#7DF9FF',
            border: '0.5px solid rgba(125,249,255,0.4)',
            padding: '8px 16px',
            transition: 'background-color 200ms cubic-bezier(0.65, 0, 0.35, 1)',
            backgroundColor: hovered ? 'rgba(125,249,255,0.08)' : 'transparent',
            alignSelf: 'flex-start',
          }}
        >
          OPEN CASE FILE →
        </a>
      </div>
    </div>
  );
}
