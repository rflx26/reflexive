export function ProbabilityMeter({
  probabilityBps,
  size = "default"
}: {
  probabilityBps: number;
  size?: "default" | "large";
}) {
  const probability = Number.isFinite(probabilityBps)
    ? Math.min(100, Math.max(0, Math.round(probabilityBps / 100)))
    : 0;

  return (
    <div className={`probability ${size}`}>
      <div className="value">
        <strong className="num">{probability}%</strong>
        <span>to graduate</span>
      </div>
      <div className="track" aria-hidden="true">
        <i className="fill" style={{ width: `${probability}%` }} />
      </div>
    </div>
  );
}
