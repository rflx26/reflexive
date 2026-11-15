/** Brand tokens; mirrors the CSS custom properties in apps/web/app/styles.css. */
export const tokens = {
  color: {
    background: "#04050a",
    text: "#eef0f7",
    muted: "#858aa0",
    faint: "#4d5166",
    line: "rgba(255, 255, 255, 0.08)",
    /** Lit intersection of the mark: probability and YES. */
    lens: "#5fd8ff",
    /** Violet edge light of the mark: NO and structural highlights. */
    rim: "#8d6dff"
  },
  radius: {
    sm: "14px",
    md: "22px"
  }
} as const;
