import { useState, useEffect, useRef } from 'react';

const routeStages = [
  { id: 0, name: '고레 출항', coords: [14.67, -17.40], date: '1623.04.29',
    event: '11척·1,637명 출항. 아렌드호 누수로 와이트 섬 기항.' },
  { id: 1, name: '시에라리온', coords: [8.48, -13.23], date: '1623.08',
    event: '이질 창궐. 42명 사망.' },
  { id: 2, name: '아노봉', coords: [-1.43, 5.63], date: '1623.10',
    event: '오렌지 20만 개 보급. 베헤르 군의관 참수.' },
  { id: 3, name: '르 메르 해협', coords: [-54.87, -65.22], date: '1624.02',
    event: '야간족 습격 17명 사망. 나사우 만·에르미트 제도 명명.' },
  { id: 4, name: '후안 페르난데스', coords: [-33.63, -78.83], date: '1624.04',
    event: '케이프 혼 통과 후 집결. 탈영병 6명 발생.' },
  { id: 5, name: '카야오', coords: [-12.06, -77.15], date: '1624.05–08',
    event: '98일 봉쇄. 은 선단 5일 차이로 놓침. 르 에르미트 사망.' },
  { id: 6, name: '과야킬', coords: [-2.19, -79.89], date: '1624.06',
    event: '분견대 200명 습격. 시가 방화. 35명 전사.' },
  { id: 7, name: '아카풀코', coords: [16.86, -99.90], date: '1624.10–11',
    event: '마닐라 갈레온 차단 실패.' },
  { id: 8, name: '괌', coords: [13.44, 144.79], date: '1625.01',
    event: '58일 횡단 끝 도착. 생존자 1,260명.' },
  { id: 9, name: '테르나테', coords: [0.78, 127.37], date: '1625.03',
    event: 'VOC 관할 편입. 서세람 토벌전.' },
  { id: 10, name: '바타비아', coords: [-6.21, 106.85], date: '1625.11',
    event: '스하펜함 총사령관 사망.' },
  { id: 11, name: '네덜란드 귀환', coords: [52.37, 4.90], date: '1626.09',
    event: '직접 귀환 4척. 원정 종료.' },
];

// 날짜변경선(±180°)을 서향으로 통과하는 두 지점 사이의 분할 좌표 계산
function antimeridianSplit(a, b) {
  // a에서 b로 서향 이동할 때 -180/+180 교차점 반환
  const lngA = a[1];
  const lngB = b[1] < lngA ? b[1] : b[1] - 360; // 서향 기준 b 경도
  const frac = (-180 - lngA) / (lngB - lngA);
  const lat = a[0] + (b[0] - a[0]) * frac;
  return { west: [lat, -180], east: [lat, 180] };
}

export default function RouteMap() {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const linesRef = useRef([]);

  const [currentStage, setCurrentStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Leaflet 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (leafletRef.current) return;

    const initLeaflet = () => {
      const L = window.L;
      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [10, 20],
        zoom: 2,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletRef.current = map;
      setReady(true);
    };

    if (window.L) {
      initLeaflet();
    } else {
      const check = setInterval(() => {
        if (window.L) { clearInterval(check); initLeaflet(); }
      }, 100);
      return () => clearInterval(check);
    }
  }, []);

  // 단계 변경 시 지도 업데이트
  useEffect(() => {
    if (!ready || !leafletRef.current) return;
    const L = window.L;
    const map = leafletRef.current;

    // 기존 요소 제거
    markersRef.current.forEach(m => m.remove());
    linesRef.current.forEach(l => l.remove());
    markersRef.current = [];
    linesRef.current = [];

    // 방문한 구간 그리기
    const lineStyle = { color: '#f5be52', weight: 2, opacity: 0.9 };
    for (let i = 0; i < currentStage && i < routeStages.length - 1; i++) {
      const a = routeStages[i].coords;
      const b = routeStages[i + 1].coords;

      // 아카풀코(id 7) → 괌(id 8): 날짜변경선 서향 통과 — 분할 처리
      if (i === 7) {
        const { west, east } = antimeridianSplit(a, b);
        linesRef.current.push(L.polyline([a, west], lineStyle).addTo(map));
        linesRef.current.push(L.polyline([east, b], lineStyle).addTo(map));
      } else {
        linesRef.current.push(L.polyline([a, b], lineStyle).addTo(map));
      }
    }

    // 마커 추가 (0 ~ currentStage)
    for (let i = 0; i <= currentStage; i++) {
      const s = routeStages[i];
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:${i === currentStage ? 10 : 7}px;
          height:${i === currentStage ? 10 : 7}px;
          background:${i === currentStage ? '#f5be52' : '#8b949e'};
          border:1px solid #091421;
        "></div>`,
        iconAnchor: [i === currentStage ? 5 : 3, i === currentStage ? 5 : 3],
      });
      const marker = L.marker(s.coords, { icon })
        .addTo(map)
        .bindPopup(`<b style="font-family:serif">${s.name}</b><br/><small>${s.date}</small><br/>${s.event}`);
      markersRef.current.push(marker);

      if (i === currentStage) {
        marker.openPopup();
        map.flyTo(s.coords, Math.max(2, map.getZoom()), { duration: 0.8 });
      }
    }
  }, [currentStage, ready]);

  // 자동 재생
  useEffect(() => {
    if (!playing) return;
    if (currentStage >= routeStages.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [playing, currentStage]);

  const handlePlay = () => {
    if (currentStage >= routeStages.length - 1) setCurrentStage(0);
    setPlaying(p => !p);
  };

  const handlePrev = () => {
    setPlaying(false);
    setCurrentStage(s => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setPlaying(false);
    setCurrentStage(s => Math.min(routeStages.length - 1, s + 1));
  };

  const stage = routeStages[currentStage];

  return (
    <div>
      <style>{`
        .rm-map { height: 450px; background: #0a1628; }
        .rm-map .leaflet-container { background: #0a1628; }
        .rm-btn {
          font-family: var(--font-meta); font-size: 0.78rem; letter-spacing: 0.12em;
          padding: 10px 20px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text);
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
          text-transform: uppercase;
        }
        .rm-btn:hover { border-color: var(--gold); color: var(--gold); }
        .rm-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>

      <div ref={mapRef} className="rm-map" />

      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <button className="rm-btn" onClick={handlePrev} disabled={currentStage === 0}>
          ◀ 이전
        </button>
        <button className="rm-btn" onClick={handlePlay}>
          {playing ? '⏸ 일시정지' : '▶ 재생'}
        </button>
        <button className="rm-btn" onClick={handleNext} disabled={currentStage === routeStages.length - 1}>
          다음 ▶
        </button>
        <span style={{
          fontFamily: 'var(--font-meta)',
          fontSize: '0.72rem',
          letterSpacing: '0.1em',
          color: 'var(--muted)',
        }}>
          {currentStage + 1} / {routeStages.length} · {stage.name}
        </span>
      </div>

      <div style={{
        marginTop: '12px',
        padding: '14px 18px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '16px',
        alignItems: 'start',
      }}>
        <span style={{
          fontFamily: 'var(--font-meta)',
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          color: 'var(--gold)',
          paddingTop: '2px',
        }}>{stage.date}</span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.92rem',
          lineHeight: 1.65,
          color: 'var(--text)',
          opacity: 0.8,
        }}>{stage.event}</span>
      </div>
    </div>
  );
}
