'use client';
import { useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Reveal from '@/components/animation/Reveal';

export default function ProjectCard({ title, category, color, index, slug }) {
  const [h, setH] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setTilt({ x: y * -2, y: x * 2 });
  }, []);

  const card = (
    <div
      data-hover
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', borderRadius: '1.25rem', overflow: 'hidden', cursor: 'pointer', aspectRatio: index % 3 === 1 ? '3/4' : '4/5', background: 'var(--bg-card)', border: '1px solid var(--border)', transform: h ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none', transition: 'transform 0.4s cubic-bezier(.4,0,.2,1)' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${color}22,${color}08)`, transition: 'opacity 0.6s', opacity: h ? 1 : 0.5 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle,${color}30,transparent)`, transform: h ? 'translate(-50%,-50%) scale(3)' : 'translate(-50%,-50%) scale(1)', transition: 'transform 0.8s cubic-bezier(.16,1,.3,1)', filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(${color}40 1px,transparent 1px),linear-gradient(90deg,${color}40 1px,transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent,rgba(8,9,13,0.8))', textAlign: isRTL ? 'right' : 'left' }}>
        <span style={{ fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-body)', fontSize: '0.65rem', letterSpacing: isRTL ? '0' : '0.15em', textTransform: isRTL ? 'none' : 'uppercase', color, fontWeight: 600, opacity: 0.8 }}>{category}</span>
        <h3 style={{ fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text)', marginTop: '0.3rem', letterSpacing: isRTL ? '0' : '-0.01em' }}>{title}</h3>
      </div>
      <div style={{ position: 'absolute', top: '1.25rem', [isRTL ? 'left' : 'right']: '1.25rem', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontSize: '0.9rem', opacity: h ? 1 : 0, transform: h ? 'translate(0,0)' : `translate(${isRTL ? '-8px' : '8px'},-8px)`, transition: 'all 0.5s cubic-bezier(.16,1,.3,1)' }}>{isRTL ? '↖' : '↗'}</div>
    </div>
  );

  if (slug) {
    return (
      <Reveal delay={index * 0.1}>
        <Link href={`/work/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
          {card}
        </Link>
      </Reveal>
    );
  }

  return <Reveal delay={index * 0.1}>{card}</Reveal>;
}
