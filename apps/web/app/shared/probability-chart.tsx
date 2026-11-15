import type { ProbabilityPoint } from "@reflexive/types";

const WIDTH = 600;
const HEIGHT = 220;

/** Probability over the life of the market. Y axis is fixed 0–100% so charts compare across markets. */
export function ProbabilityChart({ points, ended = false }: { points: ProbabilityPoint[]; ended?: boolean }) {
  if (points.length < 2) {
    return <div className="chart chart-empty muted">No trades yet</div>;
  }

  const x = (i: number) => (i / (points.length - 1)) * WIDTH;
  const y = (bps: number) => HEIGHT - (bps / 10_000) * HEIGHT;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.probabilityBps).toFixed(1)}`).join(" ");
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
  const last = points[points.length - 1] as ProbabilityPoint;

  return (
    <div className="chart">
      <div className="chart-plot">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="img" aria-label="Graduation probability over time">
          <defs>
            <linearGradient id="chart-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--lens)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--lens)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chart-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--rim)" />
              <stop offset="100%" stopColor="var(--lens)" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((pct) => (
            <line
              key={pct}
              className={pct === 50 ? "grid grid-mid" : "grid"}
              x1="0"
              x2={WIDTH}
              y1={y(pct * 100)}
              y2={y(pct * 100)}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={area} fill="url(#chart-area)" />
          <path d={line} className="chart-line" stroke="url(#chart-line)" vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          className="chart-dot"
          style={{ left: "100%", top: `${(1 - last.probabilityBps / 10_000) * 100}%` }}
        />
        <span className="chart-axis" style={{ top: "0%" }}>100%</span>
        <span className="chart-axis" style={{ top: "50%" }}>50%</span>
        <span className="chart-axis" style={{ top: "100%" }}>0%</span>
      </div>
      <div className="chart-x muted">
        <span>Launch</span>
        <span>{ended ? "Settled" : "Now"}</span>
      </div>
    </div>
  );
}
