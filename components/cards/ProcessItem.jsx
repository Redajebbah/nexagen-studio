'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import Reveal from '@/components/animation/Reveal';

export default function ProcessItem({ number, title, desc, index }) {
  const [h, setH] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  return (
    <Reveal delay={index * 0.1}>
      <div data-hover onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', padding: '2rem 0', cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left' }}>
        <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-serif)', fontSize: '1.25rem', fontStyle: 'italic', border: `1px solid ${h ? 'var(--accent)' : 'var(--border)'}`, color: h ? 'var(--accent)' : 'var(--text-muted)', background: h ? 'rgba(var(--accent-rgb),0.06)' : 'transparent', transition: 'all 0.5s cubic-bezier(.4,0,.2,1)', transform: h ? 'scale(1.1)' : 'scale(1)' }}>{number}</div>
        <div>
          <h4 style={{ fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-display)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: isRTL ? '0' : '-0.01em', color: h ? 'var(--accent)' : 'var(--text)', marginBottom: '0.4rem', transition: 'color 0.4s' }}>{title}</h4>
          <p style={{ fontFamily: isRTL ? 'var(--f-ar)' : 'var(--f-body)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: 380 }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}
