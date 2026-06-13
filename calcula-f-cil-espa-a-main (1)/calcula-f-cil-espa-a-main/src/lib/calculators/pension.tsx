import type { CalculatorDef } from "./types";
import { eur, pct } from "../format";
import { Metric } from "../../components/Metric";

interface R { pension: number; rate: number; annual: number }

export const pension: CalculatorDef<R> = {
  slug: "calculadora-pension-jubilacion",
  title: "Calculadora de pensión de jubilación",
  shortTitle: "Pensión jubilación",
  description: "Estima tu pensión pública en función de años cotizados y bases de cotización.",
  longDescription: "Simulador de pensión de jubilación según la Seguridad Social en España 2026.",
  category: "laboral",
  icon: "Award",
  time: "2 min",
  difficulty: "Medio",
  fields: [
    { id: "yearsContrib", label: "Años cotizados al jubilarte", type: "number", defaultValue: 38, min: 15, max: 50, step: 1, unit: "años" },
    { id: "averageBase", label: "Base reguladora estimada (media últimos 25 años)", type: "number", defaultValue: 2200, min: 1300, max: 5000, step: 10, unit: "€" },
    { id: "retirementAge", label: "Edad de jubilación", type: "number", defaultValue: 67, min: 60, max: 75, step: 1, unit: "años" },
  ],
  calculate: (v) => {
    const years = +v.yearsContrib;
    // Escala simplificada: 15 años → 50%, 36,5+ años → 100%
    let rate = 0;
    if (years >= 36.5) rate = 1;
    else if (years >= 15) rate = 0.5 + (years - 15) * 0.5 / 21.5;
    let pension = +v.averageBase * rate;
    pension = Math.max(874, Math.min(3267, pension)); // mínima y máxima 2026
    return { pension, rate, annual: pension * 14 };
  },
  ResultsPanel: ({ results }) => (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="Pensión mensual (14 pagas)" value={eur(results.pension)} primary />
      <Metric label="Pensión anual" value={eur(results.annual)} />
      <Metric label="% sobre base reguladora" value={pct(results.rate)} />
      <Metric label="Pensión máxima 2026" value={eur(3267)} />
    </div>
  ),
  article: `## Cómo se calcula la pensión en España\n\nLa pensión de jubilación contributiva depende de tres factores: tus **bases de cotización**, los **años cotizados** y la **edad** a la que te jubiles.\n\n## Base reguladora\n\nDesde 2027 será la media de los últimos **25 años** cotizados. Las bases más antiguas se actualizan con el IPC.\n\n## Porcentaje sobre la base\n\n- 15 años cotizados: 50%\n- Cada año adicional suma un porcentaje progresivo.\n- 36 años y 6 meses (transitorio hacia 37 años en 2027): 100%.\n\n## Edad ordinaria de jubilación\n\n- Con 38 años y 3 meses cotizados: 65 años.\n- Resto: 66 años y 8 meses en 2026, llegando a 67 años en 2027.`,
  faqs: [
    { question: "¿Cuál es la pensión mínima en 2026?", answer: "874,70 €/mes para mayores de 65 con cónyuge a cargo. Sin cónyuge: 708,50 €/mes (14 pagas)." },
    { question: "¿Cuál es la pensión máxima?", answer: "3.267,60 €/mes en 14 pagas (45.746 €/año), aunque tu base reguladora sea mayor." },
    { question: "¿Puedo jubilarme anticipadamente?", answer: "Sí, voluntariamente desde 65 años con 35 años cotizados, con coeficientes reductores del 13-21%. Forzosa por despido desde 63 años." },
    { question: "¿Y la jubilación parcial?", answer: "Compatible con un contrato a tiempo parcial. Reduces jornada y cobras una pensión proporcional." },
    { question: "¿Cuenta el desempleo cotizado?", answer: "Sí. El paro contributivo cotiza por la base reguladora del último empleo. El subsidio para mayores de 52 también cuenta." },
  ],
  related: ["calculadora-finiquito", "calculadora-interes-compuesto"],
};