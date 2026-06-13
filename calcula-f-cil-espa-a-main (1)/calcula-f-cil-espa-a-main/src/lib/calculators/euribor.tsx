import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { newRate: number; newMonthly: number; diff: number; oldMonthly: number }

export const euribor: CalculatorDef<R> = {
  slug: "calculadora-euribor",
  title: "Calculadora Euríbor",
  shortTitle: "Euríbor",
  description: "Estima cuánto subirá o bajará tu cuota cuando revisen tu hipoteca variable.",
  longDescription: "Calcula la nueva cuota de tu hipoteca variable con la última revisión del Euríbor.",
  category: "hipoteca",
  icon: "TrendingUp",
  time: "1 min",
  difficulty: "Fácil",
  fields: [
    { id: "capital", label: "Capital pendiente", type: "number", min: 1000, max: 5000000, step: 1000, defaultValue: 150000, unit: "€" },
    { id: "years", label: "Años restantes", type: "number", min: 1, max: 40, step: 1, defaultValue: 20, unit: "años" },
    { id: "spread", label: "Diferencial sobre Euríbor", type: "number", min: 0, max: 5, step: 0.05, defaultValue: 0.85, unit: "%" },
    { id: "oldEuribor", label: "Euríbor anterior", type: "number", min: -1, max: 10, step: 0.01, defaultValue: 3.65, unit: "%" },
    { id: "newEuribor", label: "Euríbor nuevo (revisión)", type: "number", min: -1, max: 10, step: 0.01, defaultValue: 2.58, unit: "%" },
  ],
  calculate: (v) => {
    const c = +v.capital; const n = +v.years * 12;
    const monthly = (rate: number) => {
      const r = rate / 12; return r === 0 ? c / n : (c * r) / (1 - Math.pow(1 + r, -n));
    };
    const oldRate = (+v.oldEuribor + +v.spread) / 100;
    const newRate = (+v.newEuribor + +v.spread) / 100;
    return { newRate, newMonthly: monthly(newRate), oldMonthly: monthly(oldRate), diff: monthly(newRate) - monthly(oldRate) };
  },
  ResultsPanel: ({ results }) => (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="Nueva cuota" value={eur(results.newMonthly, 2)} primary />
      <Metric label="Cuota anterior" value={eur(results.oldMonthly, 2)} />
      <Metric label="Diferencia mensual" value={`${results.diff >= 0 ? "+" : ""}${eur(results.diff, 2)}`} sub={results.diff >= 0 ? "sube" : "baja"} />
      <Metric label="Impacto anual" value={`${results.diff >= 0 ? "+" : ""}${eur(results.diff * 12, 2)}`} />
    </div>
  ),
  article: `## Cómo funciona la revisión del Euríbor\n\nLa mayoría de hipotecas variables en España se revisan cada **6 o 12 meses**. En la fecha de revisión, el banco toma el Euríbor publicado por el BCE el mes anterior y le suma tu diferencial fijo. Ese nuevo tipo se aplica hasta la siguiente revisión.\n\n## ¿Por qué sube o baja la cuota?\n\nSi el Euríbor del mes de tu revisión es mayor que el anterior, tu cuota sube. Si es menor, baja. En 2025 el Euríbor empezó a bajar desde máximos del 4% hasta estabilizarse cerca del 2,5% en 2026, lo que está aliviando a millones de hipotecados.\n\n## Qué hacer si la cuota me sigue ahogando\n\nNegocia con tu banco: subrogación a fija, ampliación de plazo, carencia parcial. También puedes amortizar capital para reducir cuota.`,
  faqs: [
    { question: "¿Cuándo se revisa mi hipoteca?", answer: "Mira tu escritura. La mayoría son anuales en el aniversario de la firma; algunas son semestrales." },
    { question: "¿Qué Euríbor aplican exactamente?", answer: "El publicado oficialmente en el BOE correspondiente al mes anterior a la revisión (o dos meses antes, según contrato)." },
    { question: "¿Puedo pasarme de variable a fija?", answer: "Sí, mediante novación con tu banco o subrogación a otra entidad. Las comisiones están limitadas por ley." },
    { question: "¿Qué es el diferencial?", answer: "El porcentaje fijo que el banco suma al Euríbor. Habitualmente entre 0,5% y 1%. Cuanto menor, mejor hipoteca conseguiste." },
    { question: "¿Y si el Euríbor es negativo?", answer: "Por ley el tipo de interés total no puede ser inferior a 0%, aunque el Euríbor sí lo sea." },
  ],
  related: ["calculadora-hipoteca", "calculadora-alquiler-vs-compra"],
};