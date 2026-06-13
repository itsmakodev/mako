import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { final: number; finalNoContrib: number; contributed: number; gains: number; afterTax: number; chart: { year: number; con: number; sin: number }[] }

export const interesCompuesto: CalculatorDef<R> = {
  slug: "calculadora-interes-compuesto",
  title: "Calculadora interés compuesto",
  shortTitle: "Interés compuesto",
  description: "Simula cuánto puede crecer tu dinero invirtiendo a largo plazo.",
  longDescription: "El poder del interés compuesto explicado y simulado con gráficos.",
  category: "inversion",
  icon: "TrendingUp",
  time: "2 min",
  difficulty: "Fácil",
  fields: [
    { id: "initial", label: "Capital inicial", type: "number", defaultValue: 5000, min: 0, max: 5000000, step: 100, unit: "€" },
    { id: "monthly", label: "Aportación mensual", type: "number", defaultValue: 200, min: 0, max: 50000, step: 10, unit: "€" },
    { id: "rate", label: "Rentabilidad anual", type: "number", defaultValue: 7, min: 0, max: 30, step: 0.1, unit: "%" },
    { id: "years", label: "Plazo", type: "number", defaultValue: 25, min: 1, max: 60, step: 1, unit: "años" },
    { id: "tax", label: "Impuesto sobre ganancias", type: "number", defaultValue: 21, min: 0, max: 50, step: 0.5, unit: "%" },
  ],
  calculate: (v) => {
    const initial = +v.initial; const monthly = +v.monthly; const r = +v.rate / 100; const years = +v.years;
    const chart: R["chart"] = []; let con = initial; let sin = initial;
    for (let y = 1; y <= years; y++) {
      con = con * (1 + r) + monthly * 12 * (1 + r / 2);
      sin = sin * (1 + r);
      chart.push({ year: y, con: Math.round(con), sin: Math.round(sin) });
    }
    const final = con; const contributed = initial + monthly * 12 * years;
    const gains = final - contributed;
    const afterTax = final - gains * (+v.tax / 100);
    return { final, finalNoContrib: sin, contributed, gains, afterTax, chart };
  },
  ResultsPanel: ({ results }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Capital final" value={eur(results.final)} primary />
        <Metric label="Después de impuestos" value={eur(results.afterTax)} />
        <Metric label="Total aportado" value={eur(results.contributed)} />
        <Metric label="Ganancia neta" value={eur(results.gains)} sub="por interés compuesto" />
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <LineChart data={results.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => eur(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Legend />
            <Line type="monotone" dataKey="con" stroke="var(--primary)" strokeWidth={3} dot={false} name="Con aportaciones" />
            <Line type="monotone" dataKey="sin" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} name="Solo capital inicial" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  ),
  article: `## El interés compuesto, la octava maravilla del mundo\n\nLa frase atribuida a Einstein resume el concepto: **los intereses generan más intereses**. Cuanto más tiempo dejas crecer tu dinero, mayor es el efecto exponencial.\n\n## La regla del 72\n\nDivide 72 entre tu rentabilidad anual y obtienes los años necesarios para duplicar tu inversión. Al 7% anual, duplicas en ~10 años. Al 10%, en ~7 años.\n\n## ¿Dónde invertir en España?\n\n- **Fondos indexados** (MSCI World, S&P 500) vía Indexa, MyInvestor o Bankinter Roboadvisor.\n- **ETFs** desde brokers como DEGIRO o Interactive Brokers.\n- **Planes de pensiones**: ventaja fiscal pero menor liquidez.\n- **Cuentas remuneradas y depósitos**: bajo riesgo, baja rentabilidad.\n\n## Tributación de las ganancias\n\nEl rendimiento del ahorro tributa al **19%** hasta 6.000 €, **21%** hasta 50.000 €, **23%** hasta 200.000 €, **27%** hasta 300.000 € y **28%** a partir de ahí.`,
  faqs: [
    { question: "¿Qué rentabilidad es realista?", answer: "Largo plazo en renta variable global: 7-9% anual nominal (4-6% real). En renta fija o depósitos: 2-4%." },
    { question: "¿Cuándo empiezo a notar el efecto compuesto?", answer: "A partir del año 10-15. Es exponencial, no lineal: los primeros años parece poco, los últimos despegan." },
    { question: "¿Aportar mensualmente o un lump-sum?", answer: "Estadísticamente, invertir todo de golpe (lump sum) bate al DCA en el 66% de los casos. Pero el DCA reduce el impacto emocional." },
    { question: "¿Afecta la inflación?", answer: "Sí. Resta 2-3% al rendimiento nominal para obtener el rendimiento real. Invierte para batir la inflación." },
    { question: "¿Plan de pensiones o fondo indexado?", answer: "Indexado: más flexibilidad y liquidez. Pensiones: ventaja fiscal hasta 1.500 €/año pero capital atrapado hasta la jubilación." },
  ],
  related: ["calculadora-pension-jubilacion", "calculadora-hipoteca"],
};