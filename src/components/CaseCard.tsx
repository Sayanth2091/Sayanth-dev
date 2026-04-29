// CaseCard.tsx — horizontal archive panels.
// Four layouts share state hooks and dispatch into per-variant JSX:
//   standard  — visual left + info right (default, preserves prior look)
//   overprint — full-bleed media with title/metadata overprinted
//   strip     — narrow vertical visual strip + dominant typographic text column
//   oversize  — codename rendered as oversize background type, info floats in negative space
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

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

export type CaseVariant = 'standard' | 'overprint' | 'strip' | 'oversize';

interface Props {
  op: OpData;
  slug: string;
  variant?: CaseVariant;
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
  if (!conn) return true;
  if (conn.saveData) return false;
  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return false;
  return true;
}

interface VisualProps {
  imgSrc: string;
  videoSrc: string | null;
  showVideo: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVideoFail: () => void;
  hovered: boolean;
  className?: string;
  style?: CSSProperties;
  showLabel?: boolean;
}

function Visual({
  imgSrc,
  videoSrc,
  showVideo,
  videoRef,
  onVideoFail,
  hovered,
  className,
  style,
  showLabel = true,
}: VisualProps) {
  const opacity = hovered ? 1 : 0.78;
  const transition = 'opacity 700ms cubic-bezier(0.65, 0, 0.35, 1)';
  return (
    <div className={className} style={style}>
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
          onError={onVideoFail}
          className="w-full h-full object-cover"
          style={{ opacity, transition }}
        />
      ) : (
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity, transition }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      {showLabel && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(transparent 50%, rgba(8,16,14,0.8))' }}
          />
          <div
            className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(212,184,106,0.6)' }}
          >
            [ {showVideo ? 'HERO_FEED' : 'HERO_VISUAL'} ]
          </div>
        </>
      )}
    </div>
  );
}

interface MetaListProps {
  op: OpData;
  align?: 'left' | 'right';
  color?: string;
}

function MetaList({ op, align = 'left', color = 'rgba(255,255,255,0.6)' }: MetaListProps) {
  const items: Array<[string, ReactNode]> = [
    ['CLASSIFICATION', op.classification],
    ['STATUS', STATUS_LABEL[op.status]],
    ['PERIOD', op.period],
    ['STACK', op.stack.join(' · ')],
  ];
  return (
    <div
      className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2]"
      style={{ color, textAlign: align }}
    >
      {items.map(([k, v]) => (
        <div key={k}>
          {k}: {v}
        </div>
      ))}
    </div>
  );
}

interface CTAProps {
  base: string;
  slug: string;
  hovered: boolean;
}

function CTA({ base, slug, hovered }: CTAProps) {
  return (
    <a
      href={`${base}/case/${slug}`}
      className="inline-block font-mono text-[11px] tracking-[0.2em] uppercase"
      style={{
        color: 'var(--color-accent)',
        padding: '8px 16px',
        transition: 'background-color 200ms cubic-bezier(0.65, 0, 0.35, 1)',
        backgroundColor: hovered ? 'rgba(212,184,106,0.1)' : 'transparent',
        alignSelf: 'flex-start',
      }}
    >
      OPEN CASE FILE →
    </a>
  );
}

export default function CaseCard({ op, slug, variant = 'standard' }: Props) {
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
  const onVideoFail = () => setVideoFailed(true);

  // On mobile, all variants collapse to the standard side-by-side stack
  // (it's the layout that reads at narrow widths).
  const effectiveVariant: CaseVariant = isDesktop ? variant : 'standard';

  const sharedProps = {
    op,
    slug,
    base,
    imgSrc,
    videoSrc,
    showVideo,
    videoRef,
    onVideoFail,
    hovered,
    setHovered,
    isDesktop,
  };

  switch (effectiveVariant) {
    case 'overprint':
      return <OverprintLayout {...sharedProps} />;
    case 'strip':
      return <StripLayout {...sharedProps} />;
    case 'oversize':
      return <OversizeLayout {...sharedProps} />;
    case 'standard':
    default:
      return <StandardLayout {...sharedProps} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared layout props
// ─────────────────────────────────────────────────────────────────────────────
interface LayoutProps {
  op: OpData;
  slug: string;
  base: string;
  imgSrc: string;
  videoSrc: string | null;
  showVideo: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVideoFail: () => void;
  hovered: boolean;
  setHovered: (v: boolean) => void;
  isDesktop: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Standard — visual left, info right (the prior layout)
// ─────────────────────────────────────────────────────────────────────────────
function StandardLayout({ op, slug, base, imgSrc, videoSrc, showVideo, videoRef, onVideoFail, hovered, setHovered, isDesktop }: LayoutProps) {
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
      <Visual
        imgSrc={imgSrc}
        videoSrc={videoSrc}
        showVideo={showVideo}
        videoRef={videoRef}
        onVideoFail={onVideoFail}
        hovered={hovered}
        className="case-visual relative overflow-hidden w-full"
        style={{
          aspectRatio: '4 / 5',
          backgroundColor: '#1A1A22',
          border: '1px solid rgba(255,255,255,0.07)',
          zIndex: 2,
          boxShadow: '8px 0 24px -8px rgba(0,0,0,0.6)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div
        className="case-info flex flex-col"
        style={{ position: 'relative', zIndex: 1, willChange: 'transform' }}
      >
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          CASE_FILE_{op.caseNumber} //
        </div>
        <h3 className="font-serif leading-[1.05]" style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', color: 'rgba(255,255,255,0.92)', fontWeight: 400 }}>
          OPERATION:{' '}
          <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>{op.codename}</span>
        </h3>
        <div className="mt-4">
          <MetaList op={op} />
        </div>
        <p className="font-sans text-[14px] leading-[1.7] mt-4" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>
          {op.outcome}
        </p>
        <div className="mt-6">
          <CTA base={base} slug={slug} hovered={hovered} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Overprint — full-bleed media with title/metadata overprinted (NORTHWALL)
// ─────────────────────────────────────────────────────────────────────────────
function OverprintLayout({ op, slug, base, imgSrc, videoSrc, showVideo, videoRef, onVideoFail, hovered, setHovered }: LayoutProps) {
  return (
    <div
      className="case-card relative w-full max-w-[1280px]"
      style={{
        height: 'min(78vh, 720px)',
        backgroundColor: '#0c0e12',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* full-bleed visual — .ops-overprint-visual is targeted by scroll script */}
      <Visual
        imgSrc={imgSrc}
        videoSrc={videoSrc}
        showVideo={showVideo}
        videoRef={videoRef}
        onVideoFail={onVideoFail}
        hovered={hovered}
        className="ops-overprint-visual absolute inset-0"
        style={{ width: '100%', height: '100%', willChange: 'clip-path' }}
        showLabel={false}
      />
      {/* darken for legibility — top-left and bottom corners deeper */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top left, rgba(8,12,18,0.92) 0%, rgba(8,12,18,0.55) 40%, rgba(8,12,18,0.85) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,12,18,0.4) 0%, transparent 35%, transparent 65%, rgba(8,12,18,0.85) 100%)',
        }}
      />

      {/* top-left: case number + title */}
      <div className="ops-overprint-title absolute" style={{ top: 32, left: 40, right: 40, maxWidth: 720, willChange: 'transform, opacity' }}>
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(212,184,106,0.7)' }}>
          CASE_FILE_{op.caseNumber} // OVERPRINT
        </div>
        <div
          className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          OPERATION
        </div>
        <h3
          className="font-serif"
          style={{
            fontSize: 'clamp(56px, 8vw, 120px)',
            lineHeight: 0.92,
            color: 'rgba(255,255,255,0.96)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
          }}
        >
          {op.codename}
        </h3>
      </div>

      {/* bottom-left: outcome */}
      <div className="ops-overprint-body absolute" style={{ bottom: 32, left: 40, maxWidth: 480, willChange: 'transform, opacity' }}>
        <p className="font-sans text-[15px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 300 }}>
          {op.outcome}
        </p>
        <div className="mt-5">
          <CTA base={base} slug={slug} hovered={hovered} />
        </div>
      </div>

      {/* bottom-right: metadata, right-aligned */}
      <div className="absolute" style={{ bottom: 32, right: 40, maxWidth: 360 }}>
        <MetaList op={op} align="right" color="rgba(255,255,255,0.7)" />
      </div>

      {/* bottom-edge crop label */}
      <div
        className="absolute font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ top: 32, right: 40, color: 'rgba(212,184,106,0.5)' }}
      >
        [ {showVideo ? 'HERO_FEED' : 'HERO_VISUAL'} // FRAME 01 ]
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Strip — narrow vertical visual + dominant text (ASCLEPIUS)
// ─────────────────────────────────────────────────────────────────────────────
function StripLayout({ op, slug, base, imgSrc, videoSrc, showVideo, videoRef, onVideoFail, hovered, setHovered }: LayoutProps) {
  return (
    <div
      className="case-card w-full max-w-[1180px] grid gap-12"
      style={{ gridTemplateColumns: 'minmax(180px, 22%) 1fr', alignItems: 'stretch' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* narrow vertical strip */}
      <Visual
        imgSrc={imgSrc}
        videoSrc={videoSrc}
        showVideo={showVideo}
        videoRef={videoRef}
        onVideoFail={onVideoFail}
        hovered={hovered}
        className="case-visual relative overflow-hidden"
        style={{
          aspectRatio: '1 / 2.4',
          backgroundColor: '#1A1A22',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      />

      {/* text column dominates */}
      <div className="case-info flex flex-col justify-center" style={{ minHeight: '100%' }}>
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          CASE_FILE_{op.caseNumber} // STRIP
        </div>

        <div className="font-mono text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
          OPERATION
        </div>
        <h3
          className="font-serif"
          style={{
            fontSize: 'clamp(48px, 6vw, 92px)',
            lineHeight: 0.98,
            color: 'rgba(255,255,255,0.96)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>{op.codename}</span>
        </h3>

        <p
          className="font-serif"
          style={{
            fontSize: 'clamp(20px, 1.7vw, 26px)',
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.82)',
            fontWeight: 400,
            marginTop: 28,
            maxWidth: 560,
          }}
        >
          {op.outcome}
        </p>

        <div
          className="mt-8 pt-6 grid gap-x-12 gap-y-1"
          style={{
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            maxWidth: 640,
          }}
        >
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2.1]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div>CLASSIFICATION</div>
            <div>STATUS</div>
          </div>
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2.1]" style={{ color: 'rgba(255,255,255,0.92)' }}>
            <div>{op.classification}</div>
            <div>{STATUS_LABEL[op.status]}</div>
          </div>
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2.1]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div>PERIOD</div>
            <div>STACK</div>
          </div>
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase leading-[2.1]" style={{ color: 'rgba(255,255,255,0.92)' }}>
            <div>{op.period}</div>
            <div>{op.stack.join(' · ')}</div>
          </div>
        </div>

        <div className="mt-8">
          <CTA base={base} slug={slug} hovered={hovered} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Oversize — codename as oversize background type (ANTIBODY)
// ─────────────────────────────────────────────────────────────────────────────
function OversizeLayout({ op, slug, base, imgSrc, videoSrc, showVideo, videoRef, onVideoFail, hovered, setHovered }: LayoutProps) {
  return (
    <div
      className="case-card relative w-full max-w-[1280px]"
      style={{
        height: 'min(78vh, 720px)',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* oversize codename, sits behind everything else */}
      <h3
        aria-hidden="true"
        className="ops-oversize-bg font-serif absolute pointer-events-none select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(140px, 22vw, 360px)',
          lineHeight: 0.85,
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'rgba(212,184,106,0.09)',
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
          zIndex: 0,
          willChange: 'transform, opacity',
        }}
      >
        {op.codename}
      </h3>

      {/* hairline frame */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ top: 24, right: 24, bottom: 24, left: 24, border: '1px solid rgba(255,255,255,0.06)', zIndex: 1 }}
      />

      {/* top-left: case number */}
      <div
        className="absolute font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ top: 48, left: 56, color: 'rgba(255,255,255,0.5)', zIndex: 3 }}
      >
        CASE_FILE_{op.caseNumber} // OVERSIZE
      </div>

      {/* top-right: small visual tile */}
      <div
        className="absolute"
        style={{ top: 48, right: 56, width: 220, aspectRatio: '4 / 5', zIndex: 3 }}
      >
        <Visual
          imgSrc={imgSrc}
          videoSrc={videoSrc}
          showVideo={showVideo}
          videoRef={videoRef}
          onVideoFail={onVideoFail}
          hovered={hovered}
          className="relative overflow-hidden w-full h-full"
          style={{
            backgroundColor: '#1A1A22',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* mid-left: operation label, real title */}
      <div className="ops-oversize-info absolute" style={{ top: '38%', left: 56, maxWidth: 540, zIndex: 3, willChange: 'transform, opacity' }}>
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
          OPERATION
        </div>
        <div
          className="font-serif mt-2"
          style={{
            fontSize: 'clamp(36px, 3.6vw, 56px)',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.94)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
          }}
        >
          {op.codename}
        </div>
        <div
          className="font-mono text-[11px] tracking-[0.15em] uppercase mt-3"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {op.realName}
        </div>
      </div>

      {/* bottom-left: outcome */}
      <div className="absolute" style={{ bottom: 48, left: 56, maxWidth: 460, zIndex: 3 }}>
        <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
          {op.outcome}
        </p>
        <div className="mt-5">
          <CTA base={base} slug={slug} hovered={hovered} />
        </div>
      </div>

      {/* bottom-right: metadata column */}
      <div className="absolute" style={{ bottom: 48, right: 56, maxWidth: 320, zIndex: 3 }}>
        <MetaList op={op} align="right" color="rgba(255,255,255,0.65)" />
      </div>
    </div>
  );
}
