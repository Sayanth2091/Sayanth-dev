// CaseCard.tsx — horizontal archive panel for each operation
// Layout: visual (video or image) on top, text stacked underneath.
import { useEffect, useRef, useState } from 'react';

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
  heroVideo?: string;
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

// Honor the user's bandwidth preference: skip video on save-data or 2g links.
function shouldUseVideo(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (!conn) return true; // unknown → assume ok
  if (conn.saveData) return false;
  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return false;
  return true;
}

export default function CaseCard({ op, slug }: Props) {
  const [hovered, setHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [useVideo, setUseVideo] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const imgSrc = `${base}${op.heroVisual}`;
  const videoSrc = op.heroVideo ? `${base}${op.heroVideo}` : null;

  useEffect(() => {
    if (videoSrc) setUseVideo(shouldUseVideo());
  }, [videoSrc]);

  // Pause off-screen videos to save bandwidth/decoder time.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [useVideo, videoFailed]);

  const showVideo = !!videoSrc && useVideo && !videoFailed;

  return (
    <div
      className="case-card w-full max-w-[1040px] grid gap-10 items-center"
      style={{
        gridTemplateColumns: isDesktop ? 'minmax(0, 1.05fr) minmax(0, 1fr)' : '1fr',
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* visual panel — sits on top, acts as the folder cover */}
      <div
        className="case-visual relative overflow-hidden w-full"
        style={{
          aspectRatio: '4 / 5',
          backgroundColor: '#1A1A22',
          border: '0.5px solid rgba(255,255,255,0.12)',
          zIndex: 2,
          // a soft shadow on the right edge sells the "folder cover" depth
          boxShadow: '8px 0 24px -8px rgba(0,0,0,0.6)',
        }}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            src={videoSrc!}
            poster={imgSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover"
            style={{
              opacity: hovered ? 1 : 0.78,
              transition: 'opacity 700ms cubic-bezier(0.65, 0, 0.35, 1)',
            }}
          />
        ) : (
          <img
            src={imgSrc}
            alt=""
            className="w-full h-full object-cover"
            style={{
              opacity: hovered ? 1 : 0.78,
              transition: 'opacity 700ms cubic-bezier(0.65, 0, 0.35, 1)',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

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
          [ {showVideo ? 'HERO_FEED' : 'HERO_VISUAL'} ]
        </div>
      </div>

      {/* info panel — slides out from behind the visual */}
      <div
        className="case-info flex flex-col"
        style={{ position: 'relative', zIndex: 1, willChange: 'transform' }}
      >
        {/* case number */}
        <div
          className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          CASE_FILE_{op.caseNumber} //
        </div>

        {/* operation name */}
        <h3
          className="font-serif leading-[1.05]"
          style={{
            fontSize: 'clamp(28px, 3.2vw, 44px)',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 400,
            fontStyle: 'normal',
          }}
        >
          OPERATION:{' '}
          <span style={{ color: '#7DF9FF', fontStyle: 'italic' }}>{op.codename}</span>
        </h3>

        {/* metadata readout */}
        <div
          className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2] mt-4"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <div>CLASSIFICATION: {op.classification}</div>
          <div>STATUS: {STATUS_LABEL[op.status]}</div>
          <div>PERIOD: {op.period}</div>
          <div>STACK: {op.stack.join(' · ')}</div>
        </div>

        {/* outcome */}
        <p
          className="font-sans text-[14px] leading-[1.7] mt-4"
          style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}
        >
          {op.outcome}
        </p>

        {/* CTA */}
        <a
          href={`${base}/case/${slug}`}
          className="inline-block mt-6 font-mono text-[11px] tracking-[0.2em] uppercase"
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
