import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CalculatorDef } from "./types";
import { eur, pct } from "../format";
import { Metric } from "../../components/Metric";
import { COMUNIDADES, SS_EMPLOYEE_RATE, totalIrpf, marginalRate, MINIMO_PERSONAL, MINIMO_HIJO, MINIMO_DISCAPACIDAD } from "../tax-spain";

interface Scenario { ordinaryNet: number; extraNet: number; ordinaryMonths: number; extras: number; annualNet: number }
interface R {
  gross: number; ss: number; irpf: number; net: number; netMonthly: number;
  marginal: number; effective: number;
  pagas: number;
  scenario: Scenario;
  compare: Record<12 | 14 | 16, Scenario>;
  pie: { name: string; value: number; color: string }[];
}

function computeNet(gross: number, hijos: number, discapacidad: string) {
  const ss = gross * SS_EMPLOYEE_RATE;
  let minimo = MINIMO_PERSONAL;
  for (let i = 0; i < hijos; i++) minimo += MINIMO_HIJO[Math.min(i, 3)];
  if (discapacidad === "33") minimo += MINIMO_DISCAPACIDAD;
  if (discapacidad === "65") minimo += MINIMO_DISCAPACIDAD * 3;
  // Reducción rendimientos del trabajo (Art. 20 LIRPF 2026)
  const nwi = gross - ss;
  let reduccion = 2000;
  if (nwi <= 14047.5) reduccion = 6498;
  else if (nwi <= 19747.5) reduccion = 6498 - 1.14 * (nwi - 14047.5);
  const base = Math.max(0, gross - ss - reduccion);
  const irpf = Math.max(0, totalIrpf(base) - totalIrpf(minimo));
  const net = gross - ss - irpf;
  return { ss, irpf, net, base };
}

function scenarioFor(net: number, pagas: number): Scenario {
  const perPaga = net / pagas;
  const extras = pagas - 12;
  return { ordinaryNet: perPaga, extraNet: extras > 0 ? perPaga : 0, ordinaryMonths: 12, extras, annualNet: net };
}

export const irpf2025: CalculatorDef<R> = {
  slug: "calculadora-irpf-2025",
  title: "Calculadora IRPF 2026: del bruto al neto",
  shortTitle: "IRPF 2026",
  description: "Calcula tu salario neto a partir del bruto según tramos IRPF 2026 y tu comunidad autónoma.",
  longDescription: "Salario neto, retención IRPF y desglose de cotizaciones a la Seguridad Social en España 2026.",
  category: "irpf",
  icon: "Receipt",
  time: "2 min",
  difficulty: "Fácil",
  fields: [
    { id: "gross", label: "Salario bruto anual", type: "number", defaultValue: 30000, min: 0, max: 1000000, step: 100, unit: "€" },
    { id: "pagas", label: "Número de pagas", type: "radio", defaultValue: "14", options: [
      { value: "12", label: "12 pagas" },
      { value: "14", label: "14 pagas" },
      { value: "16", label: "16 pagas" },
      { value: "custom", label: "Personalizado" },
    ] },
    { id: "customPagas", label: "Pagas personalizadas (12-16)", type: "number", defaultValue: 15, min: 12, max: 16, step: 1 },
    { id: "comunidad", label: "Comunidad autónoma", type: "select", defaultValue: "Madrid", options: COMUNIDADES.map((c) => ({ value: c, label: c })) },
    { id: "civil", label: "Estado civil", type: "select", defaultValue: "soltero", options: [{ value: "soltero", label: "Soltero/a o no aplica" }, { value: "casado_conjunta", label: "Casado/a, tributación conjunta" }] },
    { id: "hijos", label: "Número de hijos", type: "number", defaultValue: 0, min: 0, max: 10, step: 1 },
    { id: "discapacidad", label: "Grado de discapacidad", type: "select", defaultValue: "0", options: [{ value: "0", label: "Sin discapacidad" }, { value: "33", label: "33-65%" }, { value: "65", label: ">65% o con ayuda" }] },
  ],
  calculate: (v) => {
    const gross = +v.gross;
    const hijos = +v.hijos;
    const { ss, irpf, net, base } = computeNet(gross, hijos, String(v.discapacidad));
    const pagas = v.pagas === "custom" ? Math.min(16, Math.max(12, +v.customPagas)) : +v.pagas;
    const scenario = scenarioFor(net, pagas);
    const compare = { 12: scenarioFor(net, 12), 14: scenarioFor(net, 14), 16: scenarioFor(net, 16) } as Record<12 | 14 | 16, Scenario>;
    return {
      gross, ss, irpf, net, netMonthly: net / 12,
      marginal: marginalRate(base), effective: gross > 0 ? irpf / gross : 0,
      pagas, scenario, compare,
      pie: [
        { name: "Neto", value: net, color: "var(--primary)" },
        { name: "IRPF", value: irpf, color: "var(--destructive)" },
        { name: "Seg. Social", value: ss, color: "var(--warning)" },
      ],
    };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Neto mensual ordinario" value={eur(r.scenario.ordinaryNet, 0)} primary sub={`${r.pagas} pagas`} />
        <Metric label="Neto paga extra" value={r.scenario.extras > 0 ? eur(r.scenario.extraNet, 0) : "—"} sub={r.scenario.extras > 0 ? `${r.scenario.extras} extras/año` : "Prorrateado"} />
        <Metric label="Retención IRPF" value={pct(r.effective)} sub={`${eur(r.irpf)}/año`} />
        <Metric label="Seguridad Social" value={eur(r.ss)} sub={pct(SS_EMPLOYEE_RATE)} />
      </div>

      <details className="rounded-xl border border-border bg-muted/30 p-4">
        <summary className="cursor-pointer text-sm font-semibold">Desglose completo</summary>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Bruto anual</div><div className="text-right tabular-nums">{eur(r.gross)}</div>
          <div className="text-muted-foreground">Bruto por paga</div><div className="text-right tabular-nums">{eur(r.gross / r.pagas)}</div>
          <div className="text-muted-foreground">SS trabajador</div><div className="text-right tabular-nums">{eur(r.ss)}</div>
          <div className="text-muted-foreground">IRPF anual</div><div className="text-right tabular-nums">{eur(r.irpf)}</div>
          <div className="text-muted-foreground">Neto anual</div><div className="text-right tabular-nums font-semibold">{eur(r.net)}</div>
          <div className="text-muted-foreground">Meses ordinarios</div><div className="text-right tabular-nums">{r.scenario.ordinaryMonths}</div>
          <div className="text-muted-foreground">Pagas extra</div><div className="text-right tabular-nums">{r.scenario.extras}</div>
        </div>
      </details>

      <div>
        <h3 className="font-semibold mb-2 text-sm">Desglose de tu salario bruto</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={r.pie} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {r.pie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => eur(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-sm">Comparativa: 12 vs 14 vs 16 pagas (mismo bruto)</h3>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Concepto</th>
                {[12, 14, 16].map((p) => (
                  <th key={p} className={`p-2 text-right ${r.pagas === p ? "border-l-2 border-primary text-primary" : ""}`}>{p} pagas</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-2">Neto mensual ordinario</td>
                {[12, 14, 16].map((p) => <td key={p} className={`p-2 text-right tabular-nums ${r.pagas === p ? "bg-primary/10 font-semibold" : ""}`}>{eur(r.compare[p as 12].ordinaryNet, 0)}</td>)}
              </tr>
              <tr className="border-t border-border">
                <td className="p-2">Neto paga extra</td>
                {[12, 14, 16].map((p) => <td key={p} className={`p-2 text-right tabular-nums ${r.pagas === p ? "bg-primary/10 font-semibold" : ""}`}>{r.compare[p as 12].extras > 0 ? eur(r.compare[p as 12].extraNet, 0) : "—"}</td>)}
              </tr>
              <tr className="border-t border-border">
                <td className="p-2">Total neto anual</td>
                {[12, 14, 16].map((p) => <td key={p} className={`p-2 text-right tabular-nums ${r.pagas === p ? "bg-primary/10 font-semibold" : ""}`}>{eur(r.compare[p as 12].annualNet)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">El bruto e impuestos son idénticos; lo único que cambia es cómo se reparte el neto a lo largo del año.</p>
      </div>

      <p className="text-xs text-muted-foreground">Tipo marginal aplicado al último euro: <strong>{pct(r.marginal)}</strong>. Estimación con escala estatal + Madrid. Otras comunidades varían ligeramente.</p>
    </div>
  ),
  article: `## Cómo se calcula el IRPF en España\n\nEl IRPF es un impuesto **progresivo** dividido en dos escalas: la **estatal** (igual en toda España) y la **autonómica** (cada comunidad fija su tarifa). Se aplican a la **base liquidable general** (salario bruto menos cotizaciones y mínimos personales).\n\n## Escala estatal IRPF 2026\n\n- Hasta 12.450 €: 9,5%\n- 12.450 – 20.200 €: 12%\n- 20.200 – 35.200 €: 15%\n- 35.200 – 60.000 €: 18,5%\n- 60.000 – 300.000 €: 22,5%\n- Más de 300.000 €: 24,5%\n\n## Mínimos personales y familiares\n\nReducen la cuota: 5.550 € por contribuyente, +2.400 € por primer hijo, +2.700 € por segundo, +4.000 € por tercero, +4.500 € por cuarto y siguientes. Discapacidad: 3.000 € (33-65%) o 9.000 € (>65%).\n\n## Tipo marginal vs tipo efectivo\n\nEl **marginal** es el % que pagas por tu último euro ganado. El **efectivo** es el % total que acabas pagando sobre todo tu salario. Por eso una subida de sueldo nunca te hace perder dinero, aunque cambies de tramo.`,
  faqs: [
    { question: "¿Por qué el bruto y el neto difieren tanto?", answer: "Entre Seg. Social (6,35%) e IRPF (que puede ser del 9% al 47%), un sueldo de 30.000 € se queda en unos 1.900 €/mes netos en 12 pagas." },
    { question: "¿Qué comunidad autónoma paga menos IRPF?", answer: "Madrid suele tener la escala autonómica más baja. Cataluña y Valencia, las más altas. País Vasco y Navarra tienen régimen foral propio." },
    { question: "¿Conviene tributación conjunta?", answer: "Solo si uno de los cónyuges ingresa muy poco o nada. La reducción es de 3.400 € en la base." },
    { question: "¿Cómo afecta tener hijos?", answer: "Aumentan tu mínimo personal y familiar, reduciendo la cuota. Además existen deducciones por maternidad y familia numerosa." },
    { question: "¿Las pagas extra cuentan?", answer: "Sí. El cálculo del IRPF es sobre el total anual, sean 12 o 14 pagas. La retención mensual se ajusta para que al final del año coincida." },
  ],
  related: ["calculadora-retencion-irpf", "calculadora-declaracion-renta"],
};