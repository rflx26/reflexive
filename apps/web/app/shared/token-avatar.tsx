/** Generated mark until launches carry uploaded images: a lit glass disc tinted per ticker. */
export function TokenAvatar({ ticker, size = 44 }: { ticker: string; size?: number }) {
  let hash = 0;
  for (const char of ticker) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  // Keep hues inside the brand arc: cyan (190) through violet (265).
  const hue = 190 + (hash % 76);

  return (
    <span
      className="token-avatar"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        ["--hue" as string]: hue
      }}
    >
      {ticker.slice(0, 2)}
    </span>
  );
}
