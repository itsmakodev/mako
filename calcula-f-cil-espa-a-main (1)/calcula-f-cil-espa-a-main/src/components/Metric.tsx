export function Metric({ label, value, primary, sub }: { label: string; value: string; primary?: boolean; sub?: string }) {
  return (
    <div className={`rounded-xl p-4 ${primary ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted"}`}>
      <div className={`text-xs font-medium ${primary ? "opacity-80" : "text-muted-foreground"}`}>{label}</div>
      <div className="text-2xl font-bold mt-1 tracking-tight">{value}</div>
      {sub && <div className={`text-xs mt-1 ${primary ? "opacity-75" : "text-muted-foreground"}`}>{sub}</div>}
    </div>
  );
}