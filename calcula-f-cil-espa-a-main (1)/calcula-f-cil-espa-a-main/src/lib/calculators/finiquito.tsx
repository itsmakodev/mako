import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { severance: number; prorrata: number; vacation: number; total: number; daysWorked: number }

function daysBetween(a: string, b: string) { return Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 86400000)); }

export const finiquito: CalculatorDef<R> = {
  slug: "calculadora-finiquito",
  title: "Calculadora de finiquito e indemnización",
  shortTitle: "Finiquito",
  description: "Calcula tu finiquito completo: indemnización, paga extra prorrateada y vacaciones.",
  longDescription: "Calculadora oficial de finiquito según el Estatuto de los Trabajadores.",
  category: "laboral",
  icon: "FileSignature",
  time: "3 min",
  difficulty: "Medio",
  fields: [
    { id: "salary", label: "Salario bruto anual", type: "number", defaultValue: 25000, min: 0, max: 500000, step: 100, unit: "€" },
    { id: "startDate", label: "Fecha de inicio", type: "date", defaultValue: "2020-01-01" },
    { id: "endDate", label: "Fecha de fin", type: "date", defaultValue: new Date().toISOString().slice(0, 10) },
    { id: "type", label: "Tipo de extinción", type: "select", defaultValue: "objetivo", options: [
      { value: "voluntaria", label: "Baja voluntaria" }, { value: "disciplinario", label: "Despido disciplinario procedente" },
      { value: "objetivo", label: "Despido objetivo (20 días/año)" }, { value: "improcedente", label: "Despido improcedente (33 días/año)" },
      { value: "fin_obra", label: "Fin de obra/contrato temporal (12 días/año)" },
    ] },
    { id: "vacationDays", label: "Días de vacaciones no disfrutadas", type: "number", defaultValue: 0, min: 0, max: 60, step: 1, unit: "días" },
  ],
  calculate: (v) => {
    const dailySalary = +v.salary / 365;
    const daysWorked = daysBetween(v.startDate as string, v.endDate as string);
    const years = daysWorked / 365;
    const monthly = +v.salary / 12;
    let factor = 0; let cap = Infinity;
    if (v.type === "objetivo") { factor = 20; cap = monthly * 12; }
    else if (v.type === "improcedente") { factor = 33; cap = monthly * 24; }
    else if (v.type === "fin_obra") { factor = 12; }
    const severance = Math.min(cap, dailySalary * factor * years);
    const prorrata = (+v.salary / 365) * (daysWorked % 365) * 0; // simplificación: pagas extra prorrateadas
    const prorrataExtra = monthly * ((daysWorked % 365) / 365) * 2 / 12; // 2 pagas extra prorrateadas
    const vacation = dailySalary * +v.vacationDays;
    return { severance, prorrata: prorrataExtra, vacation, total: severance + prorrataExtra + vacation, daysWorked };
  },
  ResultsPanel: ({ results }) => (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="Total finiquito" value={eur(results.total)} primary />
      <Metric label="Indemnización" value={eur(results.severance)} />
      <Metric label="Pagas extra prorrateadas" value={eur(results.prorrata)} />
      <Metric label="Vacaciones no disfrutadas" value={eur(results.vacation)} />
      <Metric label="Días trabajados" value={`${results.daysWorked} días`} />
    </div>
  ),
  article: `## Qué incluye el finiquito\n\nEl finiquito es la liquidación final al terminar una relación laboral. Incluye salario pendiente, pagas extra prorrateadas, vacaciones no disfrutadas y, según el tipo de extinción, la **indemnización por despido**.\n\n## Indemnizaciones según el tipo de despido\n\n- **Despido objetivo procedente**: 20 días por año trabajado, máximo 12 mensualidades.\n- **Despido improcedente**: 33 días por año, máximo 24 mensualidades (45 días para contratos previos a feb-2012, con prorrateo).\n- **Despido colectivo (ERE)**: mínimo 20 días/año, negociable al alza.\n- **Baja voluntaria o disciplinario procedente**: sin indemnización.\n- **Fin de contrato temporal**: 12 días por año.\n\n## ¿Tributa el finiquito?\n\nLa indemnización por despido obligatorio está **exenta de IRPF** hasta 180.000 €. El resto del finiquito (pagas, vacaciones) tributa como rendimiento del trabajo.`,
  faqs: [
    { question: "¿Puedo firmar el finiquito sin renunciar a reclamar?", answer: "Sí. Añade 'no conforme' o 'recibí pero no acepto' antes de tu firma para reservarte el derecho a reclamar en 20 días hábiles." },
    { question: "¿Cuánto plazo tengo para reclamar?", answer: "20 días hábiles desde el despido para presentar papeleta de conciliación. Pasado ese plazo caduca la acción." },
    { question: "¿La indemnización tributa?", answer: "Está exenta hasta el límite legal del Estatuto (20 días/año, 33 días en improcedente) y hasta 180.000 €. El exceso tributa con reducción del 30% si llevas >2 años." },
    { question: "¿Pierdo derecho al paro si firmo?", answer: "No, salvo en baja voluntaria. Conserva la carta de despido para tramitarlo en SEPE." },
    { question: "¿Qué hago si no me pagan el finiquito?", answer: "Demanda en juzgado de lo social en 1 año. Cobrarás con intereses por mora del 10% anual." },
  ],
  related: ["calculadora-pension-jubilacion", "calculadora-baja-maternal-paternal"],
};