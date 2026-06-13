import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { weekly: number; total: number; weeks: number }

export const baja: CalculatorDef<R> = {
  slug: "calculadora-baja-maternal-paternal",
  title: "Calculadora baja maternal y paternal",
  shortTitle: "Baja maternal",
  description: "Calcula la prestación por nacimiento y cuidado del menor en 2026.",
  longDescription: "Cuánto cobrarás durante la baja maternal o paternal según tu salario.",
  category: "laboral",
  icon: "Baby",
  time: "1 min",
  difficulty: "Fácil",
  fields: [
    { id: "grossMonthly", label: "Salario bruto mensual", type: "number", defaultValue: 2200, min: 0, max: 20000, step: 50, unit: "€" },
    { id: "type", label: "Tipo de baja", type: "select", defaultValue: "maternal", options: [
      { value: "maternal", label: "Maternal / progenitor gestante (16 semanas)" },
      { value: "paternal", label: "Paternal / otro progenitor (16 semanas)" },
    ] },
    { id: "weeks", label: "Semanas a disfrutar", type: "number", defaultValue: 16, min: 1, max: 26, step: 1, unit: "semanas" },
  ],
  calculate: (v) => {
    const base = +v.grossMonthly / 30; // base reguladora diaria
    const weekly = base * 7;
    const weeks = +v.weeks;
    return { weekly, total: weekly * weeks, weeks };
  },
  ResultsPanel: ({ results }) => (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="Prestación semanal" value={eur(results.weekly)} primary />
      <Metric label="Total estimado" value={eur(results.total)} sub={`${results.weeks} semanas al 100%`} />
    </div>
  ),
  article: `## Prestación por nacimiento y cuidado del menor\n\nDesde 2021, la baja por nacimiento es **igual para ambos progenitores: 16 semanas**, intransferibles y al 100% de la base reguladora. Las 6 primeras son obligatorias e ininterrumpidas tras el parto; las 10 restantes pueden disfrutarse hasta los 12 meses del bebé.\n\n## Requisitos\n\n- Estar afiliado y en alta.\n- Periodo mínimo de cotización (varía según edad).\n- La prestación la paga la **Seguridad Social**, no tu empresa.\n\n## ¿Y los autónomos?\n\nMismas 16 semanas. Si llevas <180 días cotizados, recibes la prestación no contributiva (24 días de subsidio).`,
  faqs: [
    { question: "¿Cobro el 100% de mi sueldo?", answer: "Sí, el 100% de tu base reguladora (similar a tu salario bruto). Sin techo salvo el tope máximo de cotización." },
    { question: "¿Puedo cogerla a tiempo parcial?", answer: "Sí, las 10 últimas semanas pueden compatibilizarse con trabajo a tiempo parcial, previo acuerdo con la empresa." },
    { question: "¿Y en partos múltiples?", answer: "Se amplía 2 semanas más por cada hijo a partir del segundo, para cada progenitor." },
    { question: "¿Cómo solicito la prestación?", answer: "Online en el portal Tu Seguridad Social o en oficinas del INSS, en los 15 días posteriores al nacimiento." },
    { question: "¿La baja cotiza?", answer: "Sí, durante toda la baja sigues cotizando como si trabajaras. Cuenta para jubilación y paro." },
  ],
  related: ["calculadora-finiquito", "calculadora-pension-jubilacion"],
};