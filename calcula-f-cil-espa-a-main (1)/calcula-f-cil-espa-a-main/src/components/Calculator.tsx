import { useMemo, useState } from "react";
import type { CalculatorDef, Values } from "../lib/calculators/types";

export function Calculator<T>({ def }: { def: CalculatorDef<T> }) {
  const initial = useMemo<Values>(() => Object.fromEntries(def.fields.map((f) => [f.id, f.defaultValue])), [def]);
  const [values, setValues] = useState<Values>(initial);

  const results = useMemo(() => {
    try { return def.calculate(values); } catch { return null; }
  }, [values, def]);

  const update = (id: string, v: string | number) => setValues((p) => ({ ...p, [id]: v }));

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">Tus datos</h2>
        {def.fields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <label htmlFor={f.id} className="text-sm font-medium text-foreground flex justify-between">
              <span>{f.label}</span>
              {f.unit && <span className="text-muted-foreground font-normal">{f.unit}</span>}
            </label>
            {f.type === "select" ? (
              <select
                id={f.id}
                value={String(values[f.id])}
                onChange={(e) => update(f.id, e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "radio" ? (
              <div className="grid grid-cols-2 gap-2">
                {f.options?.map((o) => {
                  const active = String(values[f.id]) === o.value;
                  return (
                    <button
                      key={o.value} type="button"
                      onClick={() => update(f.id, o.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-input bg-background text-foreground hover:border-foreground"}`}
                    >{o.label}</button>
                  );
                })}
              </div>
            ) : f.type === "date" ? (
              <input
                id={f.id} type="date"
                value={String(values[f.id])}
                onChange={(e) => update(f.id, e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <input
                id={f.id} type="number" inputMode="decimal"
                min={f.min} max={f.max} step={f.step}
                value={String(values[f.id])}
                onChange={(e) => update(f.id, e.target.value === "" ? 0 : +e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
            {f.tooltip && <p className="text-xs text-muted-foreground">{f.tooltip}</p>}
          </div>
        ))}
      </div>
      <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase mb-4">Resultado</h2>
        {results && <def.ResultsPanel results={results} values={values} />}
      </div>
    </div>
  );
}