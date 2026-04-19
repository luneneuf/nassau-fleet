import { useState } from 'react';

const ships = [
  { id: 'amsterdam', name: 'Amsterdam', role: '기함', cannons: 42, commander: '자크 르 에르미트',
    events: [
      { date: '1623.04', desc: '고레 항 출항. 르 에르미트 제독 승함.' },
      { date: '1623.07', desc: '카보베르데 기항 후 이질 창궐 시작.' },
      { date: '1624.06', desc: '르 에르미트 제독 카야오 앞바다에서 사망. 산 로렌소 섬 매장.' },
      { date: '1626.09', desc: '제일란트 귀환. 직접 귀환한 4척 중 하나.' },
    ], fate: '귀환', fateColor: '#3fb950' },
  { id: 'hollandia', name: 'Hollandia', role: '부제독함', cannons: 42, commander: '헨 스하펜함',
    events: [
      { date: '1624.06', desc: '스하펜함, 르 에르미트 사망 후 총사령관 계승.' },
      { date: '1625', desc: '스하펜함, 바타비아 근해에서 사망.' },
      { date: '1627.11', desc: 'VOC 잔류 후 바타비아 출발.' },
      { date: '1628.06', desc: '텍셀 귀환.' },
    ], fate: 'VOC 잔류 후 귀환', fateColor: '#c9a227' },
  { id: 'oranje', name: 'Oranje', role: '후방제독함', cannons: 40, commander: '율리우스 페르스호르',
    events: [
      { date: '1624.02', desc: '나사우 만 탐사 및 명명. 르 메르 해협 정밀 측량 지휘.' },
      { date: '1626.12', desc: 'VOC 잔류, 수라트 출발.' },
      { date: '1628.09', desc: '텍셀 귀환.' },
    ], fate: 'VOC 잔류 후 귀환', fateColor: '#c9a227' },
  { id: 'delft', name: 'Delft', role: '전열함', cannons: 30, commander: '비터 더 윗',
    events: [
      { date: '1624.04', desc: '수병 6명 후안 페르난데스 섬으로 탈영.' },
      { date: '1625', desc: '서세람 토벌전. 정향나무 9만 그루 파괴.' },
      { date: '1626.09', desc: '향료 함대 부제독으로 귀환.' },
    ], fate: '귀환', fateColor: '#3fb950' },
  { id: 'mauritius', name: 'Mauritius', role: '전열함', cannons: 36, commander: '아돌프 데커',
    events: [
      { date: '1623.10', desc: '군의관 야코프 베헤르, 환자 7명 독살 자백. 선상 참수형.' },
    ], fate: '처분 불명', fateColor: '#8b949e' },
  { id: 'eendracht', name: 'Eendracht', role: '전열함', cannons: 28, commander: '미상',
    events: [], fate: '처분 불명', fateColor: '#8b949e' },
  { id: 'arend', name: 'Arend', role: '전열함', cannons: 26, commander: '미상',
    events: [
      { date: '1623.05', desc: '출항 직후 누수. 영국 와이트 섬 기항 수리.' },
      { date: '1624.02', desc: '야간족 습격. 수병 다수 사망.' },
    ], fate: '처분 불명', fateColor: '#8b949e' },
  { id: 'griffioen', name: 'Griffioen', role: '전열함', cannons: 28, commander: '미상',
    events: [
      { date: '1626.04', desc: '말라카 항해 후 바타비아 귀환.' },
    ], fate: '바타비아 귀환', fateColor: '#c9a227' },
  { id: 'david', name: 'Koning David', role: '전열함', cannons: 24, commander: '미상',
    events: [], fate: '처분 불명', fateColor: '#8b949e' },
  { id: 'hazewind', name: 'Hazewind', role: '쾌속 야흐트', cannons: 14, commander: '미상',
    events: [], fate: '처분 불명', fateColor: '#8b949e' },
  { id: 'hoop', name: 'Hoop', role: '수송 요트', cannons: 0, commander: '피터 슬로버',
    events: [
      { date: '1625–1627', desc: '말라카·반탐·잠비 항해.' },
      { date: '1627–28', desc: '바타비아에서 현지 해체.' },
    ], fate: '현지 해체', fateColor: '#f85149' },
];

const styles = {
  wrapper: {
    marginTop: '64px',
    paddingTop: '48px',
    borderTop: '1px solid var(--border)',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    letterSpacing: '0.1em',
    color: 'var(--text)',
    marginBottom: '28px',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '0',
  },
  card: (selected, fateColor) => ({
    background: 'var(--surface)',
    border: `1px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
    borderLeft: `3px solid ${fateColor}`,
    padding: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    position: 'relative',
  }),
  cardName: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    color: 'var(--gold)',
    marginBottom: '4px',
  },
  cardRole: {
    fontFamily: 'var(--font-meta)',
    fontSize: '0.68rem',
    letterSpacing: '0.1em',
    color: 'var(--muted)',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  cardCannons: {
    fontFamily: 'var(--font-meta)',
    fontSize: '0.72rem',
    color: 'var(--muted)',
  },
  panel: {
    marginTop: '24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    padding: '28px 32px',
    animation: 'slideIn 0.25s ease',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  panelTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.3rem',
    color: 'var(--text)',
  },
  fateBadge: (color) => ({
    fontFamily: 'var(--font-meta)',
    fontSize: '0.68rem',
    letterSpacing: '0.12em',
    padding: '3px 10px',
    border: `1px solid ${color}`,
    color: color,
    textTransform: 'uppercase',
  }),
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  },
  timelineDate: {
    fontFamily: 'var(--font-meta)',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    color: 'var(--gold)',
    whiteSpace: 'nowrap',
    paddingTop: '2px',
    minWidth: '72px',
  },
  timelineDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    lineHeight: '1.65',
    color: 'var(--text)',
    opacity: 0.8,
  },
  emptyNote: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--muted)',
    fontStyle: 'italic',
  },
  panelMeta: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)',
    fontFamily: 'var(--font-meta)',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
  },
};

export default function ShipTracker() {
  const [selected, setSelected] = useState(null);

  const ship = ships.find(s => s.id === selected);

  return (
    <div style={styles.wrapper}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ship-card:hover { border-color: var(--gold) !important; }
      `}</style>
      <p style={styles.heading}>11척 함선 — 카드를 클릭해 타임라인 확인</p>
      <div style={styles.grid}>
        {ships.map(s => (
          <div
            key={s.id}
            className="ship-card"
            style={styles.card(selected === s.id, s.fateColor)}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
          >
            <p style={styles.cardName}>{s.name}</p>
            <p style={styles.cardRole}>{s.role}</p>
            <p style={styles.cardCannons}>{s.cannons > 0 ? `${s.cannons}문 포` : '무장 없음'}</p>
          </div>
        ))}
      </div>

      {ship && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>{ship.name}</span>
            <span style={styles.fateBadge(ship.fateColor)}>{ship.fate}</span>
          </div>
          {ship.events.length > 0 ? (
            <div style={styles.timeline}>
              {ship.events.map((ev, i) => (
                <div key={i} style={styles.timelineItem}>
                  <span style={styles.timelineDate}>{ev.date}</span>
                  <span style={styles.timelineDesc}>{ev.desc}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyNote}>기록된 사건 없음 — 항해 일지 누락</p>
          )}
          <p style={styles.panelMeta}>지휘관: {ship.commander} · 포문: {ship.cannons > 0 ? `${ship.cannons}문` : '없음'}</p>
        </div>
      )}
    </div>
  );
}
