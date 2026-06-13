export function AdSlot({ width = 300, height = 600, label = "Espacio publicitario" }: { width?: number; height?: number; label?: string }) {
  return (
    <div
      className="border-2 border-dashed border-border rounded-lg bg-muted/40 flex flex-col items-center justify-center text-muted-foreground text-xs gap-1"
      style={{ width: "100%", maxWidth: width, height, minHeight: 100 }}
      aria-label={label}
    >
      <span className="opacity-60">{label}</span>
      <span className="opacity-40">{width}×{height}</span>
    </div>
  );
}