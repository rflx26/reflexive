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
      <span>{probability}%</span>
      <div aria-hidden="true">
        <i style={{ width: `${probability}%` }} />
      </div>
    </div>
  );
}

