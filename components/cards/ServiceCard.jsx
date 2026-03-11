'use client';
import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Reveal from '@/components/animation/Reveal';

export default function ServiceCard({ icon, title, description, learnMore, index }) {
  const [h, setH] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setTilt({ x: y * -3, y: x * 3 });
  }, []);

  return (
    <Reveal delay={index * 0.08} style={{ height: '100%' }}>
      <article
        data-hover
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => { setH(false); setTilt({ x: 0, y: 0 }); }}
        onMouseMove={handleMouseMove}
        style={{ height: '100%', padding: '2.5rem 2rem', borderRadius: '1.25rem', background: h ? 'rgba(var(--accent-rgb),0.03)' : 'var(--bg-card)', border: `1px solid ${h ? 'var(--border-hover)' : 'var(--border)'}`, transition: 'all 0.6s cubic-bezier(.4,0,.2,1)', transform: h ? `translateY(-6px) perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'translateY(0)', position: 'relative', overflow: 'hidden', cursor: 'pointer', textAlign: isRTL ? 'right' : 'left' }}
      >
        <div style={{ position: 'absolute', top: 0, [isRTL ? 'left' : 'right']: 0, width: 120, height: 120, background: `radial-gradient(circle at ${isRTL ? 'top left' : 'top right'},${h ? 'rgba(var(--accent-rgb),0.08)' : 'rgba(var(--accent-rgb),0.02)'},transparent)`, transition: 'background 0.6s' }} />
        <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1.75rem', background: h ? 'linear-gradient(135deg,var(--accent),var(--accent-alt))' : 'rgba(var(--accent-rgb),0.08)', color: h ? 'var(--bg)' : 'var(--accent)', transition: 'all 0.5s cubic-bezier(.4,0,.2,1)', transform: h ? 'scale(1.05)' : 'scale(1)' }}>{icon}</div>
        <h3 style={{ fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: isRTL ? '0' : '-0.01em' }}>{title}</h3>
        <p style={{ fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-body)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>{description}</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-body)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent)', opacity: h ? 1 : 0, transform: h ? 'translateX(0)' : `translateX(${isRTL ? '12px' : '-12px'})`, transition: 'all 0.4s cubic-bezier(.4,0,.2,1) 0.1s' }}>
          {learnMore} <span style={{ fontSize: '1rem' }}>{isRTL ? '←' : '→'}</span>
        </div>
      </article>
    </Reveal>
  );
}
