export function ProbabilityMeter({
  probabilityBps,
  size = "default"
}: {
  probabilityBps: number;
  size?: "default" | "large";
}) {
  const probability = Math.round(probabilityBps / 100);

  return (
    <div className={`probability ${size}`}>
      <span>{probability}%</span>
      <div aria-hidden="true">
        <i style={{ width: `${probability}%` }} />
      </div>
    </div>
  );
}

