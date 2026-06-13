import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { base: number; nursery: number; total: number; monthlyAdvance: number; eligible: boolean }

export const deduccionMaternidad: CalculatorDef<R> = {
  slug: "calculadora-deduccion-maternidad",
  title: "Calculadora Deducción por Maternidad 2026 + Cheque Guardería",
  shortTitle: "Deducción Maternidad",
  description: "Calcula los 1.200 € anuales por hijo menor de 3 y el cheque guardería de hasta 1.000 €.",
  longDescription: "Simulador de la deducción por maternidad (Art. 81 LIRPF) y el complemento por gastos de guardería en 2026.",
  category: "ayudas",
  icon: "Baby",
  time: "1 min",
  difficulty: "Fácil",
  fields: [
    { id: "children", label: "Hijos menores de 3 años", type: "number", defaultValue: 1, min: 0, max: 5, step: 1 },
    { id: "nursery", label: "Gasto guardería por hijo (mes)", type: "number", defaultValue: 250, min: 0, max: 1500, step: 10, unit: "€" },
    { id: "status", label: "Situación laboral de la madre", type: "select", defaultValue: "empleada", options: [
      { value: "empleada", label: "Asalariada (cotiza)" },
      { value: "autonoma", label: "Autónoma (cotiza)" },
      { value: "paro", label: "Desempleada" },
    ] },
    { id: "salary", label: "Salario bruto anual", type: "number", defaultValue: 22000, min: 0, max: 200000, step: 100, unit: "€" },
  ],
  calculate: (v) => {
    const eligible = (v.status === "empleada" || v.status === "autonoma") && +v.children > 0;
    const base = eligible ? 1200 * +v.children : 0;
    const nurseryYear = +v.nursery * 11 * +v.children;
    const nursery = eligible ? Math.min(1000 * +v.children, nurseryYear) : 0;
    const total = base + nursery;
    return { base, nursery, total, monthlyAdvance: base / 12, eligible };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Deducción anual total" value={eur(r.total)} primary />
        <Metric label="Deducción base (1.200 €/hijo)" value={eur(r.base)} />
        <Metric label="Cheque guardería" value={eur(r.nursery)} sub="Máx 1.000 €/hijo" />
        <Metric label="Adelanto mensual" value={eur(r.monthlyAdvance)} sub="Modelo 140" />
      </div>
      {!r.eligible && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">Para acceder a la deducción la madre debe estar dada de alta y cotizar a la Seguridad Social.</div>}
      <p className="text-xs text-muted-foreground">Se aplica en la declaración de la Renta o vía adelanto mensual de 100 €/mes (modelo 140). Fuente: <a className="underline" href="https://sede.agenciatributaria.gob.es/" target="_blank" rel="noopener">AEAT</a>.</p>
    </div>
  ),
  article: `## ¿Qué es la deducción por maternidad?\n\nEs una deducción en la cuota diferencial del IRPF (**Art. 81 LIRPF**) de hasta **1.200 €/año por hijo menor de 3 años**, para madres trabajadoras dadas de alta en la Seguridad Social.\n\n## Cheque guardería\n\nDesde 2018, las madres trabajadoras con hijos en escuelas infantiles o guarderías autorizadas pueden incrementar la deducción en hasta **1.000 €/año adicionales** por cada hijo.\n\n## Requisitos\n\n- Hijo menor de 3 años\n- Madre dada de alta en la Seguridad Social o mutualidad\n- Para el cheque guardería: gastos en centros autorizados (la guardería declara mediante modelo 233)\n\n## Cómo cobrarlo\n\nDos opciones: solicitar el **adelanto mensual** de 100 €/mes (modelo 140) o aplicar la deducción en la declaración anual.`,
  faqs: [
    { question: "¿Puede solicitarla el padre?", answer: "Solo si la madre ha fallecido o si la guarda y custodia corresponde solo al padre." },
    { question: "¿Cuánto se cobra al mes?", answer: "Hasta 100 € por hijo si se opta por el adelanto mensual." },
    { question: "¿Y si soy autónoma con cuota bonificada?", answer: "Tienes derecho igualmente si estás dada de alta en RETA y cotizas." },
    { question: "¿Puedo cobrar adelanto y cheque guardería?", answer: "Sí, el cheque guardería se regulariza en la declaración anual del IRPF." },
    { question: "¿Hay límite de renta?", answer: "No para la deducción base; el cheque guardería se limita a las cotizaciones de la madre en el año." },
  ],
  related: ["calculadora-familia-numerosa", "calculadora-irpf-2025"],
};