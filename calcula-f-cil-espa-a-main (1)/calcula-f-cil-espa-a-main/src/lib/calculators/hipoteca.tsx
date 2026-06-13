import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { CalculatorDef } from "./types";
import { eur, pct } from "../format";

interface AmortRow { month: number; payment: number; principal: number; interest: number; balance: number }
interface Results {
  monthly: number;
  totalInterest: number;
  totalPaid: number;
  loan: number;
  chart: { year: number; saldo: number; intereses: number }[];
  table: AmortRow[];
  comparisonChart: { year: number; fijo: number; variable: number }[];
}

function frenchAmort(loan: number, annualRate: number, years: number): AmortRow[] {
  const r = annualRate / 12;
  const n = years * 12;
  const m = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  const rows: AmortRow[] = [];
  let bal = loan;
  for (let i = 1; i <= n; i++) {
    const interest = bal * r;
    const principal = m - interest;
    bal -= principal;
    rows.push({ month: i, payment: m, principal, interest, balance: Math.max(0, bal) });
  }
  return rows;
}

export const hipoteca: CalculatorDef<Results> = {
  slug: "calculadora-hipoteca",
  title: "Calculadora de hipoteca",
  shortTitle: "Hipoteca",
  description: "Calcula la cuota mensual, intereses totales y tabla de amortización completa.",
  longDescription: "Simula tu hipoteca con cuota mensual, intereses totales y comparativa fija vs variable.",
  category: "hipoteca",
  icon: "Home",
  time: "2 min",
  difficulty: "Fácil",
  fields: [
    { id: "price", label: "Precio de la vivienda", type: "number", min: 10000, max: 5000000, step: 1000, defaultValue: 250000, unit: "€" },
    { id: "deposit", label: "Aportación inicial", type: "number", min: 0, max: 100, step: 1, defaultValue: 20, unit: "%" },
    { id: "years", label: "Plazo", type: "number", min: 1, max: 40, step: 1, defaultValue: 25, unit: "años" },
    { id: "rate", label: "Tipo de interés", type: "number", min: 0, max: 15, step: 0.05, defaultValue: 3.25, unit: "%" },
    { id: "type", label: "Tipo de hipoteca", type: "select", defaultValue: "fija", options: [
      { value: "fija", label: "Fija" }, { value: "variable", label: "Variable (Euríbor + diferencial)" }, { value: "mixta", label: "Mixta" },
    ] },
  ],
  calculate: (v) => {
    const price = +v.price; const dep = +v.deposit; const years = +v.years; const rate = +v.rate / 100;
    const loan = price * (1 - dep / 100);
    const table = frenchAmort(loan, rate, years);
    const monthly = table[0]?.payment ?? 0;
    const totalPaid = monthly * years * 12;
    const totalInterest = totalPaid - loan;
    const chart = Array.from({ length: years }, (_, i) => {
      const rows = table.slice(0, (i + 1) * 12);
      return {
        year: i + 1,
        saldo: table[(i + 1) * 12 - 1]?.balance ?? 0,
        intereses: rows.reduce((a, r) => a + r.interest, 0),
      };
    });
    const varTable = frenchAmort(loan, rate + 0.005, years);
    const comparisonChart = Array.from({ length: years }, (_, i) => ({
      year: i + 1,
      fijo: table[(i + 1) * 12 - 1]?.balance ?? 0,
      variable: varTable[(i + 1) * 12 - 1]?.balance ?? 0,
    }));
    return { monthly, totalInterest, totalPaid, loan, chart, table, comparisonChart };
  },
  ResultsPanel: ({ results }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Cuota mensual" value={eur(results.monthly, 2)} primary />
        <Metric label="Capital prestado" value={eur(results.loan)} />
        <Metric label="Intereses totales" value={eur(results.totalInterest)} />
        <Metric label="Coste total" value={eur(results.totalPaid)} />
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-sm">Evolución del saldo pendiente</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={results.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => eur(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="saldo" stroke="var(--primary)" strokeWidth={2} dot={false} name="Saldo" />
              <Line type="monotone" dataKey="intereses" stroke="var(--warning)" strokeWidth={2} dot={false} name="Intereses acumulados" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-sm">Fija vs variable (saldo pendiente)</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={results.comparisonChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => eur(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="fijo" stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="variable" stroke="var(--destructive)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <details className="border border-border rounded-lg">
        <summary className="cursor-pointer p-3 font-medium text-sm">Ver tabla de amortización completa ({results.table.length} cuotas)</summary>
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted sticky top-0">
              <tr><th className="p-2 text-left">Mes</th><th className="p-2 text-right">Cuota</th><th className="p-2 text-right">Capital</th><th className="p-2 text-right">Interés</th><th className="p-2 text-right">Pendiente</th></tr>
            </thead>
            <tbody>{results.table.map((r) => (
              <tr key={r.month} className="border-t border-border"><td className="p-2">{r.month}</td><td className="p-2 text-right">{eur(r.payment, 2)}</td><td className="p-2 text-right">{eur(r.principal, 2)}</td><td className="p-2 text-right">{eur(r.interest, 2)}</td><td className="p-2 text-right">{eur(r.balance, 2)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </details>
      <p className="text-xs text-muted-foreground">Tipo efectivo aplicado: {pct(+0)} de gastos asociados no incluidos. Cálculo según sistema francés.</p>
    </div>
  ),
  article: `## ¿Cómo se calcula la cuota de una hipoteca?\n\nEn España, prácticamente todas las hipotecas utilizan el **sistema francés de amortización**: una cuota mensual constante en la que, al principio, pagas mayoritariamente intereses y, al final, mayoritariamente capital. La fórmula matemática es:\n\n\`Cuota = Capital · i / (1 - (1+i)^-n)\`\n\ndonde **i** es el tipo de interés mensual (anual ÷ 12) y **n** el número total de cuotas.\n\n## Hipoteca fija vs variable en 2026\n\nUna **hipoteca fija** mantiene el mismo tipo durante toda la vida del préstamo. Te da tranquilidad pero suele tener un tipo inicial algo más alto. Una **hipoteca variable** se referencia al Euríbor más un diferencial (típicamente Euríbor + 0,5%–1%). Si el Euríbor sube, tu cuota sube en las revisiones (semestrales o anuales).\n\nCon el Euríbor estabilizándose en torno al 2,5–3% en 2026, las hipotecas fijas ofrecen tipos competitivos entre el 2,8% y el 3,5% TIN. Las variables parten alrededor del 2,2% pero conllevan riesgo al alza.\n\n## ¿Qué gastos adicionales hay?\n\nAdemás de la cuota, tendrás que pagar el ITP (Impuesto sobre Transmisiones Patrimoniales) si es vivienda de segunda mano (entre 6% y 10% según comunidad), o el IVA del 10% si es nueva. Suma también notaría, registro, gestoría y la tasación. Aproximadamente, un 10-12% extra sobre el precio.\n\n## Cuánto te pueden prestar\n\nLa norma general: la cuota mensual no debe superar el 30-35% de tus ingresos netos, y el banco rara vez financia más del 80% del valor de tasación (90% si eres joven o vivienda protegida).`,
  faqs: [
    { question: "¿Es mejor hipoteca fija o variable en 2026?", answer: "Depende de tu perfil. Si valoras estabilidad y plazo largo (>15 años), la fija a 2,8-3,5% es excelente. Si tienes capacidad de amortizar anticipadamente, la variable puede salir más barata a corto plazo." },
    { question: "¿Cuánto necesito ahorrar para comprar piso?", answer: "Mínimo el 20% del precio (entrada) + 10-12% de gastos (ITP/IVA, notaría, registro). Para una vivienda de 250.000 €, necesitas tener unos 75.000-80.000 € ahorrados." },
    { question: "¿Qué es el TAE y por qué difiere del TIN?", answer: "El TIN es el tipo nominal anual. El TAE incluye comisiones, gastos y la periodicidad de los pagos. Compara siempre hipotecas por TAE, no por TIN." },
    { question: "¿Puedo amortizar anticipadamente sin penalización?", answer: "Por ley, las comisiones de amortización anticipada están limitadas: máximo 0,15-0,25% los primeros años en variable, y 2% en fija. A veces compensa hacerlo para reducir intereses." },
    { question: "¿Qué pasa si no puedo pagar la hipoteca?", answer: "Habla con el banco antes del impago. Existen opciones: carencia, ampliación de plazo, dación en pago o Código de Buenas Prácticas si cumples requisitos. El impago puede llevar a ejecución hipotecaria." },
  ],
  related: ["calculadora-euribor", "calculadora-alquiler-vs-compra"],
};

function Metric({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${primary ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground" : "bg-muted"}`}>
      <div className={`text-xs ${primary ? "opacity-80" : "text-muted-foreground"}`}>{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}