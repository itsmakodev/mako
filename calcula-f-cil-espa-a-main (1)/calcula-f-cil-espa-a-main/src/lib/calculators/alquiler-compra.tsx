import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from "recharts";
import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { breakeven: number | null; chart: { year: number; alquilar: number; comprar: number }[]; verdict: string }

export const alquilerCompra: CalculatorDef<R> = {
  slug: "calculadora-alquiler-vs-compra",
  title: "Calculadora alquiler vs compra",
  shortTitle: "Alquiler vs Compra",
  description: "Descubre en cuántos años compensa comprar frente a alquilar.",
  longDescription: "Compara el coste acumulado de alquilar vs comprar y encuentra el punto de equilibrio.",
  category: "hipoteca",
  icon: "Scale",
  time: "3 min",
  difficulty: "Medio",
  fields: [
    { id: "price", label: "Precio vivienda", type: "number", defaultValue: 250000, min: 10000, max: 5000000, step: 1000, unit: "€" },
    { id: "deposit", label: "Entrada", type: "number", defaultValue: 50000, min: 0, max: 5000000, step: 1000, unit: "€" },
    { id: "rate", label: "Interés hipoteca", type: "number", defaultValue: 3.25, min: 0, max: 15, step: 0.05, unit: "%" },
    { id: "years", label: "Plazo hipoteca", type: "number", defaultValue: 25, min: 1, max: 40, step: 1, unit: "años" },
    { id: "rent", label: "Alquiler mensual", type: "number", defaultValue: 900, min: 0, max: 20000, step: 10, unit: "€" },
    { id: "rentIncrease", label: "Subida anual alquiler", type: "number", defaultValue: 3, min: 0, max: 20, step: 0.1, unit: "%" },
    { id: "horizon", label: "Horizonte de análisis", type: "number", defaultValue: 25, min: 5, max: 40, step: 1, unit: "años" },
  ],
  calculate: (v) => {
    const price = +v.price; const dep = +v.deposit; const r = +v.rate / 100 / 12; const n = +v.years * 12;
    const loan = price - dep;
    const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const horizon = +v.horizon;
    const rent = +v.rent; const inc = +v.rentIncrease / 100;
    let comprar = dep + price * 0.11; // gastos compra
    let alquilar = 0; let rentNow = rent;
    const chart: R["chart"] = []; let breakeven: number | null = null;
    for (let y = 1; y <= horizon; y++) {
      alquilar += rentNow * 12; rentNow *= 1 + inc;
      comprar += monthly * 12 + 800; // gastos vivienda anuales (IBI, comunidad)
      if (breakeven === null && comprar < alquilar) breakeven = y;
      chart.push({ year: y, alquilar, comprar });
    }
    const verdict = breakeven ? `Comprar compensa a partir del año ${breakeven}.` : "En este horizonte, alquilar es más barato.";
    return { breakeven, chart, verdict };
  },
  ResultsPanel: ({ results }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Punto de equilibrio" value={results.breakeven ? `Año ${results.breakeven}` : "—"} primary />
        <Metric label="Veredicto" value={results.verdict} />
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <AreaChart data={results.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => eur(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Legend />
            {results.breakeven && <ReferenceLine x={results.breakeven} stroke="var(--warning)" strokeDasharray="3 3" label="Equilibrio" />}
            <Area type="monotone" dataKey="alquilar" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.15} />
            <Area type="monotone" dataKey="comprar" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  ),
  article: `## Alquilar o comprar: la eterna pregunta\n\nNo hay una respuesta universal. Depende de tu situación financiera, estabilidad laboral, plazo en el que piensas vivir en la zona y de la rentabilidad alternativa de tu dinero.\n\n## La regla del 5%\n\nUna regla rápida del Wall Street Journal: si el alquiler anual es **menor que el 5% del precio de compra**, alquilar suele ganar. Si es mayor, comprar.\n\n## Factores que pesan a favor de comprar\n\nPlazo largo (>10 años), estabilidad geográfica, capacidad de aportar 20% + gastos, y un mercado con precios estables o al alza.\n\n## A favor de alquilar\n\nFlexibilidad, costes iniciales bajos, sin riesgo de depreciación ni derramas, y posibilidad de invertir tu ahorro en otros activos con mejor rentabilidad.`,
  faqs: [
    { question: "¿Qué incluye el 11% de gastos de compra?", answer: "ITP/IVA (6-10%), notaría, registro, gestoría y tasación. Varía según comunidad autónoma." },
    { question: "¿Cuento la revalorización de la vivienda?", answer: "Este modelo no incluye revalorización para ser conservador. Históricamente en España la vivienda revaloriza 2-3% anual a largo plazo." },
    { question: "¿Y si invierto la entrada en bolsa?", answer: "Es el coste de oportunidad. Si esperas 7% anual en S&P 500, el cálculo cambia mucho. Pregúntate qué harías realmente con ese dinero." },
    { question: "¿Es siempre mejor comprar a largo plazo?", answer: "No. En ciudades con precios muy altos respecto al alquiler (Madrid centro, Barcelona), alquilar e invertir puede batir a comprar." },
    { question: "¿Cuánto tarda en compensar comprar de media en España?", answer: "Entre 8 y 15 años, dependiendo de zona, tipo de interés y diferencia precio/alquiler." },
  ],
  related: ["calculadora-hipoteca", "calculadora-euribor"],
};