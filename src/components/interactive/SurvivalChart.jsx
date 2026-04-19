import { useState, useEffect, useRef } from 'react';

const stages = [
  { label: '출항', date: '1623.04', survivors: 1637, event: null },
  { label: '시에라리온', date: '1623.08', survivors: 1595, event: '이질 42명 사망' },
  { label: '아노봉 섬', date: '1623.10', survivors: 1580, event: '베헤르 군의관 참수' },
  { label: '르 메르 해협', date: '1624.02', survivors: 1563, event: '야간족 습격 17명 사망' },
  { label: '카야오 봉쇄', date: '1624.05–08', survivors: 1490, event: '70명+ 사망. 르 에르미트 제독 사망' },
  { label: '과야킬·앙콘', date: '1624.08', survivors: 1440, event: '전투 손실 약 50명' },
  { label: '괌 도착', date: '1625.01', survivors: 1260, event: '괴혈병. 공식 집계 1,260명' },
];

const MAX = 1637;

export default function SurvivalChart() {
  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: '48px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
      <style>{`
        .sc-bar-wrap { position: relative; }
        .sc-bar { height: 28px; transition: width 0.6s ease; background: var(--gold); opacity: 0.85; }
        .sc-marker {
          position: absolute; right: 0; top: 50%; transform: translateY(-50%);
          width: 8px; height: 8px; background: var(--gold); border-radius: 0;
          cursor: pointer;
        }
        .sc-tooltip {
          position: absolute; right: 0; top: -36px; z-index: 10;
          background: var(--border); border: 1px solid var(--gold);
          padding: 4px 10px;
          font-family: var(--font-meta); font-size: 0.68rem; letter-spacing: 0.08em;
          color: var(--text); white-space: nowrap; pointer-events: none;
        }
      `}</style>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        letterSpacing: '0.1em',
        color: 'var(--text)',
        marginBottom: '28px',
        textTransform: 'uppercase',
      }}>
        항해 단계별 생존자 감소
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {stages.map((s, i) => {
          const pct = (s.survivors / MAX) * 100;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 64px', gap: '12px', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-meta)', fontSize: '0.62rem', letterSpacing: '0.12em', color: 'var(--gold)', marginBottom: '2px' }}>
                  {s.date}
                </div>
                <div style={{ fontFamily: 'var(--font-meta)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                  {s.label}
                </div>
              </div>
              <div className="sc-bar-wrap">
                <div
                  className="sc-bar"
                  style={{ width: animated ? `${pct}%` : '0%' }}
                />
                {s.event && (
                  <div
                    className="sc-marker"
                    onMouseEnter={() => setTooltip(i)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ right: `calc(${100 - pct}% - 4px)` }}
                  >
                    {tooltip === i && (
                      <div className="sc-tooltip">{s.event}</div>
                    )}
                  </div>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-meta)',
                fontSize: '0.78rem',
                color: 'var(--text)',
                textAlign: 'right',
              }}>
                {s.survivors.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{
        marginTop: '24px',
        fontFamily: 'var(--font-meta)',
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        color: 'var(--muted)',
        borderTop: '1px solid var(--border)',
        paddingTop: '16px',
      }}>
        출항 1,637명 → 괌 도착 1,260명 · 21개월간 377명(23%) 사망
      </p>
    </div>
  );
}
