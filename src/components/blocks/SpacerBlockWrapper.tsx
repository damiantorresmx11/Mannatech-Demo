const HEIGHTS: Record<string, string> = {
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-32",
}

export function SpacerBlockWrapper({ height = "md" }: { height?: string }) {
  return <div className={HEIGHTS[height] || HEIGHTS.md} />
}
