import { useState } from 'react';

const delays = [
  { event: '아렌드호 누수 수리', date: '1623.05', location: '영국 와이트 섬', daysLost: 9,
    desc: '출항 직후 누수 발견. 와이트 섬 기항으로 9일 지연.' },
  { event: '이질 창궐', date: '1623.07–08', location: '아프리카 서안', daysLost: 21,
    desc: '카보베르데에서 이질 창궐. 병자 간호와 매장으로 항해 속도 저하.' },
  { event: '베헤르 참수 재판', date: '1623.10', location: '아노봉 인근 해상', daysLost: 6,
    desc: '군의관 재판·처형으로 항해 중단.' },
  { event: '티에라델푸에고 폭풍', date: '1624.02', location: '르 메르 해협', daysLost: 28,
    desc: '케이프 혼 통과 후 폭풍으로 함대 분산. 재집결에 28일 소요.' },
];

const total = delays.reduce((s, d) => s + d.daysLost, 0);

export default function CallaoCountdown() {
  const [expanded, setExpanded] = useState(null);

  let cumulative = 0;

  return (
    <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
      <style>{`
        .cc-card { transition: border-color 0.2s; }
        .cc-card:hover { border-color: var(--gold) !important; cursor: pointer; }
      `}</style>

      <div style={{
        marginBottom: '36px',
        padding: '24px 28px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--gold)',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
          color: 'var(--gold)',
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}>
          은 선단은 카야오를 5일 전에 떠났다
        </p>
        <p style={{
          marginTop: '8px',
          fontFamily: 'var(--font-meta)',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
        }}>
          누적 지연이 만든 5일의 차이
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {delays.map((d, i) => {
          cumulative += d.daysLost;
          const isOpen = expanded === i;
          return (
            <div
              key={i}
              className="cc-card"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '20px 24px',
                position: 'relative',
              }}
              onClick={() => setExpanded(isOpen ? null : i)}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{
                      fontFamily: 'var(--font-meta)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.15em',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                    }}>{d.date}</span>
                    <span style={{
                      fontFamily: 'var(--font-meta)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.12em',
                      color: 'var(--muted)',
                    }}>{d.location}</span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    color: 'var(--text)',
                    marginBottom: isOpen ? '12px' : '0',
                  }}>{d.event}</p>
                  {isOpen && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      lineHeight: 1.7,
                      color: 'var(--text)',
                      opacity: 0.75,
                    }}>{d.desc}</p>
                  )}
                </div>
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                  }}>+{d.daysLost}일</div>
                  <div style={{
                    fontFamily: 'var(--font-meta)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.1em',
                    color: 'var(--muted)',
                    marginTop: '4px',
                  }}>누적 {cumulative}일</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span style={{
          fontFamily: 'var(--font-meta)',
          fontSize: '0.78rem',
          letterSpacing: '0.1em',
          color: 'var(--muted)',
        }}>
          총 지연 {total}일 → 은 선단과의 차이 단 5일
        </span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          color: 'var(--gold)',
        }}>64일 / 5일</span>
      </div>
    </div>
  );
}
